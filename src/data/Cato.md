# The Backstory

I built Cato during an internship after seeing the same bottleneck play out over and over: engineers debugging a complex internal developer tool had their answers scattered across two-plus years of support tickets, 1,000+ internal wiki pages, and chat history, with no way to search across all of it at once. That meant multi-day SLAs on questions that had usually already been answered somewhere — the knowledge existed, it just wasn't reachable, and I wanted to close that gap.

# Technical Details

Cato runs retrieval in two stages instead of a single embedding-similarity lookup. A fine-tuned bi-encoder first pulls a broad set of semantically similar candidates from the consolidated corpus, optimizing for recall since it only needs the right answer to be *somewhere* in the set. A domain-tuned cross-encoder then re-ranks those candidates by jointly encoding the question and each candidate together — far more accurate than comparing independent embeddings, but too slow to run over the whole corpus directly.

Cheap broad recall followed by expensive precise re-ranking on a shortlist is what keeps end-to-end response time under 20 seconds despite the corpus size. In production, Cato resolves roughly 50-60% of weekly developer questions without a human stepping in, while harder or ambiguous questions still route to a person instead of getting a confidently wrong answer.

# Key Features

* _Knowledge Consolidation_: Ingests over two years of support data, including thousands of service request logs, 1,000+ wiki documents, and chat conversations
* _Bi-Encoder Architecture_: Two-stage semantic retrieval with a fine-tuned bi-encoder for recall and a domain-tuned cross-encoder for precision re-ranking
* _Low Latency_: Responds in under 20 seconds, reducing resolution time from multi-day SLAs to near-instant
* _Production API_: Structured JSON responses enable easy integration with internal tools and dashboards
* _High Accuracy_: Answers roughly 50-60% of weekly support questions without human intervention

# Technologies Used:
Java, Python, Apache Lucene, Tensorflow, PyTorch, Hugging Face, MySQL, React, Gemini, Confluence, Slack, Gitlab
