---
name: Resolver
icon: fas fa-trophy
tagline: Animated reveal of final contest results
repo: icpctools
readme: Resolver/README.md
order: 2
screenshot: resolver.png
assets: [resolver]
---

The Resolver is a Java application for animating contest results.
It shows the final runs submitted during a contest in an
interesting way, leading up to display of the contest winners.

The Resolver is designed to be used in contests where the scoreboard is "frozen"
prior to the end of the contest - that is, where the result of runs submitted in the
last part of the contest are marked as "pending".
The Resolver produces a dynamic display by stepping through ("resolving") these
pending runs up from the bottom of the scoreboard, stopping to highlight group or
individual awards.

Resolving is controlled via keyboard - the presenter can control the speed, pause,
or step through at their own pace. The resolver can run standalone from any
[Contest API](https://ccs-specs.icpc.io/2026-01/contest_api) source or a local
contest pacakge, or it can connect to a CDS, which allows any number of client
resolvers to be connected (e.g. multiple screens, or even multiple sites) and
be controlled via the main resolver.

An award utility is also provided to allow an admiistrator to configure awards
prior to running the resolver.
