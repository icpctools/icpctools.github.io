---
name: Team View
icon: fas fa-tv
tagline: "Web app for watching contests: teams, scoreboard, and live webcam and desktop feeds"
description: "Team View is a web application for watching ICPC programming contests: see the teams, track how they are doing, view the scoreboard, or watch live webcam and desktop feeds"
repo: team-view
readme: README.md
order: 8
assets: [team-view]
image: icpctools/team-view
packages: ['@icpctools/contest-api', '@icpctools/contest-ui']
---

Team View is a web application for watching ICPC programming contests. It allows you to see
which teams are competing, track how they're doing, view the scoreboard, or watch live
webcam and desktop feeds.

Team View works with any server that supports the Contest API specification (including several
CCSs and the CDS) and dynamically changes based on the data available (e.g. webcam links only
exist when the server supports them).
It can be run directly as a Node server or via a multi-architecture (amd64 and arm64)
[container image](https://github.com/icpctools/team-view/pkgs/container/team-view).

If you run Team View in a web browser in kiosk mode, it is a direct replacement for the
[Coach View](coach-view).
