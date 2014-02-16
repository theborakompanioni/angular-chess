module.exports = function (grunt) {
  'use strict';

  var initConfig;

  // Loading external tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  initConfig = {
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      test: {
        // Lint & run unit tests in Karma
        // Just running `$ grunt watch` will only lint your code; to run tests
        // on watch, use `$ grunt watch:karma` to start a Karma server first
        files: ['src/angular-chess.js', 'test/spec/angular-chess.spec.js'],
        tasks: ['jshint', 'karma:unit:run']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
      },
      unit: {
        singleRun: true
      },
      watch: {
        autoWatch: true
      },
      server: {
        background: true
      }
    },
    jshint: {
      all:[
        'Gruntfile.js',
        'src/**/*.js',
        //'test/**/*.spec.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            '*.js',
          ],
        },]
      },
    },
    uglify: {
      dist: {
        files: {
          'dist/angular-chess.min.js': [
            'dist/angular-chess.js'
          ]
        }
      }
    },
  };

  // Register tasks
  grunt.registerTask('default', ['jshint', 'karma:unit']);
  grunt.registerTask('watch', ['jshint', 'karma:watch']);
  grunt.registerTask('dist', ['jshint', 'karma:unit', 'copy', 'uglify']);

  grunt.initConfig(initConfig);
};