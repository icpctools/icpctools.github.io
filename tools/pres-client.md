---
name: Presentation Client
icon: fas fa-desktop
tagline: Animated display of scoreboard and other contest data
repo: icpctools
readme: PresContest/README.md
order: 4
assets: [presentations]
---

The Presentation Client is a Java application for displaying animated contest data on
LED screens or large monitors. It can display the current contest scoreboard, information
on problems, a judge queue, the contest clock, contest logos, a floor map, graphs,
messages, or over 50 other animated displays.

It can run in two modes: standalone or client. In standalone mode you can connect to any
[Contest API](https://ccs-specs.icpc.io/2026-01/contest_api) (e.g. a CCS or the CDS) and
predefine which presentation(s) to display or cycle through. In client mode you can only
connect to a CDS, and a Presentation Admin is used to control what is displayed on each
screen at any time.
