# The Backstory

Most password tools stop at "make it longer," which never sat right with me. I wanted to understand and build the actual reasoning behind why a password is weak, not just trust a green/yellow/red bar. Fortress is the result: it checks a password against the specific patterns that make it guessable, and does it end-to-end (generate, analyze, encrypt, and store), with every piece hand-written across Python, Java, and TypeScript instead of leaning on an existing library.

# Technical Details

Passwords are generated at prime-number lengths, which resist certain length-based pattern attacks better than round numbers, while actively rejecting the patterns that make passwords crackable: repeated or alphabetically adjacent characters, keyboard-adjacent key pairs, and dictionary words hiding inside the string. A failing candidate gets thrown out and regenerated rather than patched.

Scoring blends a length curve, a common-word penalty, and character-distribution balance into a hand-built strength formula, alongside real information-theoretic entropy, the same metric used to describe how hard a password actually is to brute-force. Character-level analysis runs in a separate Java program that the Python side calls out to directly.

For storage, Fortress includes a from-scratch AES-256 implementation (real S-box and Galois-field math, the full 14-round key schedule, CBC mode with a fresh IV every time, and PBKDF2 key derivation) with its own test suite. A full TypeScript/React port reimplements the entire engine so the browser and command-line versions always agree.

# Key Features

* _Prime-Length Generation_: Builds passwords at prime-number lengths, resisting length-based pattern attacks
* _Pattern Rejection_: Screens out keyboard-adjacent characters, repeats, and dictionary words before a password is shown
* _Hand-Built Entropy Scoring_: A custom-weighted strength formula plus true information-theoretic entropy
* _From-Scratch AES-256_: A real, tested AES-256 implementation with proper key derivation for encrypted storage
* _Cross-Language Architecture_: Pairs a Python generation engine with a dedicated Java analysis module
* _Full Web Port_: A TypeScript/React version reproduces the entire engine in the browser

# Project Link:
[GitHub](https://github.com/dzlotn/FORTRESS)

# Technologies Used:
Python, Java, TypeScript, React, Vite, NumPy, Secrets, Cryptography, AES-256, PBKDF2-HMAC-SHA256, JSON, Logging
