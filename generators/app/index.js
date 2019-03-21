'use strict';

var Generator = require('yeoman-generator');
var yosay = require('yosay');
var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');

module.exports = class extends Generator {

	constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    	super(args, opts);
	}

	initializing() {
		this.pkg = require('../../package.json');
		this.answer = 'new';
	}

	prompting() {

		var done = this.async();

		this.log(yosay(
			'Welcome to the BarkleyREI project generator!\nv' + this.pkg.version
		));

		const notifier = updateNotifier({
			pkg,
			updateCheckInterval: 1
		});

		if (notifier.update) {

			this.log(yosay(
				'I say, there seems to be an update to the generator! Go and fetch it!'
			));

			notifier.notify();

			return true;

		} else {

			return this.prompt({
				type: 'list',
				name: 'command',
				message: 'What would you like to do?',
				default: 'Create a New Project',
				choices: [
					'Create a New Project',
					'Create a Partial',
					'Create a Module',
					'Create a Template'
					// 'Import a Pattern',
					// 'Update Your Project'
				]
			}).then(function(answer) {

				switch (answer.command) {
					case 'Create a Partial':
						this.answer = 'partial';
						// this.composeWith('new-app:partial', {});
						break;
					case 'Create a Module':
						this.answer = 'module';
						// this.composeWith('new-app:module', {});
						break;
					case 'Create a Template':
						this.answer = 'template';
						// this.composeWith('new-app:template', {});
						break;
					// case 'Import a Pattern':
						// this.answer = 'pattern';
						// this.composeWith('new-app:pattern', {});
						// break;
					// case 'Update Your Project':
						// this.answer = 'update';
						// this.composeWith('new-app:update', {});
						// break;
					default: //'Create a New Project'
						// this.composeWith('new-app:new');
						break;
				}

				done();

			}.bind(this));

		}
	}

	install() {
		this.composeWith('new-app:' + this.answer);
	}
};
