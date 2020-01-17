import 'mocha';
import { expect } from 'chai';
import { getSourceAndExpectedFixtures } from './get_fixture';
import { Replacements } from '../lib/replacements';

describe('Testing replacements', () => {
	it('Replacements', () => {
		const replacements = new Replacements(
			{
				'/foo/': '/bar/',
			},
			'@iconify-replacement'
		);

		// Test simple code
		const code =
			'// @iconify-replacement: "/foo/"\nimport { Test1 } from \'/foo/test1\';';
		const expected = "import { Test1 } from '/bar/test1';";
		expect(replacements.parse(code)).to.be.equal(expected);

		// Test more complex code
		let tests = getSourceAndExpectedFixtures('paths');
		expect(replacements.parse(tests.source)).to.be.equal(tests.expected);

		// Test multiple replacements
		replacements.replacements = {
			'/components/default/': '/components/figma/',
			'/phrases/': '/phrases_de/',
		};
		tests = getSourceAndExpectedFixtures('imports1');
		expect(replacements.parse(tests.source)).to.be.equal(tests.expected);

		// Test no replacement
		tests = getSourceAndExpectedFixtures('condition1', '.jsx');
		expect(replacements.parse(tests.source)).to.be.equal(tests.expected);
	});
});
