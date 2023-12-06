import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

import { changelogToGithubRelease } from './changelogToGithubRelease.js';

async function main() {
	const tag = core.getInput('tag');
	const changelogPath = core.getInput('changelog');
	const token = core.getInput('token');
	const draft = core.getInput('draft') === 'true';
	const repository = core.getInput('repo');

	const [owner, repo] = repository.split('/', 2);
	if (!(owner && repo)) {
		throw new Error(`Invalid 'repo' input: ${repository}`);
	}

	const changelog = await readFile(changelogPath, 'utf-8');
	const body = await changelogToGithubRelease(changelog, tag);

	const client = getOctokit(token);
	const { data } = await client.rest.repos.createRelease({
		owner,
		repo,
		tag_name: tag,
		body,
		draft,
	});
	core.info(`Created release: ${data.html_url}`);
}

if (process.env['NODE_ENV'] !== 'test') {
	main().catch((error) => {
		if (error instanceof Error) {
			core.error(error);
		}
		core.setFailed('Unexpexted error raised');
	});
}
