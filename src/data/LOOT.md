# The Backstory

LOOT came out of my research with the [Relax ML Lab](https://relax-ml.cs.cornell.edu/) at Cornell, advised by Kilian Q. Weinberger and Christopher De Sa. Diffusion language models are a promising alternative to the standard left-to-right (autoregressive) way of generating text: instead of writing one token at a time, they start from a fully masked sequence and fill in many tokens in parallel. The catch is that once a masked diffusion model commits to a token, it can never take it back, so one early mistake carries through the rest of the generation. Our paper, *Empowering Masked Diffusion Models to Self-Correct with Leave-One-Out Transformers*, was accepted to NeurIPS 2026.

<!-- TODO: add a sentence or two about what you personally worked on -->

# Technical Details

Masked diffusion models (MDMs) have two related weaknesses. First, they can't revise: generation progressively unmasks `[MASK]` tokens, and an unmasked token is frozen for good. Second, they learn from a sparse signal: the training loss is only computed on the masked positions, so every visible token in a training example contributes nothing directly. You can't just add a loss on the visible tokens either, because a normal bidirectional transformer can see the token it's being asked to predict and would learn to copy it.

The fix is a **leave-one-out** model: a network whose prediction at position *i* depends on every token *except* the token at *i* itself. That makes it legal to supervise every position, and at inference time it gives a clean way to ask "given everything else, is this token still the right one?"

![The Leave-One-Out Transformer: forward, backward, and output streams merged at every layer](/images/projects/loot.png)

The Leave-One-Out Transformer (LOOT) builds this out of three streams. A forward stream reads left context causally, a backward stream reads right context causally, and an output stream (initialized from the `[MASK]` embedding) merges the two. Earlier "hollow" transformers merged left and right context only once at the end, or at a few intermediate layers; LOOT merges at **every** layer, which consistently improves perplexity. All three streams share their attention projections, so LOOT has the same parameter count as a standard diffusion transformer of the same size. The merge itself is reformulated as sliding-window attention over the concatenated backward and forward keys, so it runs on a stock FlashAttention call with no custom kernels.

Because the model never sees its own target, the training objective can be rewritten to cover every position instead of only the masked ones. The standard MDM objective is:

```math
\mathcal{L}_{\mathrm{MDM}}(\theta) = \mathbb{E}_{t,\mathbf{x},M_t}\left[\frac{\alpha_t'}{1-\alpha_t}\sum_{i\in M_t}\log p_\theta(x_i\mid \mathbf{x}[M_t])\right]
```

Rao-Blackwellizing over each position's own masking event gives the LOOT objective, which supervises every token:

```math
\mathcal{L}_{\mathrm{LOOT}}(\theta) = \mathbb{E}_{t,\mathbf{x},M_t}\left[\alpha_t' \sum_{i=1}^{N}\log p_\theta(x_i \mid \mathbf{x}[M_t])\right]
```

With a log-linear noise schedule the weight is a constant, which also removes a weighting term that blows up in the standard objective. The result is a lower-variance estimator, and on its own it improves validation perplexity by roughly 3 points over the MDM loss on the same architecture.

At inference, one LOOT forward pass returns the leave-one-out prediction for every position at once. Generation runs a normal unmasking phase and then a self-correction phase, where each step picks positions to resample using a correction policy (blocked Gibbs, Metropolis-Hastings, or a greedy best-improvement rule). Unlike remasking approaches such as ReMDM, each correction step costs exactly one model evaluation no matter how many tokens it revises.

# Results

* On LM1B, LOOT reaches 31.02 validation perplexity, improving on MDLM (31.80) and matching the strongest dense-supervision baseline
* On OpenWebText, LOOT with blocked Gibbs self-correction reaches a MAUVE score of 0.408 at 256 forward evaluations, beating ReMDM's 0.348 at 2048
* That works out to 8× fewer forward evaluations, 3.5× fewer inference FLOPs, and roughly 8× faster wall-clock sampling than ReMDM
* An existing MDM checkpoint can be finetuned into LOOT for about 1.25× the total training compute, gaining self-correction without training from scratch

# Key Features

* _Leave-One-Out Architecture_: Forward, backward, and output streams merged at every layer, so each prediction never sees its own input token
* _Dense Supervision_: A Rao-Blackwellized training objective that supervises every token, not just the masked ones
* _Self-Correction_: Revises already-generated tokens with Gibbs, Metropolis-Hastings, or best-improvement policies at one forward pass per step
* _No Extra Parameters_: Shared attention projections keep the parameter count equal to a standard diffusion transformer
* _FlashAttention-Compatible_: The merge runs as sliding-window attention, with no custom kernels

# Project Link:
[Paper](https://arxiv.org/abs/2611.19127) | [NeurIPS Poster](https://neurips.cc/virtual/2026/loc/sydney/poster/150367)

# Technologies Used:
Python, PyTorch, FlashAttention, Transformers, Masked Diffusion Models, Rao-Blackwellization, MCMC Sampling
