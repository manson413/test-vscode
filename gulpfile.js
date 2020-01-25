var gulp         = require('gulp'),
	svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	 del          = require('del'),
	 sass         = require('gulp-sass'),
	 browserSync  = require('browser-sync'),
	 cssnano      = require('gulp-cssnano'),
	 imagemin     = require('gulp-imagemin'),
	 pngquant     = require('imagemin-pngquant'),
	 cache        = require('gulp-cache'),
	 prefixer     = require('gulp-autoprefixer'),
	 rigger       = require('gulp-rigger'),
	 sourcemaps   = require('gulp-sourcemaps'),
	 plumber      = require('gulp-plumber'),
    spritesmith  = require('gulp.spritesmith'),
	 csscomb      = require('gulp-csscomb'),
	 reload       = browserSync.reload



gulp.task('getLibs', function() {
	
	var jsLibs = gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		//'node_modules/bootstrap/dist/js/bootstrap.min.js',
		//'node_modules/slick-carousel/slick/slick.min.js',
		//'node_modules/nouislider/distribute/nouislider.min.js',
		//'node_modules/wnumb/wNumb.js',
		//'node_modules/jquery-form-styler/dist/jquery.formstyler.min.js',
		//'node_modules/jquery.nicescroll/dist/jquery.nicescroll.min.js',
		//'node_modules/lightbox2/dist/js/lightbox.min.js',
		//'node_modules/lightcase/src/js/lightcase.js',
		//'node_modules/jquery-validation/dist/jquery.validate.min.js',
		//'node_modules/raty-js/lib/jquery.raty.js'
	])
	.pipe(gulp.dest('dist/js'));
	
	var cssLibs = gulp.src([
		// 'node_modules/bootstrap/dist/css/bootstrap.min.css',
		//'node_modules/slick-carousel/slick/slick.css',
		//'node_modules/nouislider/distribute/nouislider.min.css',
		//'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
		//'node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css',
		//'node_modules/lightbox2/dist/css/lightbox.min.css',
		//'node_modules/lightcase/src/css/lightcase.css',
		//'node_modules/animate.css/animate.min.css'
	])
	.pipe(gulp.dest('dist/css'));
	
	var imgS = gulp.src([
		//'node_modules/lightbox2/dist/images/*.*'
	])
	.pipe(gulp.dest('dist/img/images'));
	
	// var fontS = gulp.src([
	// 	'node_modules/lightcase/src/fonts/*.*'
	// ])
	// .pipe(gulp.dest('dist/fonts'));
	
});


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		port: 3300,
		ui: {
			port: 4400
		},
		notify: false
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});
gulp.task('svgSpriteBuild', function () {
    return gulp.src( 'src/img/svg/*.svg')
    // // minify svg
    //     .pipe(svgmin({
    //         js2svg: {
    //             pretty: false
    //         }
    //     }))
    // remove all fill and style declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '>', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
                mode: "symbols",
                preview: false,
                selector: "icon-%f",
                svg: {
                    symbols: 'symbol_sprite.svg'
                }
            }
        ))
        .pipe(gulp.dest( 'src/img/'));
});

gulp.task('html:build', function () {
	gulp.src('src/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('dist'))
	.pipe(reload({stream: true}));
});


gulp.task('css:build', function () {
	gulp.src(['src/css/*.scss', '!src/css/sprite.scss'])
	// .pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
	.pipe(prefixer(['last 10 versions', '> 1%', 'ie 10']))
	.pipe(csscomb())
	// .pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/css'))
	.pipe(reload({stream: true}));
	gulp.src('src/css/libs/*.css')
	.pipe(gulp.dest('dist/css'))
	.pipe(reload({stream: true}));
});


gulp.task('js:build', function () {
	gulp.src(['src/js/*.js'])
	.pipe(gulp.dest('dist/js'))
	.pipe(reload({stream: true}));
});


gulp.task('sprite:build', function () {
    var sprite = gulp.src('src/img/icons/*.png')
		.pipe(spritesmith({
        imgName: 'src/img/sprite.png',
        cssName: 'sprite.scss',
        cssFormat: 'scss',
        algorithm: 'left-right',
        padding: 5
    }));
    sprite.img.pipe(gulp.dest(''));
    sprite.css.pipe(gulp.dest('src/css/'));
});


gulp.task('image:build', function () {
	gulp.src(['src/img/**/*.*', '!src/img/icons/*.*'])
//	.pipe(imagemin({
//		interlaced: true,
//		progressive: true,
//		svgoPlugins: [{removeViewBox: false}],
//		use: [pngquant()]
//	}))
	.pipe(gulp.dest('dist/img'));
});


// gulp.task('fonts:build', function () {
// 	gulp.src('src/fonts/*.*')
// 	.pipe(gulp.dest('dist/fonts'));
// });

gulp.task('fav:build', function () {
	gulp.src('src/*.ico')
	.pipe(gulp.dest('dist'));
});


gulp.task('build', [
	'html:build',
   'sprite:build',
	'css:build',
	'js:build',
	// 'fonts:build',
	'image:build',
	'fav:build',
]);

gulp.task('svgSprite', ['svgSpriteBuild']);

gulp.task('clean', function() {
	return del.sync('dist');
});


gulp.task('clear', function () {
	return cache.clearAll();
});


gulp.task('watch', function () {
	gulp.watch('src/**/*.html', ['html:build']);
	gulp.watch('src/css/**/*.scss', ['css:build']);
	gulp.watch('src/js/**/*.js', ['js:build']);
   gulp.watch('src/img/icons/**/*.*', ['sprite:build']);
	gulp.watch('src/img/**/*.*', ['image:build']);
	// gulp.watch('src/fonts/**/*.*', ['fonts:build']);
	gulp.watch('src/**/*.ico', ['fav:build']);
});


gulp.task('default', [
	'clean',
	'getLibs',
	'build',
	'browser-sync',
	'watch'
]);





