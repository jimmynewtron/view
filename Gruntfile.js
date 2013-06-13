module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json'),
		libName = pkg.name;

	var sources = ['src/**/*.js'];

	// wrap files
	var wrap = function(files, dest) {
		code = grunt.file.read('src/$prefix.js').toString();

		files.forEach(function(file) {
			code += grunt.file.read(file).toString();
		});

		code += grunt.file.read('src/$suffix.js').toString();
		grunt.file.write(dest, code);
	};

	grunt.registerTask('wrap', function() {
		wrap(sources, 'src/$assembled.js');
	});

	var uglify = {
		options: {
			banner: grunt.file.read('src/banner.txt').toString()
		},

		latest: {
			src: 'src/$assembled.js',
			dest: 'dist/' + libName + '-latest.js'
		},

		release: {
			src: 'src/$assembled.js',
			dest: 'dist/' + libName + '-' + pkg.version + '.js'
		}
	};

	var jasmine = {
		latest: {
			src: 'dist/' + libName + '-latest.js',
			options: {
				specs: ["test/**/*Spec.js"]
			}
		}
	};

	grunt.initConfig({
		pkg: pkg,
		uglify: uglify,
		jasmine: jasmine
	});

	Object.keys(pkg.devDependencies).forEach(function(name) {
		if (name.substring(0, 6) === 'grunt-') {
			grunt.loadNpmTasks(name);
		}
	});

	grunt.registerTask('build', ['wrap', 'uglify:latest', 'jasmine']);
	grunt.registerTask('release', ['wrap', 'uglify:release', 'jasmine']);
	grunt.registerTask('test', ['jasmine']);
};