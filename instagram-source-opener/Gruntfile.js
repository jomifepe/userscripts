// eslint-disable-next-line no-undef
module.exports = function (grunt) {
  grunt.initConfig({
    config: {
      scriptPath: 'instagram-source-opener.user.js'
    },
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['dist'],
      temp: ['dist/*.min.html', 'dist/*.min.css']
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          'dist/settings-menu.min.html': 'src/views/settings-menu/content.html',
          'dist/stories-menu.min.html': 'src/views/stories-menu/content.html',
        },
      },
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1,
        format: 'keep-breaks'
      },
      target: {
        files: {
          'dist/styles.min.css': ['src/views/styles.css'],
        },
      },
    },
    copy: {
      main: {
        expand: true,
        flatten: true,
        src: 'src/<%= config.scriptPath %>',
        dest: 'dist/',
      },
    },
    includes: {
      files: {
        flatten: true,
        src: ['dist/<%= config.scriptPath %>'],
        dest: 'dist/',
      },
    },
    'string-replace': {
      dist: {
        files: {
          'dist/': 'dist/<%= config.scriptPath %>',
        },
        options: {
          replacements: [
            {
              pattern: /__VS__/gi,
              replacement: '${',
            },
            {
              pattern: /__VE__/gi,
              replacement: '}',
            },
          ],
        },
      },
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*'],
        tasks: ['build'],
        options: {
          atBegin: true,
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('build', [
    'clean:all',
    'htmlmin',
    'cssmin',
    'copy',
    'includes',
    'string-replace',
    'clean:temp',
  ]);
};
