var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');

gulp.task("webpack", function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("watch", function(callback) {
    watch('static/**/*.ts*', ["webpack"]);
});

gulp.task("server", shell.task([
    "nginx -c " + __dirname + "/nginx.conf -p " + __dirname
]));

gulp.task("restart", shell.task([
    'nginx -s reload'
]));

gulp.task("stop", shell.task([
    'nginx -s stop'
]));

gulp.task("default", [
    'server', 'webpack', 'watch'
]);