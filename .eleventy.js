const path = require('path');
const browserslist = require('browserslist');
const { bundle, browserslistToTargets } = require('lightningcss');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy('_src/favicon.ico');
	eleventyConfig.addPassthroughCopy('_src/_assets');

	eleventyConfig.addTemplateFormats('css');

	eleventyConfig.addExtension('css', {
		outputFileExtension: 'css',
		compile: async function (_inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith('_')) return;

			let targets = browserslistToTargets(browserslist('> 0.2% and not dead'));

			return async () => {
				const { code } = await bundle({
					filename: inputPath,
					targets,
					minify: true,
					sourceMap: false,
					drafts: {
						nesting: true
					}
				});

				return code;
			};
		}
	});

	return {
		dir: {
			input: '_src',
			output: '_site'
		}
	};
};
