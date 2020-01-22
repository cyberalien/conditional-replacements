/**
 * Interface for replacements
 */
export interface ReplacementsVariables {
	[index: string]: string;
}

/**
 *
 */
export class Replacements {
	// Keyword to look for in content
	keyword: string;

	// List of replacements
	replacements: ReplacementsVariables;

	/**
	 * Constructor
	 */
	constructor(
		replacements: ReplacementsVariables = Object.create(null),
		keyword = '@iconify-replacement'
	) {
		this.replacements = replacements;
		this.keyword = keyword;
	}

	/**
	 * Extract comment contents. Works only for simple comments.
	 */
	isComment(line: string): string | boolean {
		const trimmed = line.trim();
		if (trimmed.slice(0, 2) === '//') {
			// Comment
			return trimmed.slice(2).trim();
		}

		if (trimmed.slice(0, 2) === '/*' && trimmed.slice(-2) === '*/') {
			return trimmed.slice(2, trimmed.length - 2).trim();
		}

		return false;
	}

	/**
	 * Get replacement from comment
	 */
	getCommentReplacement(code: string): string | null {
		const parts = code.split(':');
		if (parts.length < 2 || parts.shift() !== this.keyword) {
			return null;
		}

		// Get value, remove quotes
		let value = (parts.join(':') as string).trim();
		if (
			(value.slice(0, 1) === '"' && value.slice(-1) === '"') ||
			(value.slice(0, 1) === "'" && value.slice(-1) === "'")
		) {
			value = value.slice(1, value.length - 1);
		} else {
			return null;
		}

		// Return value
		return value;
	}

	/**
	 * Parse code
	 */
	parse(code: string): string {
		const lines = code.split('\n'),
			output: string[] = [];

		let replacement: string | null = null;
		lines.forEach(line => {
			const comment = this.isComment(line);
			if (typeof comment === 'string') {
				// Reset replacement
				replacement = null;

				// Get new replacement
				const newReplacement = this.getCommentReplacement(comment);
				if (newReplacement === null) {
					// Invalid comment
					output.push(line);
					return;
				}

				// Check if replacement actually exists. If not, remove comment anyway
				if (this.replacements[newReplacement] !== void 0) {
					replacement = newReplacement;
				}
				return;
			}

			// Attempt to replace code
			if (replacement !== null) {
				if (line.indexOf(replacement) === -1) {
					// End of replacements
					replacement = null;
					output.push(line);
					return;
				}

				// Replace code
				line = line.replace(
					replacement,
					this.replacements[replacement]
				);
			}

			output.push(line);
		});

		return output.join('\n');
	}
}
