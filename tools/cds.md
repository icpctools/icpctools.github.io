---
name: Contest Data Server
icon: fas fa-server
tagline: Single-point URL services for accessing contest data
repo: icpctools
readme: CDS/README.md
order: 1
assets:
  wlp.CDS: Open Liberty
  CDS: WAR only
image: icpctools/cds
---

The Contest Data Server (CDS) is a server that allows secure,
authenticated HTTP connections to contest data.
It provides REST endpoints for accessing a variety of contest-related services, allowing clients
to access those services via standard HTTP requests.

Why would I need a CDS when I already have a Contest Control System (CCS)?
The CDS:
- Supports a wider set of contest data, including webcam and desktop streams, recording reaction
  videos, and more
- Reduces load on CCS - let the CCS focus on teams and the CDS can handle external load
- Allows you to control multiple presentation clients through a single interface
- Implements the ICPC data access policy so every user only sees the contest data they're meant to

The CDS can be run as a standalone application or via a
[container image](https://ghcr.io/icpctools/cds).
