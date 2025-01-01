import test from 'node:test';
import assert from 'node:assert/strict';

import { changelogToGithubRelease } from '../changelogToGithubRelease.js';

const changelog = `
# Changelog

## 1.2.0
- reference-style link [#456][] ([@user1]).

## 1.1.0 - 2024-12-31
- ddd [#123](https://github.com/foo/bar/pull/123) ([@user](https://github.com/user)).
- eee.

## 1.0.0
- aaa [#123](https://github.com/foo/bar/pull/123) ([@user](https://github.com/user)).
- bbb.

## 0.1.0
- ccc.

[#456]: https://github.com/foo/bar/pull/456
[@user1]: https://github.com/user1
`;

test('rewrite change items including reference links', { only: true }, async () => {
	const result = await changelogToGithubRelease(changelog, '1.2.0');
	assert.equal(result, '* reference-style link #456 (@user1).\n');
});

test('rewrite change items for version with date in heading', async () => {
	const result = await changelogToGithubRelease(changelog, '1.1.0');
	assert.equal(result, '* ddd #123 (@user).\n* eee.\n');
});

test('rewrite change items matching specified version', async () => {
	const result = await changelogToGithubRelease(changelog, '1.0.0');
	assert.equal(result, '* aaa #123 (@user).\n* bbb.\n');
});

test('raise an error when a specified version is not found', async () => {
	assert.rejects(
		async () => {
			await changelogToGithubRelease(changelog, '2.0.0');
		},
		{
			name: 'Error',
			message: 'Not found version: 2.0.0',
		},
	);
});
