module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        "jasmine_node": {
            options: {
                forceExit: true,
                extensions: 'js'
            },
            all: ["./spec"]
        },

        jscs: {
            src: [
                "lib/**/*.js"
            ],
            options: {
                config: ".jscsrc"
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.loadNpmTasks("grunt-jscs");

    grunt.registerTask('test', ['jscs', 'jasmine_node']);

    // Default task
    grunt.registerTask('default', ['jscs', 'jasmine_node']);
};