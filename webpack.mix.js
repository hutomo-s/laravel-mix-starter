const mix = require('laravel-mix')
require('laravel-mix-imagemin')
const IS_PRODUCTION = process.env.NODE_ENV === 'production' ? true : false
const publicPath = (IS_PRODUCTION) ? 'public-build' : 'public'

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

//mix.js('src/app.js', 'dist/').sass('src/app.scss', 'dist/');


// Copy all files within `resources` matching `img/**.*` into the public path, preserving the file tree.
// Minify all images, `optipng` with `optimizationLevel` 5, disabling `jpegtran`, and adding `mozjpeg`.
// https://laravel-mix.com/extensions/imagemin
// https://laravel-mix.com/docs/4.0/css-preprocessors
mix
	.setPublicPath(publicPath)
	.js('resources/js/main.js', publicPath + '/js')
	.postCss('resources/css/main.css', publicPath + '/css', [
    	require('precss')()
	])
	.imagemin(
        'img/**.*',
        {
            context: 'resources',
        },
        {
            optipng: {
                optimizationLevel: 5
            },
            jpegtran: null,
            plugins: [
                require('imagemin-mozjpeg')({
                    quality: 100,
                    progressive: true,
                }),
            ],
        }
    ).then(function() {
        // double build for production
        if(IS_PRODUCTION)
        {
            console.log('copying production build...')

            let ncp = require('ncp').ncp
            let source = __dirname + '/public-build'
            let destination = __dirname + '/public'

            ncp(source, destination, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('production build done!')
            })
        }
    })


// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   terser: {}, // Terser-specific options. https://github.com/webpack-contrib/terser-webpack-plugin#options
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
