# Handoff prompt for an AI assistant

Paste everything below the line into the assistant.

---

You are continuing work on "Codo", a personal desktop code editor (Work In Progress). Be brief and direct. Make small commits. When something fails, show me the exact error and your fix.

## What Codo is
- Personal repo based on Pulsar (github.com/pulsar-edit/pulsar, MIT), the community continuation of Atom. Electron 32.3.3, Node 20.18.1 (see .nvmrc). Yarn 1.x, not npm.
- Keep the MIT license and LICENSE.md. NO AI features of any kind in the product.
- The ppm folder is a regular directory here (the submodule was flattened); there is no .gitmodules.

## Changes already made
1. Display-level rebrand: package.json productName and branding.name = "Codo"; script/electron-builder.js displayName 'Codo' and appId `com.personal.codo`; README; --version output; menus; About credit.
2. New logo and icons: resources/app-icons/beta.{svg,png,ico,icns}, resources/app-icons/pulsar.ico, resources/pulsar.png, resources/icons/*.png, resources/win/installerSidebar.bmp.
3. pulsar-updater and the `github` package are disabled by default (core.disabledPackages default in src/config-schema.js). `github` alone cost ~420 ms of startup.
4. settings-view's `ppm outdated` network check is deferred 15 s.
5. Opt-in benchmark hook in src/atom-environment.js: if env CODO_BENCH=<file> is set, startup markers and per-package timings are written to that file and the window closes. Inert otherwise.
6. Two GitHub Actions workflows were drafted but NEVER RUN: .github/workflows/release.yml (all platforms, on tag v*) and ci.yml (Linux build and smoke test). They are modelled on Pulsar's own .github/workflows/build.yml.

## Deliberately not changed yet
The `pulsar` executable and CLI name, ~/.pulsar, the package registry (web.pulsar-edit.dev), and Help/About URLs (still Pulsar's). deb/rpm packages are therefore still named `pulsar_*`. The Linux executable is `pulsar` (script/electron-builder.js baseName).

## Build recipe that worked on Linux
System deps: build-essential libsecret-1-dev fakeroot rpm libx11-dev libxkbfile-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2-dev xvfb.

    yarn install
    yarn build
    yarn electron-rebuild -f -w better-sqlite3    # REQUIRED, see gotcha 1
    yarn build:apm                                # ~2 min, REQUIRED before dist
    yarn dist --target tar.gz                     # output in binaries/
    xvfb-run -a node_modules/.bin/electron --no-sandbox --disable-gpu . -f

## Gotchas already found
1. `yarn build` did not produce better_sqlite3.node for Electron. Without the extra rebuild the window crashes ("Cannot find module .../better_sqlite3.node" from src/state-store/sql.js). `--version` does NOT catch it; launch a real window (the CODO_BENCH run is the test).
2. script/electron-builder.js refuses to run unless ppm/bin exists, so run `yarn build:apm` first.
3. `yarn dist` takes `--target` (comma-separated). npmRebuild is false, so native modules must already be rebuilt.
4. Headless Electron needs xvfb, `--no-sandbox`, usually `--disable-gpu`. Kill stray electron processes between runs (single-instance lock).
5. `electron . -f` is a dev run and not representative of release speed.

## Performance data (dev run, Codespaces + xvfb, software rendering; compare relatively)
Startup 2344 ms originally, about 1800-2000 ms after the changes above (noise ±100 ms). settings-view is still ~100-150 ms. A packaged-build measurement is still pending.

## YOUR TASKS
1. Run .github/workflows/ci.yml, then release.yml via workflow_dispatch, and FIX whatever breaks. Expect problems first on Windows and macOS (native module compiles, Python/VS tooling, paths, quoting). Windows needs ppm/bin/node.exe and the Windows 10 SDK step. Check the exact macOS runner names are still valid.
2. Confirm the packaged Linux binary name is `pulsar` (the smoke test finds it with `-name pulsar`) and that file names in the Release are sensible.
3. Cut a test tag (e.g. v0.0.1-wip) and confirm ONE pre-release gets every installer: Linux AppImage/deb/rpm/tar.gz, Windows NSIS .exe + zip, macOS dmg + zip for both arm64 and x64. Unsigned is fine. Optional signing/notarization stays behind secrets (CSC_LINK, CSC_KEY_PASSWORD, APPLEID, APPLEID_PASSWORD, TEAM_ID) and must be skipped when absent.
4. Pin third-party actions to full SHAs once everything works. Keep permissions minimal (`contents: write` only on the release job). This repo may be private and macOS minutes cost 10x, so never build macOS on every push.
5. Then continue: finish renaming the internals (pulsar CLI, ~/.pulsar, deb/rpm names), replace Pulsar URLs, measure the packaged build, and trim startup further.

Report back with: what you changed, the first-run result per OS, and each build error with the fix you applied.
