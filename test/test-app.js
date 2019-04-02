/*global describe, before, it, require, __dirname*/

var path = require('path');
var helpers = require('yeoman-test');
var os = require('os');
var util = require('../lib/utils.js');
var exec = require('child_process').exec;
var assert = require('yeoman-assert');

// Global vars
var build_error_code = 0;
var build_error_msg = '';
var build_error_stdout = '';

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-assemble-helpers, brei-sass-boilerplate.
 */
describe('Main Generator', function () {
	'use strict';

	before(function mainGenerator(done) {
		var tdir = path.join(os.tmpdir(), './temp');
		this.timeout(120000);

		console.log('\nRunning a generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/new'))
			.inDir(tdir)
			.withOptions({
				'skip-install': false
			})
			.withPrompts({
				'deployDirectory': 'web'
			})
			.on('end', function () {
				console.log('\nRunning npm run build and npm run deploy');
				console.log('------------');
				console.log('Buckle up, this might take 45 - 60 seconds\n');

				exec('npm run build && npm run deploy', {
					cwd: tdir
				}, function (error, stdout, stderr) {
					if (error !== null) {
						if (error.code !== null) {
							if ('0' !== error.code.toString()) {
								build_error_code = error.code;
								build_error_msg = error.message;
								build_error_stdout = stdout;
							}
						}
					}

					done();
				});
			});
	});

	it('Build finished with an error code of 0', function () {

		if ('0' !== build_error_code.toString()) {
			console.log('\n\n -- ERROR --\n');
			console.error(build_error_msg);
			console.log(build_error_stdout);
			console.log('\n -- /ERROR --\n\n');
		}

		assert.textEqual('0', build_error_code.toString());
	});

	it('Ran npm to build out directories', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_npm_built_files(tdir);
	});

	it('NPM Build ran successfully', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_npm_execute_files(tdir);
	});

	it('Created Main Files', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_main_files(tdir);
	});

	it('Created Assemble Files', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_assemble_files(tdir);
	});

	it('Created Helper Files', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_helper_files(tdir);
	});

	it('Created SASS Files', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_scss_files(tdir);
	});

	it('Created Configuration Files', function () {
		var tdir = path.join(os.tmpdir(), './temp/');
		util._test_brei_config_files(tdir);
	});
});

describe('Check Generator Files', function () {
	'use strict';

	it('Generator self check', function () {
		var dir = path.join(__dirname, '../');
		util._test_brei_generator_files(dir);
	});
});

describe('Template Sub-Generator', function () {
	'use strict';
	util._test_sub_generators('template');
});

describe('Module Sub-Generator - ', function () {
	'use strict';
	util._test_sub_generators('module');
});

describe('Partial Sub-Generator - ', function () {
	'use strict';
	util._test_sub_generators('partial');
});
