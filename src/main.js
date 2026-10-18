import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

import { changelogToGithubRelease } from './changelogToGithubRelease.js';

// A full Git object ID (SHA-1)
const COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/i;

async function main() {
	const tag = core.getInput('tag');
	const name = core.getInput('name') || tag;
	const changelogPath = core.getInput('changelog');
	const token = core.getInput('token');
	const draft = core.getInput('draft') === 'true';
	const repository = core.getInput('repo');
	const targetCommitish = process.env['GITHUB_SHA'];

	const [owner, repo] = repository.split('/', 2);
	if (!(owner && repo)) {
		throw new Error(`Invalid 'repo' input: ${repository}`);
	}

	if (!targetCommitish || !COMMIT_SHA_PATTERN.test(targetCommitish)) {
		throw new Error(`Invalid 'GITHUB_SHA' environment variable: ${targetCommitish}`);
	}

	const changelog = await readFile(changelogPath, 'utf-8');
	const body = await changelogToGithubRelease(changelog, tag);

	const client = getOctokit(token);
	const { data } = await client.rest.repos.createRelease({
		owner,
		repo,
		tag_name: tag,
		name,
		body,
		draft,
		target_commitish: targetCommitish,
	});
	if (draft) {
		core.warning(`Created a draft release. Publish it when ready: ${data.html_url}`);
	} else {
		core.notice(`Created release: ${data.html_url}`);
	}
}

if (process.env['NODE_ENV'] !== 'test') {
	main().catch((error) => {
		if (error instanceof Error) {
			core.error(error);
		}
		core.setFailed('Unexpected error raised');
	});
}
