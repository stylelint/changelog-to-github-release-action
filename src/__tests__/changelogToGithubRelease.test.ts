import { expect, test } from 'vitest';

import { changelogToGithubRelease } from '../changelogToGithubRelease.js';

const changelog = `
# Changelog

## 1.0.0
- aaa [#123](https://github.com/foo/bar/pull/123) ([@user](https://github.com/user)).
- bbb.
`;

test('rewrite change items matching specified version', async () => {
	await expect(changelogToGithubRelease(changelog, '1.0.0')).resolves.toBe(`*   aaa #123 (@user).
*   bbb.
`);
});

test('raise an error when a specified version is not found', async () => {
	await expect(changelogToGithubRelease(changelog, '2.0.0')).rejects.toThrow(
		'Not found version: 2.0.0',
	);
});
