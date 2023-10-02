# changelog-to-github-release-action

> GitHub Action to convert CHANGELOG file to GitHub Release

## Usage

Create `.github/workflows/release.yml` with the following content:

```yaml
name: Release

on:
  push:
    tags: ["**"]

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: true

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Create release
        uses: stylelint/changelog-to-github-release-action@main
```

## Inputs

You can tune this action by the input parameters, for example:

```yaml
- name: Create release
  uses: stylelint/changelog-to-github-release-action@main
  with:
    draft: true
```

For all the inputs, see [`action.yml`](action.yml).

## For developers

See the [developer guide](DEVELOPMENT.md).
