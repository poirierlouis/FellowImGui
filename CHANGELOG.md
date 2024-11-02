# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- UI glitch when resizing viewport ([#51]).

[#51]: https://github.com/poirierlouis/FellowImGui/issues/51

------------------------

## [0.1.5] - 2024-10-31
### Fixed
- prevent removal of a selected widget when erasing content in an input (using
  `Delete` shortcut).

------------------------

## [0.1.4] - 2024-10-28
### Removed
- access to editor on mobiles.

### Added
- responsiveness in page `fig-readme`.
- delete button in context menu of `fig-tree`.
- `Delete` shortcut to remove selected widget.

------------------------

## [0.1.3] - 2024-10-04
### Removed
- change state variable of input-like widgets for `Lua sol2`.

### Changed
- improve formatting of widgets for `Lua sol2` (less verbose).

------------------------

## [0.1.2] - 2024-10-04
### Fixed
- drag/drop not working on WebKit browsers ([#33]).
- 404 redirection to webapp instead of the 404 page of GitHub.

[#33]: https://github.com/poirierlouis/FellowImGui/issues/33

------------------------

## [0.1.1] - 2024-07-30
### Changed
- improve load time using lazy loading.

------------------------

## [0.1.0] - 2024-07-30
### Added
- initial version with support for `Lua sol2`.

<!-- Table of releases -->
[Unreleased]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/poirierlouis/FellowImGui/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/poirierlouis/FellowImGui/releases/tag/v0.1.0
