const http = require('http');


module.exports = function(grunt) {

	var baseDir = './src/assets/'
	var bowerDir = "bower_components/";
	var destDir = './site/'
		
	var common = [
		bowerDir + 'jquery/dist/jquery.js',
		baseDir + 'js/common.js'
	];

	grunt.initConfig({
		
		compass: {
			dist: {
			options: {
				sassDir: baseDir + 'scss',
				cssDir: destDir + 'css',
				environment: 'production'
			}
			},
			dev: {
				options: {
					sassDir: baseDir + 'scss',
					cssDir: destDir + 'css'
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					[destDir + 'js/index.min.js']: common.concat([baseDir + 'js/index.js']),
					[destDir + 'js/aboutus.min.js']: common.concat([baseDir + 'js/aboutus.js']),
					[destDir + 'js/contact.min.js']: common.concat([baseDir + 'js/contact.js']),
					[destDir + 'js/gallery.min.js']: common.concat([baseDir + 'js/gallery.js']),
					[destDir + 'js/portfolio.min.js']: common.concat([baseDir + 'js/portfolio.js'])
				}
			}
		},
		templates: {

		},
		watch: {
			css: {
				files: [baseDir + 'scss/**/*.scss'],
				tasks: ['compass'],
				options: {
					spawn: false,
				},
			},
			js: {
				files: [baseDir + 'js/**/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false,
				},
			},
			// test: {
			// 	files: [baseDir + 'templates/**/*.hbs'],
			// 	tasks: ['templates']
			// }
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');


	grunt.registerTask('default', ['compass', 'uglify', 'watch']);
}