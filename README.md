# changelog-to-github-release-action

> GitHub Action to convert CHANGELOG file to GitHub Release

## Usage

First, create a `CHANGELOG.md` file with the following format, such as:

```markdown
# Changelog

<!-- Format: "{version} - {iso-date}" -->

## 1.0.0 - 2025-01-01

<!-- Notable changes list -->

- Added: something.
- Fixed: something.
```

Next, create `.github/workflows/release.yml` with the following content:

```yaml
name: Release

on:
  push:
    tags: ["**"]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    concurrency: ${{ github.workflow }}-${{ github.ref_name }}
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
      - name: Create release
        uses: stylelint/changelog-to-github-release-action@8526eab6046b8f5b2f883844d953b5eb6f80e674 # 0.5.1
```

## Inputs

You can tune this action by the input parameters, for example:

```yaml
- name: Create release
  uses: stylelint/changelog-to-github-release-action@8526eab6046b8f5b2f883844d953b5eb6f80e674 # 0.5.1
  with:
    tag: ${{ github.event.inputs.new-tag }}
    draft: true
```

For all the inputs, see [`action.yml`](action.yml).

## For developers

See the [developer guide](DEVELOPMENT.md).
