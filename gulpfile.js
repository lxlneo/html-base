var path = require('path')
var fs = require('fs');

var gulp = require('gulp');
var del = require('del');
var watchify = require('watchify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var browerSync = require('browser-sync');
var reload = browerSync.reload;
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var md5 = require('gulp-md5');

var jsmini = require('gulp-uglify');
var cssmini = require('gulp-clean-css');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var concat = require('gulp-concat');
 

var BASE_PATH = 'app';
var OUTPUT_PATH = 'output';
var STATICS = 'statics'

var config = {
    paths: {
        base: BASE_PATH,
        output: OUTPUT_PATH,
        js_floder: BASE_PATH + '/js',
        sass: BASE_PATH + '/sass/**/*.{scss,css}',
        main_sass: BASE_PATH + '/sass/main.scss',
        plugins_css: BASE_PATH + '/sass/plugins.scss',
        html: BASE_PATH + "/**/*.html",
        img: BASE_PATH + "/img/**/*.{png,jpg}",
        hbs: BASE_PATH + "/**/*.hbs",
        not_partials: "!**/partials/*.hbs",
        fonts: BASE_PATH + "/fonts/*",
        output_js: OUTPUT_PATH + '/js',
        output_css: OUTPUT_PATH + '/css'
    }
}


gulp.task('clean', function (cb) {
    del.sync([
        config.paths.output
    ], cb)

})
 

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.output))
})
 

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('js', function() {
    var folders = getFolders(config.paths.js_floder);

    var tasks = folders.map(function(folder) {
        // 拼接成 foldername.js
        // 写入输出
        // 压缩
        // 重命名为 folder.min.js
        // 再一次写入输出
        return gulp.src(path.join(config.paths.js_floder, folder, '/**/*.js'))
            .pipe(concat(folder + '.js'))
            .pipe(gulp.dest(config.paths.js_floder))
            .pipe(jsmini())
            .pipe(rename(folder + '.js'))
            .pipe(gulp.dest(config.paths.output_js));
    });

    return merge(tasks);
});

gulp.task('sass', function () {
    gulp.src(config.paths.main_sass)
        .pipe(sass())
        .pipe(gulp.dest(config.paths.output_css))
    gulp.src(config.paths.fonts)
        .pipe(gulp.dest(config.paths.output_css))
    gulp.src(config.paths.plugins_css)
        .pipe(sass())
        .pipe(cssmini())
        .pipe(gulp.dest(config.paths.output_css))
})

gulp.task('img', function () {
    gulp.src(config.paths.img)
        .pipe(gulp.dest(config.paths.output + "/img"))
})
gulp.task('watch', function () {
    gulp.watch(config.paths.js_floder+"/**/*.js", ['js'])
    gulp.watch(config.paths.sass, ['sass'])
    gulp.watch(config.paths.hbs, ['hbs'])
    gulp.watch(config.paths.img, ['img'])
})

gulp.task('server', function () {
    browerSync({
        port: 9000,
        server: {
            baseDir: config.paths.output
        }
    })
    gulp.watch(['*.html', '*/**/*.js', '*/**/*.css'], {cwd: 'output'}, reload);
})

gulp.task('template', ['html', 'hbs', 'img'])

gulp.task('default', ['clean', 'watch', 'template', 'js', 'sass', 'server'], function (error) {
    console.log(error)
});
