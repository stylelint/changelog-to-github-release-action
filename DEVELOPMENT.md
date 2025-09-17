# Developer guide

## Setup

Use the latest version of Node.js and npm.

1. Check out the code from the remote repository.
2. Run `npm install-ci-test` (or `npm cit`).

## Release

Create a release PR from [this GitHub Actions workflow](https://github.com/stylelint/changelog-to-github-release-action/actions/workflows/create-release-pr.yml) and merge it.

After the PR merge, the release will be performed automatically. Check out a new release in [Releases](https://github.com/stylelint/changelog-to-github-release-action/releases).
