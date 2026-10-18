import { remark } from 'remark';
import { visit, CONTINUE, EXIT } from 'unist-util-visit';

/**
 * @param {string} tag
 * @returns {string}
 */
function extractVersion(tag) {
	const index = tag.lastIndexOf('@');
	if (index === -1 || index === tag.length - 1) return tag;

	return tag.slice(index + 1);
}

/**
 * @param {{ tag: string }} options
 * @returns {(tree: import('mdast').Root) => void}
 */
function extractChangeItems({ tag }) {
	return (tree) => {
		const version = extractVersion(tag);

		let foundVersion = false;
		/** @type {import('mdast').List | undefined} */
		let list;

		visit(tree, 'heading', (node, index, parent) => {
			const [text] = node.children;
			if (
				text?.type === 'text' &&
				text.value.startsWith(version) &&
				parent &&
				index !== undefined
			) {
				foundVersion = true;
				const nextSiblings = parent.children.slice(index + 1);
				for (const sibling of nextSiblings) {
					if (sibling.type === 'list') {
						list = sibling;
						return EXIT;
					}
				}
			}
			return CONTINUE;
		});

		if (!foundVersion) {
			throw new Error(`Version '${version}' not found in the changelog`);
		}

		if (!list) {
			throw new Error(`No list found under the version '${version}' heading in the changelog`);
		}

		// Rewrite a link or reference to a PR notation (#123) or a user mention (@username).
		visit(list, ['link', 'linkReference'], (node, index, parent) => {
			if (index === undefined || parent === undefined) return CONTINUE;

			if (!('children' in node)) return CONTINUE;

			const [text] = node.children;
			if (text?.type !== 'text') return CONTINUE;

			parent.children.splice(index, 1, { type: 'text', value: text.value });
			return CONTINUE;
		});

		tree.children = [list];
	};
}

/**
 * @param {string} changelog
 * @param {string} tag
 * @returns {Promise<string>}
 */
export async function changelogToGithubRelease(changelog, tag) {
	const file = await remark().use(extractChangeItems, { tag }).process(changelog);

	return String(file);
}
