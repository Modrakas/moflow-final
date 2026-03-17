/**
 * MoFlow Lab — gulpfile.js
 * Build pipeline:
 *   SCSS  → gulp-sass → autoprefixer → purgecss → css/index.css
 *   JS    → webpack-stream (Babel) → dist/main.min.js
 */

'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const purgecss     = require('gulp-purgecss');
const webpack      = require('webpack-stream');
const TerserPlugin = require('terser-webpack-plugin');
const path         = require('path');

// ─── Paths ───────────────────────────────────────────────────
const PATHS = {
  scss: {
    src:   'sass/index.scss',
    watch: 'sass/**/*.scss',
    dest:  'css',
  },
  js: {
    entry: './js/app.js',
    watch: 'js/**/*.js',
    dest:  'dist',
  },
  html: ['*.html'],
};

// ─── SCSS task ───────────────────────────────────────────────
// Compiles sass/index.scss → css/index.css
// Runs autoprefixer then PurgeCSS (safelist covers JS-toggled classes).
function styleTask() {
  return src(PATHS.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(purgecss({
      content: PATHS.html,
      safelist: {
        standard: [
          // Cursor states — CursorManager
          'is-hovering',
          'is-project',
          // Header scroll state — ScrollAnimations
          'is-scrolled',
          // Noise canvas active state — NoiseGenerator
          'is-active',
          // Project follow image visible state — ProjectReveal
          'is-visible',
          // Dynamically created element + BEM children — ProjectReveal
          'project-follow-img',
          'project-follow-img__inner',
          'project-follow-img__noise',
          'project-follow-img__scan',
          'project-follow-img__label',
          // DataManager injected classes — never in static HTML, PurgeCSS can't see them
          'project__stack',
          'project__stack-badge',
        ],
      },
    }))
    .pipe(dest(PATHS.scss.dest));
}

// ─── JS task ─────────────────────────────────────────────────
// Bundles js/app.js + all ES6 modules via webpack.
// Babel transpiles to ES5 for broad browser support.
// Output: dist/main.min.js
function jsTask() {
  return src(PATHS.js.entry)
    .pipe(webpack({
      mode: 'production',
      entry: PATHS.js.entry,
      output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'dist'),
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: '> 1%, not dead' }],
                ],
              },
            },
          },
        ],
      },
      optimization: {
        minimizer: [new TerserPlugin({ extractComments: false })],
      },
      // GSAP and Lenis are loaded as CDN globals — tell webpack not to bundle them.
      externals: {
        gsap:          'gsap',
        ScrollTrigger: 'ScrollTrigger',
      },
    }))
    .pipe(dest(PATHS.js.dest));
}

// ─── Watch task ──────────────────────────────────────────────
function watchTask() {
  watch('sass/**/*.scss', styleTask);
  watch('js/**/*.js', jsTask);
}

// ─── Exports ─────────────────────────────────────────────────
exports.styles  = styleTask;
exports.scripts = jsTask;
exports.watch   = watchTask;
exports.build   = parallel(styleTask, jsTask);
exports.default = series(parallel(styleTask, jsTask), watchTask);
