# Developer guide

## Release

1. Update [`CHANGELOG.md`](CHANGELOG.md) and ensure the next version is correct.
2. Run `npm version <next_version>`.
3. Run `git push --follow-tags`.

Then, the [release workflow](.github/workflows/release.yml) will automatically run and a new release will be created.
