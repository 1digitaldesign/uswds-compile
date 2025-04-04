'use strict';

// Required packages
const { src, dest, series, parallel, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const fs = require('fs');
const path = require('path');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const svgSprite = require('gulp-svgstore');

// Logging utilities
const log = console.log;
const colors = {
  error: '\x1b[31m%s\x1b[0m',   // red
  success: '\x1b[32m%s\x1b[0m', // green
  info: '\x1b[34m%s\x1b[0m',    // blue
  warning: '\x1b[33m%s\x1b[0m'  // yellow
};

/*
----------------------------------------
SETTINGS
----------------------------------------
*/
const settings = {
  version: 3,
  compile: {
    paths: {
      src: {
        uswds: null,
        sass: null,
        theme: null,
        fonts: null,
        img: null,
        js: null,
        projectSass: './sass',
        projectIcons: '',
        defaults: {
          v2: {
            uswds: './node_modules/uswds/dist',
            sass: './node_modules/uswds/dist/scss',
            theme: './node_modules/uswds/dist/scss/theme',
            fonts: './node_modules/uswds/dist/fonts',
            img: './node_modules/uswds/dist/img',
            js: './node_modules/uswds/dist/js',
          },
          v3: {
            uswds: './node_modules/@uswds',
            sass: './node_modules/@uswds/uswds/packages',
            theme: './node_modules/@uswds/uswds/dist/theme',
            fonts: './node_modules/@uswds/uswds/dist/fonts',
            img: './node_modules/@uswds/uswds/dist/img',
            js: './node_modules/@uswds/uswds/dist/js',
          },
        },
      },
      dist: {
        theme: './sass',
        img: './assets/uswds/img',
        fonts: './assets/uswds/fonts',
        js: './assets/uswds/js',
        css: './assets/uswds/css',
      },
    },
    browserslist: ['> 2%', 'last 2 versions', 'not dead'],
    sassSourcemaps: true,
    sassDeprecationWarnings: false,
  },
  sprite: {
    width: 24,
    height: 24,
    separator: '-',
    projectIconsOnly: false,
  },
};

const paths = settings.compile.paths;

/*
----------------------------------------
UTILITY FUNCTIONS
----------------------------------------
*/

/**
 * Clean path strings to avoid double slashes
 * @param {string} pathString - Path to clean
 * @returns {string} - Cleaned path
 */
const cleanPath = (pathString) => pathString.replace('//', '/');

/**
 * Get source path for given key
 * @param {string} key - Path key to get
 * @returns {string} - Source path
 */
const getSrcFrom = (key) => {
  if (paths.src[key]) {
    return paths.src[key];
  }
  return paths.src.defaults[`v${settings.version}`][key];
};

/**
 * Error handler for gulp streams
 * @param {Error} error - Error object
 * @returns {void}
 */
function handleError(error) {
  log(colors.error, `Error: ${error.message}`);
  if (error.stack) {
    log(colors.error, `Stack Trace: ${error.stack}`);
  }
  this.emit('end');
}

/**
 * Log the USWDS version
 * @returns {Promise<string>}
 */
function logVersion() {
  log(colors.info, `USWDS version: ${settings.version}`);
  return Promise.resolve('logged version');
}

/**
 * Get USWDS version from package.json
 * @returns {Promise<string>} - USWDS version
 */
async function getUswdsVersion() {
  const uswdsPackage = '@uswds/uswds';
  try {
    const packagePath = path.join(
      path.dirname(require.resolve(uswdsPackage)),
      '../../'
    );
    const packageJson = await import(`${packagePath}/package.json`, { assert: { type: 'json' } });
    return packageJson.default.version;
  } catch (error) {
    log(colors.error, `Error getting USWDS version: ${error.message}`);
    return 'unknown';
  }
}

/*
----------------------------------------
DIRECTORY MANAGEMENT
DIRECTORY MANAGEMENT
----------------------------------------
*/

/**
 * Create destination folders if they don't exist
 * @param {Function} done - Callback when complete
 */
function makeDestFolders(done) {
  try {
    Object.entries(paths.dist).forEach(([key, assetPath]) => {
      if (!fs.existsSync(assetPath)) {
        fs.mkdirSync(assetPath, { recursive: true });
        log(colors.info, `Created directory: ${assetPath}`);
      }
    });
    done();
  } catch (error) {
    log(colors.error, `Error creating directories: ${error.message}`);
    done(error);
  }
}

/**
 * Clean all destination folders' contents
 * @param {Function} done - Callback when complete
 */
function cleanAll(done) {
  try {
    Object.entries(paths.dist).forEach(([key, assetPath]) => {
      if (fs.existsSync(assetPath)) {
        fs.readdirSync(assetPath).forEach((file) => {
          const filePath = path.join(assetPath, file);
          fs.rmSync(filePath, { recursive: true, force: true });
          log(colors.warning, `Deleted from ${key}: ${filePath}`);
        });
      }
    });
    done();
  } catch (error) {
    log(colors.error, `Error cleaning folder contents: ${error.message}`);
    done(error);
  }
}

/*
----------------------------------------
COPY TASKS
COPY TASKS
----------------------------------------
*/

/**
 * Create a copy task for a specific asset type
 * @param {string} key - Key for the asset type
 * @param {string} label - Human-readable label
 * @returns {Function} - Gulp task function
 */
function createCopyTask(key, label) {
  return function() {
    const srcPath = getSrcFrom(key);
    const destPath = paths.dist[key];
    log(colors.info, `Copy USWDS ${label}: ${srcPath} → ${destPath}`);
    return src(cleanPath(`${srcPath}/**/*`))
      .pipe(dest(destPath))
      .on('error', handleError);
  };
}

const copy = {
  theme: createCopyTask('theme', 'theme files'),
  fonts: createCopyTask('fonts', 'fonts'),
  images: createCopyTask('img', 'images'),
  js: createCopyTask('js', 'JavaScript')
};

/*
----------------------------------------
SASS COMPILATION
SASS COMPILATION
----------------------------------------
*/

/**
 * Build Sass files
 * @returns {NodeJS.ReadWriteStream}
 */
function buildSass() {
  const buildSettings = {
    postcssPlugins: [
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: settings.compile.browserslist,
      }),
      csso({ forceMediaMerge: false }),
    ],
    includes: [
      paths.dist.theme,
      getSrcFrom('uswds'),
      cleanPath(`${getSrcFrom('sass')}/packages`),
      getSrcFrom('sass'),
    ],
  };


  return src(cleanPath(`${paths.dist.theme}/*.scss`), {
    sourcemaps: !!settings.compile.sassSourcemaps,
  })
    .pipe(
      sass({
        outputStyle: 'compressed',
        includePaths: buildSettings.includes,
        quietDeps: !settings.compile.sassDeprecationWarnings,
      }).on('error', sass.logError)
    )
    .pipe(postcss(buildSettings.postcssPlugins))
    .pipe(postcss(buildSettings.postcssPlugins))
    .pipe(
      dest(paths.dist.css, {
        sourcemaps: settings.compile.sassSourcemaps ? '.' : false,
      })
    );
}

