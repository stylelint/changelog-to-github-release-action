import { remark } from 'remark';
import type { Root, List } from 'mdast';
import { visit, CONTINUE, EXIT } from 'unist-util-visit';

function extractChangeItems({ version }: { version: string }) {
	return (tree: Root) => {
		let list: List | undefined;

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

export async function changelogToGithubRelease(
	changelog: string,
	version: string,
): Promise<string> {
	const file = await remark().use(extractChangeItems, { version }).process(changelog);

	return String(file);
}
