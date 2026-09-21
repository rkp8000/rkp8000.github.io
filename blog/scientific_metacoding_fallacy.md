# A scientific meta-coding fallacy
**Rich Pang**

2026-09-21

Let us time-travel for a moment back to the era before LLMs.

Suppose now that in the course of a scientific project you find yourself in want of some code that performs analyses X and Y.
Suddenly, it comes to your attentio that another lab has already written the code that performs analysis X.
Moreover, their code is publicly available.

At first glance, it seems like it should take *less* time to download and extend the other lab's code than to write analyses X and Y from scratch.
After all, in the former case you only need write Y, whereas in the latter you must write X *and* Y.
Nevertheless, unless the code for X is something like a standard, actively maintained and documented software like a common numpy function, in many cases the latter is actually *faster* in the long run.

This is because an essential dimension of science is that every component of a scientific study should be justifiable by the study authors.
Thus, if you plan to use someone else's code in a study you intend to publish it's quite important that you fully understand it and can account for every single line.
So, how long does it take to (1) understand the other lab's code to the point where you can justify every line then correctly augment it to implement analysis Y, vs (2) simply write analyses X and Y from scratch yourself?

The trouble with using other people's code out-of-the-box, especially for anything state-of-the-art, is that it may take quite some time to really understand its operation.
For better or worse, scientific coding has far fewer standards than app development, and although most scientists use only a handful of programming languages there is a large variety of libraries and programming patterns in the wild, typically reflecting individual familiarity and taste.
Whereas some may have a single script for an entire sequence of analyses that produce a figure, others have a modular structure inspired by commercial software, although both may be equally sound scientifically.

Due to this diversity, in most cases understanding someone else's code to the point where you can confidently justify every line requires much more time and energy than just reading through the code and docs.
Unless you really code in extremely similar ways, you might typically also need to gain expert familiarity with the programming language and all the libraries they've used, and fully internalize their software engineering patterns and mental models for how they organized the codebase, which can at times be very complex, even if the algorithms and procedures of the analysis itself can be concisely stated.
On the other hand, if you write X and Y yourself using languages, libraries, design patterns, and mental models with which you're already familar, then once it's operational there will be very little ambiguity as to how it works, and you'll be able to account for every line and decision since you were the one who wrote it.
The first question, then, is whether everything that must be undertaken to understand how the other lab implemented X and why they made all the myriad decisions that they did along the way, is in fact faster than just writing X yourself.

A second question concerns how long such understanding remains in memory.
It is widely held, for instance, that doing problem sets yourself leads to deeper and more lasting comprehension than reading the solutions manual, even though the latter may give a momentary sense of understanding.
Similarly, while a careful examination of another codebase might lead to a sufficient understanding of its operation for a time, it is highly likely that your understanding of a codebase you write yourself will be far more cohesive and longer lasting.
Thus, writing X and Y yourself may not only be faster, or at least not obviously slower, than extending someone else's code, but may also lead to a longer lasting understanding, including a justification of every line and design decision that you can confidently restate months or even years after publication.

Crucially, none of this is to say that the other lab's code for X is not extremely valuable.
In particular, if implementing X is not straightforward, studying the other lab's code can be extremely useful for learning how to implement it yourself.
It can also be useful to play around with it in a sandbox to get a feel for how it works.
However, when it comes time to run an analysis you plan to publish, one would do well to consider the advantages not only in comprehensive understanding but in overall time to publication, of writing everything yourself while using the existing codebase only as a guide.

In our modern age, LLMs can write extensive, often functional code, in response to a natural language prompt.
At first glance, it would seem that this should tremendously increase scientific coding productivity.
However, if as before we hold that every line in every piece of code used for a scientific study, whether generated by a human or LLM, should be ultimately justifiable by the authors, things become more nuanced once again.
If we treat the code generated by an LLM like a newly discovered public codebase written by another lab, i.e. manifesting effectively instantaneously, then we once again see that the bottleneck is not so much the writing but the comprehensive understanding of the code.

Still, LLMs can be excellent assistants in many ways.
For instance, they can adeptly handle writing certain types of code, such as reformatting the tick labels on a plot, that may be rather cumbersome to do oneself but can be quickly verified for correctness.
They are also generally quite good at providing high-level explanations how other codebases work, including ones they've generated themselves.
They can also read over code that you have written and point out whether there are any obvious errors.
Nonetheless, there may be a significant cost to LLMs writing the majority of your scientific code, even though this may appear to be on the surface the default use case.
It is thus important to be thoughtful about how to integrate them into one's workflow, especially in the pursuit of science, and the most obvious ways to do so may not always be the best.
