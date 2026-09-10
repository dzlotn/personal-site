# The Backstory

After taking CS 3110 (Cornell's functional programming course), I wanted to cement those OCaml skills on something real instead of letting them fade, and I wanted to actually understand how a robo-advisor decides what to recommend instead of trusting a black box. OptiFolio is a personalized portfolio optimizer built from scratch in OCaml: it converts a short investment questionnaire into a quantitative risk profile and scores real stocks against it, with every financial calculation hand-written rather than wired up from an existing finance library.

# Technical Details

A handful of questions about risk tolerance, goals, experience, and time horizon convert into a single quantitative risk score, which sets individualized targets for volatility, risk-adjusted return, and acceptable drawdown. A conservative investor and an aggressive one get genuinely different thresholds, not just a different label. Every stock is scored against those targets using standard financial metrics computed directly from raw daily price data, and every recommendation comes back with a plain-language explanation of exactly why it matched.

Getting reliable market data was its own problem: the API has a strict rate limit, so refreshing a stock universe means throttling requests, and a bad ticker doesn't return a clean error; it returns a normal-looking response with an error message buried inside it that has to be checked for explicitly before it's trusted.

OptiFolio ships both a command-line questionnaire and a full graphical interface, and both are powered by the exact same optimization engine. Rather than linking the GUI library and the async I/O library into one binary (which invites a subtle class of deadlock), the GUI runs as its own separate process, collects the same answers, and hands them back to the same scoring engine the pure command-line path uses.

# Key Features

* _Risk Profiling_: Converts questionnaire responses into a quantitative risk profile with target volatility, drawdown tolerance, and return expectations
* _In-House Financial Analytics_: Computes volatility, Sharpe ratio, and maximum drawdown directly from raw price data, with no external finance library
* _Explainable Recommendations_: Every stock match comes with a plain-language explanation of why it fits the user's profile
* _Dual Interface, One Engine_: Command-line and graphical interfaces run as separate processes but share the exact same optimization engine
* _Resilient Market Data_: Pulls and validates real daily price data from the Alpha Vantage API, handling rate limits and malformed responses gracefully

# Project Link:
[GitHub](https://github.com/dzlotn/OptiFolio) | [Demo](https://youtu.be/MRM-1u-30JI)

# Technologies Used:
OCaml, Lwt, Bogue, Yojson, Cohttp-lwt-unix, Dune, OUnit2, Bisect_ppx, Alpha Vantage API
