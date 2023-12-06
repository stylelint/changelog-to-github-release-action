import { remark } from 'remark';
import { visit, CONTINUE, EXIT } from 'unist-util-visit';

/**
 * @param {{ version: string }} options
 * @returns {(tree: import('mdast').Root) => void}
 */
function extractChangeItems({ version }) {
	return (tree) => {
		/** @type {import('mdast').List | undefined} */
		let list;

		visit(tree, 'heading', (node, index, parent) => {
			const [text] = node.children;
			if (text?.type === 'text' && text.value === version && parent && index !== undefined) {
				const nextSibling = parent.children[index + 1];
				if (nextSibling?.type === 'list') {
					list = nextSibling;
					return EXIT;
				}
			}
			return CONTINUE;
		});

		if (!list) {
			throw new Error(`Not found version: ${version}`);
		}

		// Rewrite a link to a PR notation (#123) or a user mention (@username).
		visit(list, 'link', (node, index, parent) => {
			if (index === undefined || parent === undefined) return CONTINUE;

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
 * @param {string} version
 * @returns {Promise<string>}
 */
export async function changelogToGithubRelease(changelog, version) {
	const file = await remark().use(extractChangeItems, { version }).process(changelog);

	return String(file);
}
