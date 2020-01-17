import { dirname } from 'path';
import { readFileSync } from 'fs';

/**
 * Path to fixtures
 *
 * Compiled files are in "tests", so need to get to project's root directory then find fixtures inside it
 */
export const fixturesPath = dirname(__dirname) + '/tests/fixtures/';

/**
 * Get fixture
 */
export function getFixture(filename: string): string {
	return readFileSync(fixturesPath + filename, 'utf8');
}

/**
 * Get source and expected fixtures
 */
export function getSourceAndExpectedFixtures(
	key: string,
	ext = '.js'
): Record<string, string> {
	return {
		source: getFixture(key + '.source' + ext),
		expected: getFixture(key + '.expected' + ext),
	};
}
