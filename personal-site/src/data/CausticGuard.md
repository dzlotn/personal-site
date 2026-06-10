# The Project

CausticGuard is a motion-adaptive caustics suppression system for underwater computer vision built for CUAUV (Cornell University Autonomous Underwater Vehicle). Caustics are high-frequency, rapidly changing brightness patterns that form when sunlight refracts off curved or turbulent water surfaces, creating major noise for computer vision systems. The system uses temporal smoothing with motion-adaptive exponential moving averages to suppress caustics while avoiding motion blur and ghosting when the vehicle moves.

# Key Features

* _Motion-Adaptive Filtering_: Computes Kalman-estimated velocity magnitude to dynamically adjust smoothing strength based on vehicle motion
* _Temporal Smoothing_: Uses exponential moving average that adapts alpha values from 0.05 to 0.30 based on robot velocity
* _Real-time Performance_: Runs at O(N) complexity with full pixel-level parallelism, maintaining frame rate performance
* _Camera Calibration_: Optimizes ZED camera parameters for outdoor environments to reduce sun glare
* _3D World-Space Architecture_: Future implementation uses point cloud transformation and world coordinate alignment for ghosting-free suppression

# Project Link:
[TBA](#)

# Technologies Used:

C++, Python, OpenCV, ZED Camera SDK, Computer Vision, Kalman Filtering, Exponential Moving Average, Point Cloud Processing, Temporal Smoothing