/**
 * Watch Sass files for changes
 * @returns {NodeJS.ReadWriteStream}
 */
function watchSass() {
  const watchPaths = [
    cleanPath(`${paths.dist.theme}/**/*.scss`),
    cleanPath(`${paths.src.projectSass}/**/*.scss`),
  ];

  log(colors.info, `Watching for changes in: ${watchPaths.join(', ')}`);
  return watch(watchPaths, buildSass);
}

/*
----------------------------------------
SVG SPRITE GENERATION
----------------------------------------
*/

/**
 * Get paths for SVG sprite generation
 * @param {Array<string>} spritePaths - Initial sprite paths
 * @returns {Array<string>} - Final sprite paths
 */
function getSpritePaths(spritePaths = []) {
  const defaultSpritePath = cleanPath(`${paths.dist.img}/usa-icons/**/*.svg`);
  const customSpritePath = paths.src.projectIcons.length
    ? cleanPath(`${paths.src.projectIcons}/**/*.svg`)
    : '';

  if (customSpritePath) {
    spritePaths.push(customSpritePath);
    if (settings.sprite.projectIconsOnly) {
      return spritePaths;
    }
  }

  if (settings.sprite.projectIconsOnly && !customSpritePath) {
    log(
      colors.warning,
      `You've set sprite.projectIconsOnly to true, but haven't defined a custom project icon path directory (paths.src.projectIcons). Using default: "${defaultSpritePath}"`
    );
  }

  spritePaths.push(defaultSpritePath);
  return spritePaths;
}

/**
 * Build SVG sprite
 * @returns {NodeJS.ReadWriteStream}
 */
function buildSprite() {
  const spritePaths = getSpritePaths();
  log(colors.info, `Building sprite from: ${spritePaths.join(', ')}`);

  return src(spritePaths, {
    allowEmpty: true,
    encoding: false,
  })
    .pipe(svgSprite())
    .pipe(rename('usa-icons.svg'))
    .on('error', handleError)
    .pipe(dest(paths.dist.img));
}

/**
 * Rename sprite file
 * @returns {NodeJS.ReadWriteStream}
 */
function renameSprite() {
  return src(cleanPath(`${paths.dist.img}/usa-icons.svg`), {
    allowEmpty: true,
    encoding: false,
  })
    .pipe(rename(cleanPath(`${paths.dist.img}/sprite.svg`)))
    .pipe(dest('./'));
}

/**
 * Clean up temporary sprite file
 * @param {Function} done - Callback when complete
 */
function cleanSprite(done) {
  const filePath = cleanPath(`${paths.dist.img}/usa-icons.svg`);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log(colors.warning, `Deleted temporary sprite: ${filePath}`);
    }
    done();
  } catch (error) {
    log(colors.error, `Error deleting file: ${error.message}`);
    done(error);
  }
}

/*
----------------------------------------
EXPORTS
----------------------------------------
*/

// Export settings
/*
----------------------------------------
EXPORTS
----------------------------------------
*/

// Export settings
exports.settings = settings;
exports.paths = paths;
exports.sprite = settings.sprite;

// Export individual copy tasks

// Export individual copy tasks
exports.copyTheme = copy.theme;
exports.copyFonts = copy.fonts;
exports.copyImages = copy.images;
exports.copyJS = copy.js;

// Export grouped copy tasks

// Export grouped copy tasks
exports.copyAssets = series(copy.fonts, copy.images, copy.js);
exports.copyAll = series(copy.theme, exports.copyAssets);

// Export compilation tasks
exports.copyAll = series(copy.theme, exports.copyAssets);

// Export compilation tasks
exports.compileSass = series(logVersion, buildSass);
exports.compileIcons = series(buildSprite, renameSprite, cleanSprite);
exports.compile = series(
  logVersion,
  makeDestFolders,
  parallel(buildSass, exports.compileIcons)
);

// Export workflow tasks
exports.updateUswds = series(exports.copyAssets, exports.compile);
exports.init = series(logVersion, exports.copyAll, exports.compile);
exports.watch = series(logVersion, buildSass, watchSass);
exports.default = exports.watch;
exports.cleanAll = cleanAll;
exports.default = exports.watch;
exports.cleanAll = cleanAll;
