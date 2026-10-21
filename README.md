# ICPC Tools website

The [ICPC Tools](https://tools.icpc.global) website, built with SvelteKit and Tailwind CSS.

The site is fully static: every page is prerendered at build time, so it can be hosted on GitHub Pages
or any static file server. It shows the same tool and release data as the original Hugo site
([icpctools.github.io](https://github.com/icpctools/icpctools.github.io)), plus
[Team View](https://github.com/icpctools/team-view) releases.

## Tools

Each tool has a Markdown file in `tools/`, e.g. `tools/cds.md`. The file name is the tool's URL
(`/cds`), and the file starts with its details, followed by the page content in Markdown:

```markdown
---
name: Contest Data Server
icon: fas fa-server                  # Font Awesome icon
tagline: Single-point URL services for accessing contest data   # shown on the home page
repo: icpctools                      # GitHub repo in the icpctools org
readme: CDS/README.md                # path to the tool's README within the repo
order: 1                             # position on the home page and in the menu
screenshot: cds.png                  # image in tools/ shown on the tool page (optional)
assets:                              # release zip prefixes, main download first (optional)
  wlp.CDS: Open Liberty              #   with labels when there are several, otherwise a list:
  CDS: WAR only                      #   assets: [resolver]
image: icpctools/cds                 # container image on ghcr.io (optional)
packages: ['@icpctools/contest-api'] # npm packages (optional)
---

The Contest Data Server (CDS) is ...
```

Link to another tool's page with a relative link, e.g. `[Contest Data Server](cds)`.

## Data

`scripts/fetch-data.mjs` pulls data from GitHub into `src/lib/data/` (gitignored) before each build:

- all [icpctools releases](https://github.com/icpctools/icpctools/releases) and their zip assets
- all [team-view releases](https://github.com/icpctools/team-view/releases) and their zip assets

The data is organized by tool: each tool (keyed by its file name in `tools/`) has a list of
releases, found using `assets`, `image`, and `npm` in its `tools/*.md` file. Both repos are handled the same way: release assets
named `<prefix>-<version>.zip` (plus optional `.sha256`/`.sha512` files) become downloads for the
tool with that zip prefix, e.g. `resolver-2.7.1420.zip` for the Resolver. A tool can also have a
container image (shown when a matching version tag exists on ghcr.io) and npm packages (shown when a
matching version exists on npmjs.com). A GitHub release only counts as a release of a tool if it
contains at least one of these for that tool.

Documentation links point to each tool's `README.md` on GitHub (see `readme` in each `tools/*.md` file).

Set `GITHUB_TOKEN` to avoid GitHub's 60 requests/hour unauthenticated rate limit. If fetching fails,
the build continues with previously fetched data when there is some.

## Developing

```bash
pnpm install
pnpm dev        # fetches data on first run only; `pnpm run fetch` to refresh
pnpm build      # fetches data, then builds the static site into build/
pnpm preview
pnpm check
```

Set `BASE_PATH` (e.g. `BASE_PATH=/icpctools-website`) when hosting from a sub-path.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on push, every 6 hours, and on a
`repository_dispatch` event of type `release` (which the icpctools and team-view release workflows
could send to update the site immediately).
