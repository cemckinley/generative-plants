
module.exports = function(grunt) {

	var path = require('path');
	var defaultLocal = './local';
	var defaultPublic = './public';


	// Project configuration.
	grunt.initConfig({


		/* GENERAL CONFIG OPTIONS */

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Local compiled folder, dev/debug environment
		 * @type {String}
		 */
		localPath: grunt.option('localPath') || defaultLocal,

		/**
		 * Local compiled folder, production/published files
		 * @type {String}
		 */
		publicPath: grunt.option('publicPath') || defaultPublic,

		/**
		 * _ui directory name (holds js/css compiled output)
		 * @type {String}
		 */
		assetDir: 'assets',

		/**
		 * Compiled js path/destination
		 * @type {String}
		 */
		jsOutputPath: '<%= assetDir %>/js',

		/**
		 * Compiled CSS path/destination
		 * @type {String}
		 */
		cssOutputPath: '<%= assetDir %>/css',

		/**
		 * Path to source (uncompiled) files
		 * @type {String}
		 */
		sourcePath: './src',

		/**
		 * Path to 3rd party/vendor js libs
		 * @type {String}
		 */
		vendorPath: '<%= sourcePath %>/vendor',

		/**
		 * The port number to mount the node server on
		 * @type {Number}
		 */
		port: 8008,

		/**
		 * Port number that the livereload server is run on
		 * @type {Number}
		 */
		livereloadPort: 1337,



		/* TASK CONFIG */

		'bower': {
			dev: {
				dest: '<%= vendorPath %>'
			}
		},


		'browserify': {
			options: {
				// alias any libs you want to require by shorthand shorthand (also fixes an issue with Backbone requiring the 'underscore' module)
				alias: [

				],
				// shimmed libs are automatically aliased (to the object key)
				shim: {
					'jquery': {
						path: '<%= vendorPath %>/jquery.js',
						exports: '$'
					},
					'jquery.easing': {
						path: '<%= vendorPath %>/jquery.easing.js',
						exports: '$'
					}
				}
			},
			dev: {
				src: ['<%= sourcePath %>/scripts/main.js'],
				dest: '<%= localPath %>/<%= jsOutputPath %>/app.js',
				options: {
					debug: true
				}
			},
			dist: {
				src: [ '<%= sourcePath %>/scripts/main.js'],
				dest: '<%= publicPath %>/<%= jsOutputPath %>/app.js',
				options: {
					debug: false
				}
			}
		},



		'clean': {
			// development directory
			dev: '<%= localPath %>',

			// distribution directory
			dist: '<%= publicPath %>'
		},


		'concat': {

			dev: {
				options: {
					separator: '\n\n'
				},
				src: [
					'<%= sourcePath %>/scripts/**/*.js'
				],
				dest: '<%= localPath %>/<%= jsOutputPath %>/app.js'
			},
			dist: {
				options: {
					separator: '\n\n'
				},
				src: [
					'<%= sourcePath %>/scripts/**/*.js'
				],
				dest: '<%= publicPath %>/<%= jsOutputPath %>/app.js'
			}
		},


		'connect': {
			dev: {
				options: {
					hostname: '*',
					port: '<%= port %>',
					base: '<%= localPath %>',
					livereload: '<%= livereloadPort %>'
				}
			}
		},


		// copy over non-compiled files (assets, static html)
		'copy': {
			assets: {
				files: [
					// asset files (img, fonts, video)
					{
						expand: true,
						src: [
							'**/*',
						],
						dest: '<%= localPath %>/<%= assetDir %>',
						cwd: '<%= sourcePath %>/assets/'
					}
				]
			},

			html: {
				files: [
					// html files
					{
						expand: true,
						src: [
							'**/*.html',
						],
						dest: '<%= localPath %>',
						cwd: '<%= sourcePath %>/html/'
					}
				]
			},

			// copy modernizr separately so it can be loaded in the head before page, and other js files
			modernizr: {
				files: [
					// html files
					{
						expand: true,
						src: [
							'modernizr.js',
						],
						dest: '<%= localPath %>/<%= jsOutputPath %>/lib/',
						cwd: '<%= sourcePath %>/vendor/'
					}
				]
			},

			// dist target should copy over all files, since we don't need to target specific types for the watch task
			// should never include js files, js files are either copied by requirejs, browserify, or concat/uglify tasks
			// in both dev and dist environments
			dist: {
				files: [
					{
						expand: true,
						src: [
							'modernizr.js',
						],
						dest: '<%= publicPath %>/<%= jsOutputPath %>/lib/',
						cwd: '<%= sourcePath %>/vendor/'
					},
					{
						expand: true,
						src: [
							'**/*',
						],
						dest: '<%= publicPath %>/<%= assetDir %>',
						cwd: '<%= sourcePath %>/assets/'
					},
					{
						expand: true,
						src: [
							'**/*.html',
						],
						dest: '<%= publicPath %>',
						cwd: '<%= sourcePath %>/html/'
					}

				]
			}
		},


		'jshint': {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				loopfunc: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					'console': true,
					'alert': true,
					'window': true,
					'document': true,
					'module': true,
					'require': true,
					'$': true,
					'Modernizr': true
				}
			},
			all: ['<%= sourcePath %>/scripts/**/*.js']
		},


		'sass': {
			dev: {
				options: {
					style: 'expanded',
					debug: true,
					trace: true
				},
				files: [{
					src: '<%= sourcePath %>/styles/app.scss',
					dest: '<%= localPath %>/<%= cssOutputPath %>/app.css'
				}]
			},
			dist: {
				options: {
					style: 'compressed',
					debug: false,
					trace: false
				},
				files: [{
					src: '<%= sourcePath %>/styles/app.scss',
					dest: '<%= publicPath %>/<%= cssOutputPath %>/app.css'
				}]
			}
		},


		'uglify': {
			js: {
				files: [{
					src: '<%= publicPath %>/<%= jsOutputPath %>/app.js',
					dest: '<%= publicPath %>/<%= jsOutputPath %>/app.js'
				}]
			}
		},


		'watch': {
			// generic options
			options: {
				livereload: '<%= livereloadPort %>'
			},
			// target specific
			css: {
				files: [
					'<%= sourcePath %>/styles/**/*.scss'
				],
				tasks: ['sass:dev']
			},
			js: {
				files: [
					'<%= sourcePath %>/scripts/**/*.js'
				],
				tasks: ['jshint', 'processjs:dev']
			},
			vendor: {
				files: [
					'<%= sourcePath %>/vendor/**/*'
				],
				tasks: ['browserify:dev']
			},
			html: {
				files: [
					'<%= sourcePath %>/html/**/*.html'
				],
				tasks: ['copy:html']
			},
			assets: {
				files: [
					'<%= sourcePath %>/assets/**/*'
				],
				tasks: ['copy:assets']
			}
		}
	});


	/**
	 * Compile files and start a static server from the 'local' directory
	 */
	grunt.registerTask('run', [
		'clean:dev',
		'jshint',
		'copy:dev',
		'bower',
		'vendor:dev',
		'processjs:dev',
		'sass:dev',
		'connect',
		'watch'
	]);

	/**
	 * Compile files in a new clean build
	 */
	grunt.registerTask('build', [
		'clean:dist',
		'jshint',
		'bower',
		'vendor:dist',
		'processjs:dist',
		'copy:dist',
		'sass:dist'
	]);


	/* TASK ALIASES */

	grunt.registerTask('copy:dev', [
		'copy:assets',
		'copy:html'
	]);

	grunt.registerTask('vendor:dev', [
		'copy:modernizr'
	]);

	grunt.registerTask('vendor:dist', [
		'copy:modernizr'
	]);

	grunt.registerTask('processjs:dev', [
		'browserify:dev'
	]);

	grunt.registerTask('processjs:dist', [
		'browserify:dist', 'uglify:js'
	]);


	/* LOAD TASK DEPENDENCIES */

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-browserify'); /* for some reason this task won't load automatically */

};