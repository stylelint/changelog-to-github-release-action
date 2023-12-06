import test from 'node:test';
import assert from 'node:assert/strict';

import { changelogToGithubRelease } from '../changelogToGithubRelease.js';

const changelog = `
# Changelog

## 1.0.0
- aaa [#123](https://github.com/foo/bar/pull/123) ([@user](https://github.com/user)).
- bbb.

## 0.1.0
- ccc.
`;

test('rewrite change items matching specified version', async () => {
	const result = await changelogToGithubRelease(changelog, '1.0.0');
	assert.equal(
		result,
		`* aaa #123 (@user).
* bbb.
`,
	);
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
