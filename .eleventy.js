const site = require('./src/_data/site');
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('src/assets/fonts');
	eleventyConfig.addPassthroughCopy('src/assets/img');
	eleventyConfig.addPassthroughCopy('src/favicon.ico');
	eleventyConfig.addPassthroughCopy('src/robots.txt');

// ----------- Filters ----------- //
	eleventyConfig.addFilter('dateToISO', (dateObj) => {
		let _date = new Date(dateObj);
		return _date.toISOString().split('T')[0];
	});

// ----------- Shortcodes ----------- //
	const UUID = Math.random().toString(36).slice(-8);
	eleventyConfig.addShortcode('VERSION', function (value) {
		return `${UUID}`;
	});

	// @source: https://bnijenhuis.nl/notes/cache-busting-in-eleventy/
	eleventyConfig.addFilter('bust', (url) => {
		const [urlPart, paramPart] = url.split('?');
		const params = new URLSearchParams(paramPart || '');
		params.set('v', UUID);
		return `${urlPart}?${params}`;
});

	function removeTrailingSlash(str) {
		return str.replace(/\/+$/, '');
	}
	const BASE_URL = removeTrailingSlash(process.env.BASE_URL || site.BASE_URL);
	eleventyConfig.addShortcode('BASE_URL', function (value) {
		return BASE_URL;
	});

// ----------- Plugins ----------- //
	// @source: https://www.11ty.dev/docs/plugins/html-base/
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
		baseHref: BASE_URL
	});

	// Filter source file names using a glob
	eleventyConfig.addCollection('posts', function(collectionApi) {
		let col = collectionApi.getFilteredByGlob('src/content/blog/*.md');
		// console.log(col);
		return col;
	});

	return {
		dir: {
			data:    '_data',
			output:  '_site',
			input:   'src'
		},
		templateFormats: ['html', 'njk', 'md'],
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dataTemplateEngine: 'njk'
	}
}