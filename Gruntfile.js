var et_process_css_dev_tasks = [ "less:development", "wpcss", "clean:temp_css" ];

module.exports = function( grunt ) {
	grunt.initConfig( {
		less : {
			build : {
				files : {
					"./style_temp.css" : "./less/style.less"
				}
			},
			development : {
				options: {
					sourceMap: true,
					sourceMapFilename: './style.css.map', // where file is generated and located
					sourceMapURL: 'style.css.map' // the complete url and filename put in the compiled css file
				},
				files : {
					"./style_temp.css" : "./less/style.less"
				}
			}
		},
		watch : {
			files : [ "./less/style-header.less", "./css/main-styles.css", "./includes/builder/styles/frontend-builder-style.css", "./less/style.less" ],
			tasks : et_process_css_dev_tasks
		},
		compress : {
			main : {
				options : {
					archive : '../Divi.zip',
					mode    : 'zip',
					level   : 9
				},
				files : [
					{
						expand : true,
						src : [
							'**',
							'!**/.git/**',
							'!**/less/**',
							'!**/node_modules/**',
							'!**/.DS_STORE/**',
							'!**/*.zip',
							'!**/.gitignore',
							'!**/.gitmodules',
							'!**/.git',
							'!**/*.map',
							'!**/Gruntfile.js',
							'!**/package.json',
							'!css/main-styles.css',
							'!includes/builder/styles/frontend-builder-style.css',
							'!includes/builder/scripts/jquery.fittext.js',
							'!core/tests/**',
							'!*.yml'
						],
						dest : 'Divi'
					}
				]
			}
		},
		wpcss: {
			target: {
				files : {
					"./style.css" : "./style_temp.css"
				}
			}
		},
		clean: {
			temp_css: ["./style_temp.css"]
		},
		makepot: {
			target: {
				options: {
					domainPath: '/lang/',
					exclude: ['includes/builder/*','core/*'],
					potFilename: 'en_US.po',
					type: 'wp-theme',
					potHeaders: {
						poedit: true,                 // Includes common Poedit headers.
						'x-poedit-keywordslist': true // Include a list of all possible gettext functions.
					},
					processPot: function( pot ) {
						var translation,
							excluded_meta = [
								'Theme Name of the plugin/theme',
								'Theme URI of the plugin/theme',
								'Description of the plugin/theme',
								'Author of the plugin/theme',
								'Author URI of the plugin/theme',
								'Template Name of the plugin/theme'
							];

						for ( translation in pot.translations[''] ) {
							if ( 'undefined' !== typeof pot.translations[''][ translation ].comments.extracted ) {
								if ( excluded_meta.indexOf( pot.translations[''][ translation ].comments.extracted ) >= 0 ) {
									console.log( 'Excluded meta: ' + pot.translations[''][ translation ].comments.extracted );
									delete pot.translations[''][ translation ];
								}
							}
						}

						return pot;
					},
					updatePoFiles: true
				}
			}
		},
		po2mo: {
			files: {
				src: 'lang/*.po',
				expand: true
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-wp-css' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-po2mo' );

	et_process_css_dev_tasks.push( 'watch' )
	grunt.registerTask( 'default', et_process_css_dev_tasks );

	grunt.registerTask( 'zip', [ 'less:build', 'wpcss', 'clean:temp_css', 'compress' ] );
	grunt.registerTask( 'update-localization', [ 'makepot', 'po2mo' ] );
};