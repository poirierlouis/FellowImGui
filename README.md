# Fellow ImGui

[![Release](https://img.shields.io/badge/release-alpha%200.2.0-blue)](https://github.com/poirierlouis/FellowImGui/releases)

A webapp tool to design a user interface and generate code for [Dear ImGui].
It is currently powered by [imgui-js].

You can play with this tool at [Fellow ImGui].

<!-- Insert GIF -->

[Dear ImGui]: https://github.com/ocornut/imgui
[imgui-js]: https://github.com/flyover/imgui-js
[Fellow ImGui]: https://fellowimgui.dev/

# Getting started

## Features

- real-time preview
- drag-n-drop to add widgets
- tree of widgets to organize the layout
- generate ImGui code on the fly for:
  - Lua
- import / export FIG files
- import / export FIGT template files

# Development

## Requirements
- [node.js] 22.0.0+
- [pnpm] 10.0.0+

[node.js]: https://nodejs.org/en/download
[pnpm]: https://pnpm.io/installation

## Installation

1. Clone this repository:
```shell
git clone https://github.com/poirierlouis/FellowImGui.git
```
2. Install dependencies:
```shell
pnpm install
```
3. Run with hot-reload:
```shell
pnpm start
```
4. Open your browser at [http://localhost:4200](http://localhost:4200).

## Code style

Biome is installed to lint / format the entire codebase. Trust it to do its 
job.
```shell
pnpm lint
```

<!-- TODO: add a pre-commit hook to run Biome. -->
