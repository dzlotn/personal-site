# The Backstory

Finger Lakes Goods, an e-commerce retailer, came to Cornell Data Strategy wanting to know how the 2025 alcohol tariffs were actually affecting their sales, not just assume it based on headlines. We created an ML model that predicts a tariff's drawdown in sales and the subsequent price build-back-up afterward, plus a dashboard that lets the business simulate the financial impact of any future tariff.

# Technical Details

Figuring out whether a tariff actually moved sales meant asking the same question three different ways, since any single method can fool itself. Difference-in-differences compares sales in a tariff-exposed category, like alcohol, against a category that wasn't tariffed at all, which isolates the tariff's effect from everything else moving at the same time. A more conservative machine-learning method cross-checks that estimate, since a simple regression can be too quick to call a chance fluctuation a real effect. A separate time-series model forecasts what sales would have looked like with no tariff at all, then compares that counterfactual against what actually happened. The three methods didn't fully agree, which was itself the finding: a small retailer's sales data is noisy enough that a rigorous estimate can look large under one method and uncertain under another.

That research became the model behind the tool. Rather than predicting a single flat drop, it predicts the actual shape of a tariff's impact over time: an initial drawdown in sales right after the tariff hits, followed by a gradual build-back-up as prices and demand adjust. The deployed tool is a Django app: upload a sales history, pick a real or hypothetical tariff date, and get a day-by-day forecast comparing a tariff-free baseline against a tariff-impacted line, with dollar-amount estimates and confidence intervals so the business can see the uncertainty, not just a single number.

It also runs inside a genuinely tight memory budget on a free-tier server, so heavier statistical libraries only load when a request actually needs them.

# Key Features

* _Grounded in Real Causal Research_: The core financial-impact number comes from a difference-in-differences analysis of real transaction data
* _Seasonal Forecasting_: Fits a time-series model to each upload, capturing weekly patterns and trend from the business's own history
* _Multi-Scenario Comparison_: Compares tariff implementation dates side-by-side to identify optimal timing and worst-case scenarios
* _Statistical Validation_: Reports real accuracy metrics alongside every forecast
* _Financial Impact Quantification_: Converts an empirically measured tariff effect into daily dollar-amount loss projections
* _Flexible Ingestion_: Automatically parses an arbitrary sales CSV upload, with validation for malformed histories

# Project Link:
[Website](https://tarriff-modeling.onrender.com/) | [Presentation](https://drive.google.com/file/d/1XIqoP5ErljefJAYJWv46s0QmtjDf4Y0E/view?usp=sharing)

# Technologies Used:
Django, Python, Pandas, NumPy, Statsmodels (SARIMAX), Scikit-Learn, DoubleML, Prophet, Jupyter, Seaborn, Matplotlib, Plotly, Causal Inference, Difference-in-Differences, Gunicorn, WhiteNoise, Render
