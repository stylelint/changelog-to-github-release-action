# changelog-to-github-release-action

> GitHub Action to convert CHANGELOG file to GitHub Release

## Usage

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
        uses: actions/checkout@v3
      - name: Create release
        uses: stylelint/changelog-to-github-release-action@main
        with:
          tag: ${{ github.ref_name }}
```

## Inputs

See [`action.yml`](action.yml).
