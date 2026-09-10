# The Backstory

I took this on through Cornell Data Strategy because it was a real client with a real question, not a hypothetical dataset: did the 2025 tariffs actually move sales for Finger Lakes Goods, a Finger Lakes retailer, and by how much? Real point-of-sale data went through several causal-inference methods before any dashboard existed, and the result now powers a self-serve tool that lets the business simulate the financial impact of a tariff on any date.

# Technical Details

The research compared sales in tariff-exposed and non-exposed categories with difference-in-differences, cross-checked against a more conservative machine-learning causal estimate, and separately modeled a no-tariff counterfactual baseline. The three methods didn't fully agree, which was itself the finding — a small retailer's sales data is noisy enough that a rigorous estimate can look large under one method and uncertain under another.

The deployed tool is a Django app: upload a sales history, pick a real or hypothetical tariff date, and get a day-by-day forecast comparing a tariff-free baseline against a tariff-impacted line, with dollar-amount estimates and confidence intervals. The forecasting engine is a seasonal time-series model fit directly on the upload, and it reports real accuracy metrics alongside every forecast rather than presenting it as ground truth.

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
