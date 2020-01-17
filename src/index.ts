import { readdirSync, readFileSync, writeFileSync, lstatSync } from 'fs';

import { Replacements, ReplacementsVariables } from './replacements';

export { Replacements, ReplacementsVariables };

/**
 * Parse directory
 */
export function parseDirectory(
	replacements: Replacements,
	path: string,
	extensions = ['js', 'jsx']
): void {
	// Remove trailing /
	if (path.slice(-1) === '/') {
		path = path.slice(0, path.length - 1);
	}

	// Get all files in directory
	let files: string[];
	try {
		files = readdirSync(path);
	} catch (err) {
		return;
	}

	// Check all files
	files.forEach(file => {
		const filename = path + '/' + file;
		let stats;
		try {
			stats = lstatSync(filename);
		} catch (err) {
			return;
		}

		if (stats.isDirectory()) {
			parseDirectory(replacements, filename, extensions);
			return;
		}

		if (stats.isFile()) {
			const parts = file.split('.');
			if (parts.length < 2) {
				return;
			}
			const ext = (parts.pop() as string).toLowerCase();
			if (extensions.indexOf(ext) === -1) {
				return;
			}

			// Parse file
			try {
				const oldContent = readFileSync(filename, 'utf8');
				const newContent = replacements.parse(oldContent);
				if (newContent !== oldContent) {
					console.log('Replaced conditional content in', filename);
					writeFileSync(filename, newContent, 'utf8');
				}
			} catch (err) {
				return;
			}
		}
	});
}
