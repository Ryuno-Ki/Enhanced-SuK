module.exports = function(grunt) {
  'use strict';
  
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      // Store src, spec, helper and fixture globs here
      src: './*.js',
      dotsrc: 'asset/*.dot',
      dotdest: 'asset/*.png'
    },
    jshint: {
      all: ['Gruntfile.js','<%= meta.src %>'],
      force: 'true',
      jshintrc: 'true'
    },
    jsdoc: {
      dist : {
        src: ['<%= meta.src %>'],
        options: {
          destination: 'doc/',
          private: true
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        title: 'Grunt for GreaseMonkey-Script SuK'
      }
    },
    graphviz: {
      dist: {
        files: {
	  // Format: 'target': 'src'
	  // Since it is pretty old, it can compile only one file
          '<%= meta.dotdest %>':  '<%= meta.dotsrc %>'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-graphviz');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('dot', ['graphviz']);
};
