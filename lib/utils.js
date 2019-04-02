/*global describe, before, it*/

'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var path = require('path');

/**
 * TEST UTILITIES
 **/
var _set_vars = module.exports._set_vars = function (name, type) {
	var fullName = type === 'module' ?
		'_test-' + name :
		'test-' + name;

	var hbsPath = type === 'template' ?
		'app/assemble/' + fullName + '.hbs' :
		'app/assemble/' + type + 's/' + fullName + '.hbs';

	var scssPath = type === 'module' ?
		'app/scss/' + type + 's/' + fullName + '.scss' :
		'app/scss/' + type + 's/_' + fullName + '.scss';

	var hbsRegx = new RegExp('class\=".*(test-' + name + ').*"');
	var scssRegx = new RegExp('\.test-' + name);

	return {
		fullName: fullName,
		hbsPath: hbsPath,
		scssPath: scssPath,
		hbsRegx: hbsRegx,
		scssRegx: scssRegx
	};
};

var _it_tests = module.exports._it_tests = function (vars, type) {
	it('Created ' + vars.fullName + '.hbs and ' + vars.fullName + '.scss', function () {
		assert.file([
			vars.hbsPath,
			vars.scssPath
		]);
	});

	if (type !== 'pattern') {

		if (type !== 'module') {
			it(vars.fullName + ' .hbs have the right content', function () {
				assert.fileContent([
					[vars.hbsPath, vars.hbsRegx]
				]);
			});
		}
		it(vars.fullName + ' .scss have the right content', function () {
			assert.fileContent([
				[vars.scssPath, vars.scssRegx]
			]);
		});
	}
};

var _test_sub_generators = module.exports._test_sub_generators = function (name) {
	var vars = _set_vars(name, name);

	describe('Create new ' + name, function () {
		before(function subGenerator(done) {
			helpers.run(path.join(__dirname, '../generators/' + name))
				.withPrompts({
					name: 'test ' + name
				})
				.on('end', done);
		});

		_it_tests(vars, name);
	});
};

var _test_patterns = module.exports._test_patterns = function (name) {
	var vars = _set_vars('pattern-' + name, name);

	describe('Import ' + name + ' Pattern', function () {
		before(function pattern(done) {
			helpers.run(path.join(__dirname, '../generators/pattern'))
				.withPrompts({
					type: name,
					name: 'test-pattern-' + name
				})
				.on('end', done);
		});

		_it_tests(vars, 'pattern');
	});
};

var _test_brei_main_files = module.exports._test_brei_main_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + '.gitignore',
		pre + 'package.json',
		pre + 'package-lock.json',
		pre + 'README.md'
	]);

};

var _test_brei_assemble_files = module.exports._test_brei_assemble_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'app/assemble/fixtures/default-content.json',
		pre + 'app/assemble/fixtures/global-header.json',
		pre + 'app/assemble/fixtures/global-footer.json',
		pre + 'app/assemble/fixtures/masthead.json',
		pre + 'app/assemble/includes/_access-nav.hbs',
		pre + 'app/assemble/includes/_css-main.hbs',
		pre + 'app/assemble/includes/_fonts.hbs',
		pre + 'app/assemble/includes/_js-home.hbs',
		pre + 'app/assemble/includes/_js-level.hbs',
		pre + 'app/assemble/includes/_js-main.hbs',
		pre + 'app/assemble/includes/_js-modernizr.hbs',
		pre + 'app/assemble/includes/_meta.hbs',
		pre + 'app/assemble/includes/_svg.hbs',
		pre + 'app/assemble/layouts/default.hbs',
		pre + 'app/assemble/layouts/home.hbs',
		pre + 'app/assemble/layouts/index.hbs',
		pre + 'app/assemble/layouts/level.hbs',
		pre + 'app/assemble/layouts/module.hbs',
		pre + 'app/assemble/modules/_global-footer.hbs',
		pre + 'app/assemble/modules/_global-header.hbs',
		pre + 'app/assemble/modules/_masthead.hbs',
		pre + 'app/assemble/partials/logo.hbs',
		pre + 'app/assemble/partials/masthead.hbs',
		pre + 'app/assemble/partials/primary-nav.hbs',
		pre + 'app/assemble/home-page.hbs',
		pre + 'app/assemble/index.hbs'
	]);

};

var _test_brei_helper_files = module.exports._test_brei_helper_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'app/assemble/helpers/helpers.js',
		pre + 'lib/browsersync.js',
		pre + 'lib/copy.js',
		pre + 'lib/del.js',
		pre + 'lib/nodesass.js',
		pre + 'lib/updateScss.js'
	]);

};

