module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            all: {
                src: 'less/*.less',
                dest: 'css/main.css',
                options: {
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ],
                }
            }
        },
        watch: {
            files: ['less/*'],
            tasks: ['less'],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
