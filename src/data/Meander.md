# The Backstory

I wanted a project that combined C++, motion, and physics, while giving me more hands-on experience working alongside AI coding tools like Claude and Codex instead of writing everything by hand. Meander is what came out of that: a real-time, interactive fluid simulator that solves the incompressible Navier-Stokes equations directly on the GPU. It lets you paint obstacles and terrain into the flow with the mouse and watches water carve channels through sand as it runs.

# Technical Details

Every frame runs a full fluid solve as an ordered pipeline of GPU compute shaders. Velocity is advected with a semi-Lagrangian backtrace, corrected with a clamped MacCormack scheme to keep the flow sharp instead of smearing. Because the fluid is incompressible, each frame also runs a pressure solve to remove divergence from the velocity field, so fluid can't pile up or vanish at a point.

Vorticity confinement re-injects the small-scale rotational energy the numerical scheme removes, which is what makes the flow read as turbulent instead of smooth. Vorticity confinement is mathematically an anti-diffusion process, so a small amount of real numerical viscosity runs alongside it to keep the simulation stable indefinitely instead of diverging over time.

![Downstream turbulence cascading off multiple obstacles into smaller eddies](/images/projects/meander-vortexstreet.jpg)

A material system sits on top of the fluid dynamics — every cell is Fluid, Solid, or erodible Terrain. Fast flow erodes terrain into sediment, which redeposits wherever the water slows down, so a painted sand dam breaches and channels migrate over time. Rendering composites the simulation into a water-like look, with a fake sun-lit glint and foam driven by vorticity rather than raw speed, so turbulence reads as turbulence instead of every fast patch of water turning white.

# Key Features

* _Real GPU Fluid Solver_: Solves the incompressible Navier-Stokes equations on the GPU every frame through an ordered pipeline of compute shaders
* _Sharp, Stable Advection_: Semi-Lagrangian backtrace with a clamped MacCormack correction, balanced against a real vorticity-confinement instability
* _Erodible Terrain_: Fast flow erodes terrain into sediment, which redeposits in slack water, so channels genuinely migrate over time
* _Live Interactive Control_: Every simulation parameter is exposed live, with instant switching between the composite render and raw velocity, pressure, or vorticity views
* _Physically-Motivated Rendering_: A single composite shader fakes sun-lit water, with foam driven by vorticity rather than raw speed
* _Headless Scenario Scripting_: Environment-variable driven automation for reproducing a scene and capturing a clean screenshot

# Project Link:
[GitHub](https://github.com/dzlotn/meander)

# Technologies Used:
C++, OpenGL 4.3 Compute Shaders, GLSL, GLFW, GLEW, GLM, Dear ImGui, CMake, Ninja, Claude, Codex
