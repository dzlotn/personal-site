# The Project

OptiFolio is a personalized portfolio optimization tool built in OCaml that analyzes your investment preferences and recommends stocks tailored to your risk profile. The system combines user questionnaires with real-time stock data analysis to provide data-driven investment recommendations. By converting qualitative responses into quantitative risk metrics, OptiFolio helps investors build personalized stock portfolios based on their risk tolerance, investment goals, and financial preferences.

# Key Features

* _Risk Profiling_: Converts questionnaire responses into a comprehensive risk profile with target volatility, drawdown tolerances, and industry interests
* _Stock Scoring_: Scores cached stocks and current investments based on volatility match, Sharpe ratio, drawdown tolerance, and return performance
* _Stock Refresh_: Allows refresh of specific stocks to the most up-to-date information
* _Dual Interface_: CLI and GUI implementations sharing the same optimization engine
* _Stock Validation_: Validates stocks with the stock exchange before proceeding

# Project Link:
[GitHub](https://github.com/dzlotn/OptiFolio) | [Demo](https://youtu.be/MRM-1u-30JI)

# Technologies Used:

OCaml, Lwt (Async I/O), Yojson (JSON parsing), Cohttp-lwt-unix (HTTP client), Bogue (GUI library), Dune (Build system), Alpha Vantage API
