<p align="center"><img src="resources/app-icons/beta.svg" width="128" alt="Codo logo"></p>

# Codo

> ## 🚧 Work In Progress
> Codo is under active development and is **not ready for daily use**. Expect bugs, missing pieces and breaking changes.

Codo is a personal, hackable desktop code editor, built on [Pulsar](https://github.com/pulsar-edit/pulsar) (the community continuation of [Atom](https://github.com/atom/atom)). It runs on a modern Electron (32) and Node (20). No AI features, by design.

## Status

- Builds and opens on Linux (Electron 32.3.3, Node 20.18.1).
- Installers for Linux, Windows and macOS (arm64 + Intel) are built by GitHub Actions: see `.github/workflows/release.yml`. First runs are untested.
- Still uses Pulsar internals under the hood (`pulsar` CLI name, `~/.pulsar` folder, Pulsar's package registry) so community packages keep working. These will be renamed later.
- The `github` package and the Pulsar auto-updater are disabled by default.

## Download

Go to **Releases** and pick the file for your system. Builds are unsigned for now:

| System | What to expect |
|---|---|
| macOS | Right-click the app, choose **Open**. Or run `xattr -dr com.apple.quarantine /Applications/Codo.app` |
| Windows | SmartScreen warns: click **More info**, then **Run anyway** |
| Linux | AppImage: `chmod +x` it first. Also available as `.deb`, `.rpm` and `.tar.gz` |

## Build from source (Linux)

Needs Node 20.18.1 (see `.nvmrc`), Yarn 1, Python 3 with `setuptools`, and: `build-essential libsecret-1-dev libxkbfile-dev libx11-dev libxss-dev libgdk-pixbuf2.0-dev libgtk-3-dev libasound2-dev`.

```bash
yarn install
yarn build
yarn electron-rebuild -f -w better-sqlite3   # needed, or the window crashes on start
yarn build:apm
yarn start
```

Installers: `yarn dist` (output in `binaries/`).

## Releasing

```bash
git tag v0.1.0 && git push origin v0.1.0
```

GitHub Actions builds every platform and attaches the files to a pre-release.

## License

MIT. Codo is based on Pulsar and Atom, both MIT licensed; their copyright notices are kept in `LICENSE.md`.
