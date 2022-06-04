// eslint-disable-next-line no-undef
module.exports = function (grunt) {
  grunt.initConfig({
    config: {
      scriptPath: 'instagram-source-opener.user.js',
    },
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['dist'],
      temp: ['dist/*.html', 'dist/*.css'],
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
        format: 'keep-breaks',
      },
      target: {
        files: {
          'dist/styles.min.css': ['dist/styles.css'],
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
    css_important: {
      options: {},
      files: {
        src: ['src/views/styles.css'],
        dest: 'dist/styles.css'
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
  grunt.loadNpmTasks('grunt-css-important');

  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('build', [
    'clean:all',
    'htmlmin',
    'css_important',
    'cssmin',
    'copy',
    'includes',
    'string-replace',
    'clean:temp',
  ]);
};
