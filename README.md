# ICPC Tools website

The [ICPC Tools](https://tools.icpc.global) website, built with SvelteKit and Tailwind CSS.

The site is fully static: every page is prerendered at build time, so it can be hosted on GitHub Pages
or any static file server. It shows the same tool and release data as the original Hugo site
([icpctools.github.io](https://github.com/icpctools/icpctools.github.io)), plus
[Team View](https://github.com/icpctools/team-view) releases.

## Data

`scripts/fetch-data.mjs` pulls data from GitHub into `src/lib/data/` (gitignored) before each build:

- all [icpctools releases](https://github.com/icpctools/icpctools/releases) and their zip assets
- all [team-view releases](https://github.com/icpctools/team-view/releases) and their zip assets

The data is organized by tool: each tool (keyed by its slug in `src/lib/tools.ts`) has a list of
releases, configured in `TOOLS` in the script. Both repos are handled the same way: release assets
named `<prefix>-<version>.zip` (plus optional `.sha256`/`.sha512` files) become downloads for the
tool with that zip prefix, e.g. `resolver-2.7.1420.zip` for the Resolver. A tool can also have a
container image (shown when a matching version tag exists on ghcr.io) and npm packages (shown when a
matching version exists on npmjs.com). A GitHub release only counts as a release of a tool if it
contains at least one of these for that tool.

Documentation links point to each tool's `README.md` on GitHub (see `readme` in `src/lib/tools.ts`).

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
