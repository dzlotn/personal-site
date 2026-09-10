# The Backstory

I wanted a project that combined C++, motion, and physics, while giving me more hands-on experience working alongside AI coding tools like Claude and Codex instead of writing everything by hand. Meander is what came out of that: a real-time, interactive fluid simulator that computes the incompressible Navier-Stokes equations directly on the GPU. It lets you paint obstacles and terrain into the flow with the mouse and watches water carve channels through sand as it runs.

# Technical Details

Simulating water in real time means solving the same physics every single frame: how the fluid moves, how it resists compressing, and how it keeps the swirling detail that makes it read as turbulent rather than smoothing out into mush. Meander runs that whole solve on the GPU, as a fixed pipeline of compute shaders that executes every frame.

The first problem is just moving the fluid. A naive way of advecting velocity (carrying it along with the flow) blurs detail away almost immediately, since it boils down to repeated interpolation. Meander uses a semi-Lagrangian backtrace corrected with a clamped MacCormack scheme instead, which recovers most of the sharp detail a naive approach would smear into mush.

The second problem is that water doesn't compress. Without something enforcing that, fluid would pile up or thin out unrealistically wherever the simulation drifts. So every frame also runs a pressure solve whose only job is to remove that divergence from the velocity field, keeping the fluid physically consistent from one frame to the next.

Even with both of those working, a raw simulation still looks flat, because numerical methods have a tendency to quietly smooth away the small-scale rotational detail that makes turbulence look like turbulence. Vorticity confinement fixes that by re-injecting the energy the solver removes.

![Downstream turbulence cascading off multiple obstacles into smaller eddies](/images/projects/meander-vortexstreet.jpg)

That fix has a real cost: vorticity confinement is mathematically an anti-diffusion process, so left on its own it's unconditionally unstable and the simulation eventually blows up. The fix is a small amount of real numerical viscosity running alongside it, just enough to keep things stable indefinitely without canceling out the turbulent detail vorticity confinement adds back.

With the core fluid dynamics working, a material system sits on top of it: every cell in the grid is Fluid, Solid, or erodible Terrain. Fast flow erodes terrain into sediment, which redeposits wherever the water slows back down, so a painted sand dam doesn't just sit there; it actually breaches, and the channel migrates over time like a real riverbed. Rendering then composites all of that into something that reads as water: a fake sun-lit glint, and foam driven by vorticity rather than raw speed, so turbulence looks like turbulence instead of every fast-moving patch of water turning white.

# Key Features

* _Real GPU Fluid Solver_: Computes the incompressible Navier-Stokes equations on the GPU every frame through an ordered pipeline of compute shaders
* _Sharp, Stable Advection_: Semi-Lagrangian backtrace with a clamped MacCormack correction, balanced against a real vorticity-confinement instability
* _Erodible Terrain_: Fast flow erodes terrain into sediment, which redeposits in slack water, so channels genuinely migrate over time
* _Live Interactive Control_: Every simulation parameter is exposed live, with instant switching between the composite render and raw velocity, pressure, or vorticity views
* _Physically-Motivated Rendering_: A single composite shader fakes sun-lit water, with foam driven by vorticity rather than raw speed
* _Headless Scenario Scripting_: Environment-variable driven automation for reproducing a scene and capturing a clean screenshot

# Project Link:
[GitHub](https://github.com/dzlotn/meander)

# Technologies Used:
C++, OpenGL 4.3 Compute Shaders, GLSL, GLFW, GLEW, GLM, Dear ImGui, CMake, Ninja, Claude, Codex
