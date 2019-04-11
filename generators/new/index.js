'use strict';

const Generator = require('yeoman-generator');
const _s = require('underscore.string');
const yosay = require('yosay');
const editjson = require('edit-json-file');

module.exports = class extends Generator {

	constructor(args, opts) {

		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);

		this.pkg = require('../../package.json');

		this.genver = this.pkg['version'];
		this.debug = 'false';

	}

	initializing() {

		// If we need to do anything before prompting.
		// Checking project state, getting configs, etc.

	}

	prompting() {

		// Ask the people what they want.

		var done = this.async();

		var prompts = [{
			type: 'input',
			name: 'appname',
			message: 'Name of Client (e.g. NOVA, Corpus, Times Square NYC)',
			default: 'static'
		}, {
			type: 'input',
			name: 'stash',
			message: 'Stash Repository Clone URL (ssh:// .git) (Optional)',
			default: ''
		}, {
			type: 'input',
			name: 'deployDirectory',
			message: 'Deploy directory (relative to current path)',
			default: '../../web'
		}];

		return this.prompt(prompts).then(function (answers) {
			this.appname = answers.appname;
			this.appslug = _s.slugify(answers.appname);
			this.stash = answers.stash;
			this.deployDirectory = answers.deployDirectory;

			done();
		}.bind(this));
	}

	configuring() {

		//
		// Save configurations and configure the actual project
		//

		// Grab reference to the project scaffold package.json
		this.scaffoldPJ = editjson(this.templatePath('../../../node_modules/brei-project-scaffold/package.json'));

		// Build out new package.json using scaffold values, plus new stuff if we need any.
		this.newPJ = editjson(this.destinationPath('.') + '/package.json');
		this.newPJ.set('name', this.appslug);
		this.newPJ.set('version', '1.0.0');
		this.newPJ.set('description', this.scaffoldPJ.get('description'));
		this.newPJ.set('author', this.scaffoldPJ.get('author'));
		this.newPJ.set('license', this.scaffoldPJ.get('license'));
		this.newPJ.set('dependencies', this.scaffoldPJ.get('dependencies'));
		this.newPJ.set('devDependencies', this.scaffoldPJ.get('devDependencies'));
		this.newPJ.set('scripts', this.scaffoldPJ.get('scripts'));

		if (this.stash !== '') {
			this.newPJ.set('repository', {
				'type': 'git',
				'url': this.stash
			});
		}

		// Basic brei config with values we need for various things.
		// I use this for a command line thing and like keeping custom stuff out of the package.json. - Ian
		this.breiJ = editjson(this.destinationPath('.') + '/_config/_brei.json');
		this.breiJ.set('generatorVersion', this.genver);
		this.breiJ.set('app', 'app');
		this.breiJ.set('dist', 'dist');
		this.breiJ.set('deploy', this.deployDirectory);

	}

	writing() {

		// Write generator specific files

		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath('.gitignore')
		);

		// brei-project-scaffold
		var scaffoldJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-project-scaffold/package.json')
		);
		this.breiJ.set('brei-project-scaffold', scaffoldJson.version);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-project-scaffold/**/*'),
			this.destinationPath('.'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// Cleanup
		this.fs.delete(this.destinationPath('package.json'));

		// brei-sass-boilerplate
		var sassJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/package.json')
		);
		this.breiJ.set('brei-sass-boilerplate', sassJson.version);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/**/*'),
			this.destinationPath('app/scss/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/.stylelintrc.json'),
			this.destinationPath('_config/.stylelintrc.json'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/foundation-sites/scss/settings/_settings.scss'),
			this.destinationPath('app/scss/_settings.scss'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-sass-mixins
		var mixinJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-mixins/package.json')
		);
		this.breiJ.set('brei-sass-mixins', mixinJson.version);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-mixins/*.scss'),
			this.destinationPath('app/scss/helpers/mixins/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-assemble-structure
		var assembleJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-assemble-structure/package.json')
		);
		this.breiJ.set('brei-assemble-structure', assembleJson.version);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-structure/**/*'),
			this.destinationPath('app/assemble/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-assemble-helpers
		var helpersJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-assemble-helpers/package.json')
		);
		this.breiJ.set('brei-assemble-helpers', helpersJson.version);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-helpers/helpers.js'),
			this.destinationPath('app/assemble/helpers/helpers.js'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-helpers/updateScss.js'),
			this.destinationPath('lib/updateScss.js'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// README
		this.fs.delete(this.destinationPath('README.md'));
		this.fs.copyTpl(
			this.templatePath('../../../node_modules/brei-project-scaffold/README.md'),
			this.destinationPath('README.md'),
			{
				'appname': this.appname,
				'stashrepo': this.stash,
				'scaffoldversion': scaffoldJson.version,
				'sassversion': sassJson.version,
				'mixinversion': mixinJson.version,
				'assembleversion': assembleJson.version,
				'helperversion': helpersJson.version,
			}
		);

		// Delete crap we don't need
		this.fs.delete(this.destinationPath('app/scss/README.md'));
		this.fs.delete(this.destinationPath('app/scss/package.json'));
		this.fs.delete(this.destinationPath('app/scss/.travis.yml'));
		this.fs.delete(this.destinationPath('app/scss/.gitkeep'));
		this.fs.delete(this.destinationPath('app/scss/icons/.gitkeep'));
		this.fs.delete(this.destinationPath('app/scss/.stylelintignore'));
		this.fs.delete(this.destinationPath('app/scss/.stylelintrc.json'));
		this.fs.delete(this.destinationPath('app/scss/.github/'));
		this.fs.delete(this.destinationPath('app/scss/test/'));
		this.fs.delete(this.destinationPath('app/assemble/README.md'));
		this.fs.delete(this.destinationPath('app/assemble/package.json'));
		this.fs.delete(this.destinationPath('app/assemble/.github/'));
		this.fs.delete(this.destinationPath('app/assemble/.gitkeep'));
		this.fs.delete(this.destinationPath('app/assemble/.travis.yml'));
		this.fs.delete(this.destinationPath('app/assemble/test/'));
		this.fs.delete(this.destinationPath('app/assemble/**/*/.gitkeep'));

	}

	install() {

		// Installations are run

		this.newPJ.save();
		this.breiJ.save();

		this.installDependencies({
			skipInstall: this.options['skip-install'],
			skipMessage: this.options['skip-install-message'],
			bower: false
		});
	}

	end() {

		// Cleanup, say goodbye

		if (this.options['skip-install']) {
			this.log(yosay(
				'Make sure to run `npm install` to install all your dependencies! Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		} else {
			this.log(yosay(
				'Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		}

	}
};
