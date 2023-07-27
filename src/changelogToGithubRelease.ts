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
		visit(list, 'link', (node) => {
			const [text] = node.children;
			if (text?.type !== 'text') return;

			// @ts-expect-error -- TS2322: Type '"text"' is not assignable to type '"link"'.
			node.type = 'text';
			// @ts-expect-error -- TS2339: Property 'value' does not exist on type 'Link'.
			node.value = text.value;
		});

		tree.children.length = 0; // clear
		tree.children.push(list);
	};
}

export async function changelogToGithubRelease(
	changelog: string,
	version: string,
): Promise<string> {
	const file = await remark().use(extractChangeItems, { version }).process(changelog);

	return String(file);
}
