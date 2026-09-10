# The Backstory

I wanted a project that went all the way from raw sensor hardware to a real signal-processing pipeline to a usable web app, on a problem that actually mattered. Parkinson's tremor is normally assessed by a doctor watching a patient for a few minutes during a clinic visit — a single subjective snapshot instead of a continuous record of how a tremor behaves throughout the day. TremorTrackr is a wrist-worn sensor, built with a four-person team of software and biomedical engineers, that replaces that snapshot with continuous, quantified data a patient or doctor can actually track over time.

# Technical Details

The wearable combines a motion sensor and a muscle-activity (EMG) sensor on the wrist, since neither alone tells the full story — motion captures the tremor's mechanical effect directly, while EMG picks up the underlying muscle activity as a noisier corroborating signal.

Data streams wirelessly to a server, which filters out noise and voluntary movement, then applies frequency-domain analysis to extract a precise tremor frequency and power reading, fusing the two channels into one result weighted toward whichever is measuring the tremor more directly.

One tricky problem: the device's real sampling rate isn't fixed, since wireless transmission timing varies. Instead of trusting a hardcoded rate, the system measures the actual elapsed time per batch and derives the true sampling frequency after the fact, which every filter and frequency calculation downstream depends on.

# Key Features

* _Dual Sensor Fusion_: Combines motion and muscle-activity (EMG) sensing for a more complete picture of a tremor
* _Precise Frequency Analysis_: Digital signal processing extracts a tremor frequency sharp enough to catch subtle changes over time
* _Self-Calibrating Sample Rate_: Measures its own real sampling frequency instead of trusting a fixed rate
* _Wireless Data Collection_: Streams sensor data from the wearable to a web server in real time
* _Web-Based Dashboard_: A browser dashboard shows real-time and historical tremor data
* _Secure, Self-Contained Accounts_: Local authentication with industry-standard password hashing, no third-party auth dependency

# Project Link:
[Website](https://tremor-website.vercel.app/) | [Github](https://github.com/dzlotn/TremorTrackr) | [Project Paper](https://drive.google.com/file/d/1wY2wYA9lL9wg6kHggdBuMoolQyTB409-/view?usp=sharing)

# Technologies Used:
Arduino Nano 33 IoT, C++, Python, Flask, SciPy, NumPy, JavaScript, HTML, CSS, SQL, PBKDF2-HMAC-SHA256, Signal Processing, Matplotlib
