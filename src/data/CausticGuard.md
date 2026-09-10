# The Backstory

I've spent the last two years on CUAUV's software subteam working on the vision subsystem, and CausticGuard came directly out of a failure we hit live at competition. CUAUV's submarine has to detect and classify objects underwater in real time, then act on them. Earlier years handled this with classical computer vision, but the robustness gains from deep learning detectors like YOLOv5 to changes in lighting and object orientation were too significant to pass up, so 2025 was largely spent integrating YOLO into the vision pipeline: recording, labeling, and training against real footage.

At competition, a model trained indoors didn't hold up outdoors: varying underwater lighting broke detection in ways the test tank never revealed, and I wanted to fix that at the algorithm level instead of just tweaking camera settings and hoping.

# Technical Details

Strong outdoor sunlight produces caustics: shifting bright patterns formed when light refracts through a moving water surface. Caustics change brightness, texture, and edges frame to frame, and once a pixel is hit by a caustic line its RGB information is effectively lost for that frame, which degrades YOLO's detection confidence and bounding-box accuracy.

![Competition footage showing caustics rippling across the pool floor and boards](/images/projects/causticguard-competition.gif)

Tuning the ZED camera's exposure, gain, and saturation for outdoor use (set automatically via SHM variables in the `camera_calibration` group during the capture source's calibration sequence) reduces glare but doesn't remove caustics; it just redistributes which pixels are corrupted.

The actual fix is temporal smoothing: replacing a corrupted pixel with a blended value from recent frames, since caustics are small, fast-moving, and effectively random frame to frame.

Below is an image of how temporal smoothing works on a stationary image:

![Sliding-window temporal smoothing across frames](/images/projects/causticguard-temporalmedian.png)

A plain sliding-window median works on a static scene but breaks down once the sub or the target is moving, since the same pixel location no longer corresponds to the same physical point across frames.

That mismatch produces motion blur and temporal ghosting that breaks YOLO's bounding boxes. Recomputing a full median every frame is also too expensive to keep pace with the camera.

CausticGuard instead applies a motion-aware, edge-aware smoothing algorithm. Smoothing strength is driven by the sub's Kalman-estimated velocity magnitude:

```math
v_{\mathrm{mag}} := \sqrt{\mathrm{vel}_x^2 + \mathrm{vel}_y^2 + \mathrm{vel}_z^2 + \mathrm{heading}^2}
```

which feeds an adaptive exponential moving average, so smoothing automatically eases off as the sub speeds up:

```math
\mathrm{EMA}_{t+1} := (1 - \alpha)\,\mathrm{EMA}_{t} + \alpha\,\mathrm{Frame}_{t}
```

```math
\alpha = \mathrm{clamp}\!\left(0.1\left(1 + \frac{v_{\mathrm{mag}}}{3}\right),\ 0.05,\ 0.30\right)
```

YOLO's own previous bounding boxes define a reduced-smoothing buffer around each detected object, so an object's earlier position never blends into its current one and detection edges stay sharp.

The computation is O(N) and fully parallel per pixel, so it was ported to CUDA: thousands of lightweight GPU threads each handle one pixel instead of processing sequentially on the CPU. Since YOLO also runs on the GPU, image data stays resident in GPU memory through more of the pipeline instead of round-tripping to the CPU. Eliminating those transfers, combined with the added parallelism, nearly doubled overall FPS.

Beyond caustics, the vision pipeline needed a broader rework to support YOLO reliably. RGB, depth, and surface normals are now captured as one synchronized bundle instead of three independently-timed streams, with YOLO detections attached to that same bundle before it's published downstream; when YOLO isn't needed, the bundle routes to CPU-based classical vision through the same interface.

A single fused CUDA kernel now handles the preprocessing YOLO needs before inference (letterboxing to the model's input resolution, converting interleaved RGBA into planar CHW format, and normalizing) in one GPU pass instead of several separate operations, with each thread mapping one output pixel back through the inverse letterbox transform via bilinear interpolation. The kernel writes half-precision values directly into the input tensor to match the TensorRT engine, which runs the network in FP16 on the Jetson Orin, cutting both compute and memory-bandwidth cost.

Input and output buffers are allocated once at startup and reused for the life of the process rather than per frame, cutting memory usage by roughly 30% and making per-frame latency far more predictable.

Camera capture and YOLO inference also run as two independent processes, a producer and a consumer, coordinated through a shared triple buffer using a SeqLock scheme, so the inference service wakes exactly when a new frame is ready instead of polling for one.

![Triple-buffer, lock-free handoff between the camera capture process and the YOLO inference process](/images/projects/causticguard-triplebuffer.png)

Together, these changes roughly doubled throughput while keeping RGB, depth, normals, and YOLO detections temporally aligned throughout the pipeline. What started as a fix for sunlight glare turned into a full rework of the vision pipeline's performance, and it now runs comfortably in real time at competition.

# Key Features

* _Motion-Adaptive Temporal Smoothing_: A GPU exponential moving average whose strength is driven by a real, Kalman-derived velocity formula
* _Edge-Aware Blending_: Uses YOLO's own bounding boxes to keep object edges sharp through the smoothing
* _CUDA-Accelerated Pipeline_: Ported to CUDA for real-time, massively parallel per-pixel processing, nearly doubling overall FPS
* _Synchronized Multi-Modal Capture_: RGB, depth, and surface normals captured as one time-aligned bundle
* _Fused CUDA Preprocessing Kernel_: Letterboxing, resizing, format conversion, and FP16 normalization in a single GPU pass feeding directly into TensorRT
* _Producer-Consumer Vision Architecture_: Decouples camera capture from YOLO inference across two processes with a lock-free triple buffer

# Project Link:
[GitHub](https://github.com/dzlotn/CausticGuard)

# Technologies Used:
C++, CUDA, Python, PyTorch, OpenCV, TensorRT, ZED Camera SDK, Kalman Filtering, Shared Memory (SHM) IPC, Temporal Smoothing
