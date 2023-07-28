# Developer guide

## Setup

Use the latest version of Node.js and npm.

1. Check out the code from the remote repository.
2. Run `npm install-ci-test` (or `npm cit`).

## Release

1. Update [`CHANGELOG.md`](CHANGELOG.md) and ensure the next version is correct.
2. Run `npm version <next_version>`.
3. Run `git push --follow-tags`.

Then, the [release workflow](.github/workflows/release.yml) will automatically run and a new release will be created.
