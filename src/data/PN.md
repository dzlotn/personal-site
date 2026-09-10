# The Backstory

A trucking company came to Cornell Data Strategy with an unusual ask: they didn't want to buy existing routing software, they wanted one built for them instead. I built NexusRTS with Ahmed Abdulla and Sourabh Velaga to do exactly that: it scores candidate routes on real-time weather, forecasted traffic, and fuel-stop access, then estimates the actual dollar cost of each option.

# Technical Details

Routes come from a truck-specific routing API carrying the load's real height, weight, and length, so it avoids roads a truck legally or physically can't take. Each candidate is scored across weather severity (sampled with arrival time factored in), forecasted traffic, and fuel-stop accessibility.

Traffic scoring is a forecast, not a lookup: every sensor station has its own trained time-series model, refit against recent history and projected forward to the truck's actual arrival time, then normalized by lane count so a busy six-lane highway and a busy two-lane road aren't scored equally congested.

Cost is real too: fuel burn modeled against cargo weight, multiplied by live diesel pricing from a government API. When cost matters most to the user, routes that are dramatically pricier than the alternatives get actively penalized rather than just sorted last.

# Key Features

* _Truck-Aware Routing_: Real vehicle dimensions and weight, avoiding roads a truck legally or physically can't take
* _Multi-Factor Scoring_: Combines live weather, forecasted traffic, and fuel-stop accessibility into one score
* _Per-Station Traffic Forecasting_: Predicts congestion at actual arrival time using trained models, not current conditions
* _Live Cost Estimation_: Converts distance and cargo weight into a real dollar estimate using live diesel pricing
* _Freight Corridor Analysis_: Network-level analysis to identify bottlenecks along major freight corridors
* _Interactive Visualization_: A React and Google Maps frontend for comparing scored routes side-by-side

# Project Link:
[Website](https://project-nexus-self.vercel.app/) | [Presentation](https://docs.google.com/presentation/d/1ah3KbjfIadPFYacOld8m2VpP7oCQDwwXUvGVEW_ey3c/edit?usp=sharing)

# Technologies Used:
Flask, React, TypeScript, Vite, Tailwind CSS, Radix UI, Pandas, NumPy, GeoPandas, NetworkX, Statsmodels (SARIMAX), Joblib, Parquet, TomTom Routing API, Google Maps API, OpenWeatherMap API, NREL Fuel Station API, EIA API, Gunicorn