var _test_brei_scss_files = module.exports._test_brei_scss_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'app/scss/common/_body.scss',
		pre + 'app/scss/common/_defaults.scss',
		pre + 'app/scss/common/_forms.scss',
		pre + 'app/scss/common/_headings.scss',
		pre + 'app/scss/common/_hr.scss',
		pre + 'app/scss/common/_images.scss',
		pre + 'app/scss/common/_links.scss',
		pre + 'app/scss/common/_lists.scss',
		pre + 'app/scss/common/_selection.scss',
		pre + 'app/scss/common/_tables.scss',
		pre + 'app/scss/helpers/_placeholders.scss',
		pre + 'app/scss/helpers/_theme-variables.scss',
		pre + 'app/scss/helpers/_user-markup.scss',
		pre + 'app/scss/helpers/lib/_animate.scss',
		pre + 'app/scss/helpers/mixins/_mixins.scss',
		pre + 'app/scss/helpers/overrides/_foundation.scss',
		pre + 'app/scss/layout/_layout.scss',
		pre + 'app/scss/modules/_assemble-modules.scss',
		pre + 'app/scss/modules/_global-footer.scss',
		pre + 'app/scss/modules/_global-header.scss',
		pre + 'app/scss/modules/_masthead.scss',
		pre + 'app/scss/partials/_assemble-partials.scss',
		pre + 'app/scss/partials/_logo.scss',
		pre + 'app/scss/partials/_masthead.scss',
		pre + 'app/scss/partials/_primary-nav.scss',
		pre + 'app/scss/templates/_assemble-templates.scss',
		pre + 'app/scss/templates/_home-page.scss',
		pre + 'app/scss/main.scss'
	]);

};

var _test_brei_config_files = module.exports._test_brei_config_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + '_config/.eslintrc.json',
		pre + '_config/.stylelintignore',
		pre + '_config/.stylelintrc.json',
		pre + '_config/_brei.json',
		pre + '_config/assemblefile.js',
		pre + '_config/copy.js',
		pre + '_config/del.js',
		pre + '_config/modernizr-config.json',
		pre + '_config/postcss.config.js',
		pre + '_config/webpack.config.js',
	]);

};

var _test_brei_npm_built_files = module.exports._test_brei_npm_built_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'app/index.html',
		pre + 'app/home-page.html',
		pre + 'app/js/plugins/modernizr.js',
		pre + 'dist/index.html',
		pre + 'dist/home-page.html',
		pre + 'dist/css/main.css',
		pre + 'dist/js/main.js',
		pre + 'dist/js/plugins/modernizr.js',
		pre + 'web/index.html',
		pre + 'web/home-page.html',
		pre + 'web/css/main.css',
		pre + 'web/js/main.js',
		pre + 'web/js/plugins/modernizr.js'
	]);

};

var _test_brei_npm_execute_files = module.exports._test_brei_npm_execute_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'app/scss/modules/_assemble-modules.scss',
		pre + 'app/scss/partials/_assemble-partials.scss',
		pre + 'app/scss/templates/_assemble-templates.scss'
	]);

};

var _test_brei_generator_files = module.exports._test_brei_generator_files = function (prefix) {

	var pre = '';
	if (typeof prefix !== undefined && prefix !== '') {
		pre = prefix;
	}

	assert.file([
		pre + 'generators/app/index.js',
		pre + 'generators/module/index.js',
		pre + 'generators/module/templates/module.hbs',
		pre + 'generators/module/templates/module.json',
		pre + 'generators/module/templates/module.scss',
		pre + 'generators/new/index.js',
		pre + 'generators/new/templates/',
		pre + 'generators/new/templates/gitignore',
		pre + 'generators/partial/index.js',
		pre + 'generators/partial/templates/partial.hbs',
		pre + 'generators/partial/templates/partial.scss',
		pre + 'generators/template/index.js',
		pre + 'generators/template/templates/template.hbs',
		pre + 'generators/template/templates/template.json',
		pre + 'generators/template/templates/template.scss',
		pre + 'lib/utils.js',
		pre + 'test/mocha.opts',
		pre + 'test/test-app.js',
		pre + 'test/test-utils.js',
		pre + 'package.json',
		pre + 'README.md'
	]);

};

/**
 * GENERATOR UTILITIES
 **/
var _format_input = module.exports._format_input = function (input) {
	// Remove the first _ (or __)
	if (/^_/g.test(input)) {
		input = input.replace(/^_+/g, '');
	}
	// Remove the first _ (or __)
	if (/^-/g.test(input)) {
		input = input.replace(/^-+/g, '');
	}
	// Change all whitespace to -
	if (/\s/g.test(input)) {
		input = input.replace(/\s/g, '-');
	}
	// Change all remaining _ to -
	if (/_/g.test(input)) {
		input = input.replace(/_/g, '-');
	}
	// Remove any file extensions
	if (/\..+/g.test(input)) {
		input = input.replace(/\..+/g, '');
	}
	// Remove any trailing -- or __
	if (/\s+$|-+$|_+$/.test(input)) {
		input = input.replace(/\s+$|-+$|_+$/g, '');
	}

	input = input.toLowerCase();

	return input;
};

var toTitleCase = function (str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

var _prettify_input = module.exports._prettify_input = function (input) {

	input = input.replace(/_/g, '');

	input = input.replace(/-/g, ' ');

	input = toTitleCase(input);

	return input;
};
