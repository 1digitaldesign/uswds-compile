# USWDS Compile

[![npm Version](https://img.shields.io/npm/v/@uswds/compile?style=flat-square)](https://www.npmjs.com/package/@uswds/compile)
[![npm Downloads](https://img.shields.io/npm/dt/@uswds/compile?style=flat-square)](https://www.npmjs.com/package/@uswds/compile)

Simple [Gulp 5](https://gulpjs.com/) functions for copying [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) static assets and transforming USWDS Sass into browser-readable CSS.

This package provides a streamlined approach to working with USWDS in your projects, handling all the complex build processes automatically so you can focus on your design and development work.

## Key Features

- **Easy Setup**: Simple configuration to get started with USWDS quickly
- **Asset Management**: Automated copying of USWDS fonts, images, and JavaScript files
- **SASS Compilation**: Transforms USWDS Sass into browser-ready CSS with proper prefixing
- **Icon Sprite Generation**: Creates SVG sprites from USWDS icons and your custom icons
- **Watch Mode**: Automatically rebuilds when your source files change
- **Version Support**: Works with both USWDS 2.x and 3.x versions
- **Custom Theming**: Easily override USWDS defaults with your own settings

## Requirements

- [Node.js (v20 or higher)](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [uswds](https://www.npmjs.com/package/uswds)

## Installation

Install `@uswds/compile` in the project root:

```bash
npm install @uswds/compile --save-dev
```

## Usage

### Overview

1. Create a `gulpfile.js` file in the project root that includes the following:
   - Imported `@uswds/compile` package
   - Any project path settings you wish to modify (see [Path settings](#path-settings), below)
   - Exports for the functions/tasks you need (see [Functions](#functions), below)
1. In the terminal run `npx gulp [function]`

### Gulpfile setup

Create a file called `gulpfile.js` at the root of your project (or use an existing Gulpfile if one already exists). It needs to do the following:

- Import the `@uswds/compile` package
- Set any project settings
- Export the functions/tasks you need

Here's an example of how your `gulpfile.js` might look:

```js
/* gulpfile.js */

const uswds = require("@uswds/compile");

/**
 * USWDS version
 */

uswds.settings.version = 3;

/**
 * Path settings
 * Set as many as you need
 */

uswds.paths.dist.css = "./assets/css";
uswds.paths.dist.theme = "./sass";

/**
 * Exports
 * Add as many as you need
 */

exports.init = uswds.init;
exports.compile = uswds.compile;
```

### USWDS version setting

USWDS is changing its file structure and package naming convention starting with USWDS 3.0. Use the USWDS version key to compile properly with the version of USWDS you're using.

**When migrating from USWDS 2.x to USWDS 3.x, simply update the value of `settings.version` to `3` once you've installed `@uswds/uswds` with npm.**

| Setting            | Default | Description                                                                                                                             |
| ------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `settings.version` | `2`     | The major version of the `uswds` package used in the project. USWDS 2.x projects should use `2` and USWDS 3.x+ projects should use `3`. |

### Migrating from USWDS 2.x to 3.x

When upgrading a project from USWDS 2.x to 3.x, follow these steps:

1. **Update the USWDS package:**
   ```bash
   npm uninstall uswds
   npm install @uswds/uswds --save
   ```

2. **Update your gulpfile.js:**
   ```js
   // Change version setting
   uswds.settings.version = 3;
   ```

3. **Update your Sass imports:**
   In USWDS 3.x, the `@import` syntax is deprecated in favor of `@use` and `@forward`:

   **USWDS 2.x style:**
   ```scss
   // Old 2.x style
   @import 'uswds';
   ```

   **USWDS 3.x style:**
   ```scss
   // New 3.x style
   @forward "uswds";
   ```

4. **Run the update task:**
   ```bash
   npx gulp updateUswds
   ```

5. **Update theme settings:**
   USWDS 3.x introduced changes to theme settings. Refer to the [USWDS 3.0 Migration Guide](https://designsystem.digital.gov/documentation/migration/) for details on updating your theme settings.

6. **Review component updates:**
   Some components have changed in USWDS 3.x. Check the migration guide for specific component changes that might affect your project.

### Path settings

Use path settings to customize where USWDS Compile looks for USWDS source and outputs processed files. **The value of the default may depend on the USWDS version you've defined in `settings.version`.** When applicable, the relevant value of `settings.version` precedes the default.

| Setting                  | Default                                                                                            | Description                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paths.src.uswds`        | `2`: `"./node_modules/uswds/dist"`<br />`3`: `"./node_modules/@uswds"`                             | Source location of the `uswds` package                                                                                                                                        |
| `paths.src.sass`         | `2`: `"./node_modules/uswds/dist/scss"`<br />`3`: `"./node_modules/@uswds/uswds/packages"`         | Source location of the USWDS Sass                                                                                                                                             |
| `paths.src.theme`        | `2`: `"./node_modules/uswds/dist/scss/theme"`<br />`3`: `"./node_modules/@uswds/uswds/dist/theme"` | Source location of the USWDS theme files (Sass entry point and starter settings files)                                                                                        |
| `paths.src.fonts`        | `2`: `"./node_modules/uswds/dist/fonts"`<br />`3`: `"./node_modules/@uswds/uswds/dist/fonts"`      | Source location of the USWDS fonts                                                                                                                                            |
| `paths.src.img`          | `2`: `"./node_modules/uswds/dist/img"`<br />`3`: `"./node_modules/@uswds/uswds/dist/img"`          | Source location of the USWDS images                                                                                                                                           |
| `paths.src.js`           | `2`: `"./node_modules/uswds/dist/js"`<br />`3`: `"./node_modules/@uswds/uswds/dist/js"`            | Source location of the USWDS compiled JavaScript files                                                                                                                        |
| `paths.src.projectSass`  | `"./sass"`                                                                                         | Source location of any existing project Sass files outside of `paths.dist.theme`. The `watch` script will watch this directory for changes.                                   |
| `paths.src.projectIcons` | `""`                                                                                               | Source location of any additional project icons to include in the icon sprite. (Use _only_ these project icons in the sprite by setting `sprite.projectIconsOnly` to `true`.) |
| `paths.dist.theme`       | `"./sass"`                                                                                         | Project destination for theme files (Sass entry point and settings)                                                                                                           |
| `paths.dist.img`         | `"./assets/uswds/images"`                                                                          | Project destination for images                                                                                                                                                |
| `paths.dist.fonts`       | `"./assets/uswds/fonts"`                                                                           | Project destination for fonts                                                                                                                                                 |
| `paths.dist.js`          | `"./assets/uswds/js"`                                                                              | Project destination for compiled JavaScript                                                                                                                                   |
| `paths.dist.css`         | `"./assets/uswds/css"`                                                                             | Project destination for compiled CSS                                                                                                                                          |

### Additional settings

| Setting                           | Default                                            | Description                                                                                                                                                                                     |
| --------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sprite.projectIconsOnly`         | `false`                                            | Include _only_ the icons in `paths.src.projectIcons` in the icon sprite.                                                                                                                        |
| `settings.compile.browserslist`   | `["> 2%", "last 2 versions", "IE 11", "not dead"]` | Define the [browserslist query](https://github.com/browserslist/browserslist?tab=readme-ov-file#queries) for CSS prefixes generated by [autoprefixer](https://github.com/postcss/autoprefixer).      |
| `settings.compile.sassSourcemaps` | `true`                                             | Include sourcemap when compiling SASS to CSS.                                                                                                                                                   |
| `settings.compile.sassDeprecationWarnings`  | `false`                                  | Show USWDS Sass deprecation warnings. When set to `true`, Sass will output deprecation warnings for USWDS code in the terminal during compilation. Deprecation warnings for non-USWDS Sass will output even when this value is set to `false`. |

### Functions

Export USWDS Compile functions in your project's `gulpfile.js` to use them in your project.

| Function       | Description                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `compile`      | `compileSass` + `compileIcons`                                                                                   |
| `compileIcons` | Build the USWDS icon sprite into `paths.dist.img`                                                                |
| `compileSass`  | Compile Sass into `paths.dist.css`                                                                               |
| `default`      | `watch`                                                                                                          |
| `copyAll`      | `copyTheme` + `copyAssets`                                                                                       |
| `copyAssets`   | Copies all static assets: `copyFonts` + `copyImages` + `copyJS`                                                  |
| `copyFonts`    | Copy USWDS fonts to `paths.dist.fonts`                                                                           |
| `copyImages`   | Copy USWDS images to `paths.dist.img`                                                                            |
| `copyJS`       | Copy USWDS compiled JavaScript to `paths.dist.js`                                                                |
| `copyTheme`    | Copy USWDS theme files (Sass entry point and settings files) from the `uswds` package to `paths.dist.theme`      |
| `init`         | `copyAll` + `compile`                                                                                            |
| `updateUswds`  | `copyAssets` + `compile`                                                                                         |
| `watch`        | Compiles, then recompiles when there are changes to Sass files in `paths.dist.theme` and `paths.src.projectSass` |

### Running the compile functions

For any function you defined as an `export` in your `gulpfile.js` you can run `npx gulp [function]`

For example, if you have the following `gulpfile.js`:

```
/* gulpfile,js */

...

exports.compile = uswds.compile;
exports.watch = uswds.watch;
exports.init = uswds.init;
exports.updateUswds = uswds.updateUswds;
exports.default = uswds.watch;
```

With that setup, you could do the following in the terminal:

- **Compile Sass:** `npx gulp compile` or `npx gulp`
- **Watch for changes and recompile:** `npx gulp watch`
- **Initialize a new project:** `npx gulp init`
- **Update USWDS static assets and recompile:** `npx gulp updateUswds`

### Usage tips

- **Use `init` only once.** The `init` task is meant for initializing the design system on a project. Since it will overwrite project files (like settings files and the Sass entry point), use it sparingly and don't use it for updating the design system on a project, or at any point after you've customized your settings files.
- **Stay up-to-date with USWDS with `updateUswds`.** When updating your project's version of USWDS, run the `npx gulp updateUswds` command to copy any updated USWDS assets into your project. Alternatively, you can run the `copyAssets` task. These tasks update USWDS static assets (like images, fonts, and compiled JavaScript) and will not override any of your project customizations. These actions might introduce breaking changes, so be sure to check out the related [USWDS releases notes](https://github.com/uswds/uswds/releases) for any additional tasks that must be completed when updating to a new version of USWDS.
- **Compile only from a single Sass entry point.** Define the location of this entry point with `paths.dist.theme`. If you have project Sass files outside the `paths.dist.theme` directory, load these files into your single entry point via `@forward`, `@use`, or `@import`. To include these project Sass files in your `gulp watch` task, set `paths.src.projectSass` to your project Sass directory. The Sass will still compile from the single entry point located in `paths.dist.theme`.
- **Only check theme files and custom icons into version control.** You should have a build process that copies static assets like images, fonts, and compiled JavaScript from the `uswds` package. This assures that these assets are up-to-date with whatever version of USWDS you're using. You only need to track your customizations (like settings, theme files, custom icons, and your gulpfile) in version control.

### Updating the USWDS icon sprite

After running either `init` or `copyAssets`, you'll find USWDS images in the `paths.dist.img` directory. Any icon SVG file in `usa-icons` directory within the `paths.dist.img` directory will compile into the icon sprite when running the `compileIcons` function.

#### Add icons to the icon sprite

1. Create a directory for the new icons anywhere in your project
1. Add icons (typically from either `uswds-icons` or `material-icons`) to this directory. **These icons will be added to the default USWDS icons in the sprite.**
1. In your project Gulpfile, set `uswds.paths.src.projectIcons` to this new directory. For example
   ```js
   uswds.paths.src.projectIcons = "./assets/img/my-icons";
   ```
1. Run either the `compile` or the `compileIcons` function to compile a new sprite. This sprite includes the USWDS default icons and the new project icons.

#### Use only project icons in the icon sprite

1. Create a directory for the new icons anywhere in your project
1. Add icons (typically from either `usa-icons`, `uswds-icons`, or `material-icons`) to this directory. **These will be the only icons included in the sprite.**
1. In your project Gulpfile, set `uswds.paths.src.projectIcons` to this new directory. For example
   ```js
   uswds.paths.src.projectIcons = "./assets/img/my-icons";
   ```
1. In your project Gulpfile, set `uswds.sprite.projectIconsOnly` to `true`. For example
   ```js
   uswds.sprite.projectIconsOnly = true;
   ```
1. Run either the `compile` or the `compileIcons` function to compile a new sprite. This sprite will include only the new project icons.

#### Using the icon sprite in your HTML

Once your sprite is generated, you can use the icons in your HTML with the following pattern:

```html
<svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
  <use xlink:href="/assets/img/sprite.svg#icon-name"></use>
</svg>
```

Replace `/assets/img/sprite.svg` with the path to your sprite file and `icon-name` with the name of the icon you want to use. For example, to use the "check" icon:

```html
<svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
  <use xlink:href="/assets/img/sprite.svg#check"></use>
</svg>
```

#### Creating custom icons

When creating custom icons for your project:

1. Create SVG files with dimensions matching the USWDS icons (usually 24x24px)
2. Remove any unnecessary attributes or elements from the SVG
3. Name your files consistently (e.g., `icon-custom-name.svg`)
4. Place them in your project icons directory
5. For accessibility, include appropriate aria attributes when using them in HTML

## Performance Optimization

To improve build performance and reduce development friction:

### Optimizing Sass Compilation

1. **Selective imports:** Only import the USWDS components you need
   ```scss
   // Import only specific components
   @use "uswds-core" with (
     $theme-show-notifications: false
   );
   @forward "uswds/packages/usa-accordion";
   @forward "uswds/packages/usa-banner";
   @forward "uswds/packages/usa-button";
   ```

2. **Disable sourcemaps in production:**
   ```js
   // Development
   uswds.settings.compile.sassSourcemaps = true;

   // Production
   uswds.settings.compile.sassSourcemaps = false;
   ```

3. **Only compile changed files:**
   ```js
   // Use gulp-changed to only process modified files
   const changed = require('gulp-changed');

   function customSassCompile() {
     return src('./sass/**/*.scss')
       .pipe(changed('./assets/css', { extension: '.css' }))
       .pipe(sass().on('error', sass.logError))
       .pipe(postcss([autoprefixer()]))
       .pipe(dest('./assets/css'));
   }
   ```

### Optimizing Asset Management

1. **Selective icon usage:** Only include the icons you need
   ```js
   // Create a custom directory with only needed icons
   uswds.paths.src.projectIcons = "./src/icons";
   uswds.sprite.projectIconsOnly = true;
   ```

2. **Parallel task execution:** Use `parallel()` for independent tasks
   ```js
   const { parallel } = require('gulp');

   exports.build = parallel(
     uswds.compileSass,
     uswds.compileIcons
   );
   ```

## Complete Project Example

Below is a more complete example of how to set up a project using USWDS Compile:

#### Project Structure

```
my-uswds-project/
├── assets/                    # Generated files (not committed to version control)
│   ├── css/                   # Compiled CSS
│   ├── js/                    # Copied JS from USWDS
│   ├── fonts/                 # Copied fonts from USWDS
│   └── img/                   # Copied images from USWDS
├── sass/                      # Your project's Sass files
│   ├── _uswds-theme.scss      # USWDS theme settings
│   ├── _uswds-theme-custom-styles.scss  # Custom component styles
│   └── styles.scss            # Main entry point file
├── src/                       # Your custom source code
│   ├── js/                    # Your JavaScript files
│   └── img/                   # Your custom images
├── .gitignore                 # Ignores generated files
├── gulpfile.js                # Gulp configuration using USWDS Compile
├── package.json
└── README.md
```

#### package.json

```json
{
  "name": "my-uswds-project",
  "version": "1.0.0",
  "description": "A project using USWDS",
  "scripts": {
    "start": "gulp watch",
    "build": "gulp init",
    "update": "gulp updateUswds",
    "compile": "gulp compile"
  },
  "dependencies": {
    "@uswds/uswds": "^3.12.0"
  },
  "devDependencies": {
    "@uswds/compile": "^1.3.0",
    "gulp": "^5.0.0"
  }
}
```

#### gulpfile.js (Extended Example)

```js
const uswds = require("@uswds/compile");
const { series } = require("gulp");

/**
 * USWDS version
 */
uswds.settings.version = 3;

/**
 * Path settings
 */
// Source paths - where to look for USWDS files and your project files
uswds.paths.src.projectSass = "./sass";
uswds.paths.src.projectIcons = "./src/img/icons";

// Destination paths - where to output compiled files
uswds.paths.dist.css = "./assets/css";
uswds.paths.dist.theme = "./sass";
uswds.paths.dist.img = "./assets/img";
uswds.paths.dist.fonts = "./assets/fonts";
uswds.paths.dist.js = "./assets/js";

/**
 * Additional settings
 */
// Include source maps in compiled CSS
uswds.settings.compile.sassSourcemaps = true;

// Use custom browser targeting
uswds.settings.compile.browserslist = [
  "> 1%",
  "last 2 versions",
  "not dead"
];

// Only use custom project icons
uswds.sprite.projectIconsOnly = false;

/**
 * Export USWDS Compile functions
 */
// Core tasks
exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;

// Copy tasks
exports.copyAssets = uswds.copyAssets;
exports.copyTheme = uswds.copyTheme;
exports.copyAll = uswds.copyAll;

// Compile tasks
exports.compileSass = uswds.compileSass;
exports.compileIcons = uswds.compileIcons;

// Maintenance tasks
exports.updateUswds = uswds.updateUswds;
exports.cleanAll = uswds.cleanAll;

// Default task
exports.default = uswds.watch;

/**
 * Custom tasks
 */
// Add your own custom tasks here
// ...

// Example: Custom build task that runs init once, then switches to watch
function initialBuild(done) {
  console.log("Initial build complete! Now watching for changes...");
  done();
}

exports.devStart = series(
  uswds.init,
  initialBuild,
  uswds.watch
);
```

#### Using npm scripts

With the above setup, you can use the following npm commands:

```bash
# Start development with watch mode
npm start

# Initialize the project with USWDS assets
npm run build

# Update USWDS assets without overwriting customizations
npm run update

# Compile Sass and icons without copying assets
npm run compile
```

#### Customizing USWDS Theme

In your `/sass/_uswds-theme.scss` file:

```scss
@use "uswds-core" with (
  // Colors
  $theme-primary-family: "blue",
  $theme-link-color: "primary",

  // Typography
  $theme-font-type-sans: "public-sans",
  $theme-font-role-heading: "sans",

  // Components
  $theme-button-border-radius: "md",
  $theme-card-border-radius: "md",

  // Utilities
  $theme-image-path: "../img",
  $theme-font-path: "../fonts"
);
```

In your `/sass/_uswds-theme-custom-styles.scss` file:

```scss
@use "uswds-core" as *;

// Add custom component styles here
.my-custom-component {
  @include u-padding(2);
  @include u-border(2px, "primary-dark");
  @include u-color("primary-darker");
  @include u-bg("gray-2");
}

// Override USWDS component styles
.usa-button {
  &:hover {
    @include u-bg("primary-vivid");
  }
}
```

## Autoprefixer

We use Autoprefixer for maximum browser compatibility. We target the the following browsers. When you compile with the USWDS compiler, we will apply Autoprefixer to all compiled code.

```bash
> 2%
last 2 versions
IE 11
not dead
```

You can customize the browser targets by changing the `browserslist` setting in your gulpfile:

```js
uswds.settings.compile.browserslist = [
  '> 1%',
  'last 2 versions',
  'not IE 11',
  'not dead'
];
```

## Development

### Running Tests

This package includes a test suite to ensure everything is working correctly. To run the tests:

```bash
npm test
```

To run all tests, including integration tests:

```bash
npm run test:all
```

To generate a test coverage report:

```bash
npm run test:coverage
```

### Contributing

We welcome contributions to improve this package! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please make sure your code follows our existing style and includes appropriate tests.

### Package Architecture

Understanding the package structure helps when modifying or extending functionality:

- **Settings Configuration**: The `settings` object contains all configurable parameters
- **Path Management**: The `paths` object defines source and destination locations
- **Utility Functions**: Helper functions for path cleaning and error handling
- **Task Generation**: The `createCopyTask` function dynamically creates file copying tasks
- **Sass Compilation**: Uses gulp-sass with PostCSS for processing
- **SVG Sprite Generation**: Uses gulp-svgstore for creating SVG sprites
- **Exported Tasks**: Functions exposed for use in project gulpfiles

## Troubleshooting

### Common Issues

#### Paths not configured correctly

If you're seeing errors about files not being found, double-check your path settings in your gulpfile.js. Remember that paths are dependent on the USWDS version you're using.

```js
// Check if you're using the correct version setting
console.log(`USWDS version setting: ${uswds.settings.version}`);

// Check actual source paths being used
console.log(`USWDS source: ${uswds.paths.src.uswds || uswds.paths.src.defaults[`v${uswds.settings.version}`].uswds}`);
console.log(`USWDS sass: ${uswds.paths.src.sass || uswds.paths.src.defaults[`v${uswds.settings.version}`].sass}`);
```

#### Sass compilation errors

If you're experiencing Sass compilation errors:

- Ensure you have the correct version of Node.js installed
- Check that your Sass files are valid and don't contain syntax errors
- Verify that the `settings.version` value matches your installed version of USWDS
- Enable source maps for easier debugging by setting `uswds.settings.compile.sassSourcemaps = true`
- Examine the error messages carefully as they usually point to specific line numbers with issues

#### Icon sprite issues

If icons aren't appearing in your sprite:
- Check that the icon SVG files are in the correct location
- Verify your `paths.src.projectIcons` setting if using custom icons
- Run `compileIcons` again to regenerate the sprite
- Inspect the generated sprite file to confirm your icons are included
- Use browser developer tools to check if the sprite is being loaded correctly

#### Performance issues

If your USWDS compilation is slow:

- Use the `compileIcons` and `compileSass` tasks separately when appropriate, rather than running the full `compile` task
- Only compile the components you need by customizing your Sass imports
- Consider using Sass partials to organize your code more efficiently
- Set `uswds.settings.compile.sassSourcemaps = false` in production for faster builds

#### Version migration issues

When upgrading from USWDS 2.x to 3.x:

- Update the value of `settings.version` to `3`
- Install the `@uswds/uswds` package instead of `uswds`
- Update import paths in your Sass files (use `@use` instead of `@import` for USWDS 3.x)
- Run `updateUswds` to copy the latest assets and recompile

### Getting Help

If you're still experiencing issues:

1. Check the [existing issues](https://github.com/uswds/uswds-compile/issues) to see if your problem has been reported
2. If not, open a new issue with details about:
   - What you're trying to do
   - What's happening instead
   - Your environment (Node version, npm version, etc.)
   - Any error messages you're seeing
   - Your gulpfile.js configuration

## Related Resources

- [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)
- [USWDS Documentation](https://designsystem.digital.gov/documentation/)
- [USWDS GitHub Repository](https://github.com/uswds/uswds)
- [USWDS 3.0 Migration Guide](https://designsystem.digital.gov/documentation/migration/)
- [USWDS Tutorials](https://designsystem.digital.gov/documentation/tutorials/)
- [Gulp Documentation](https://gulpjs.com/docs/en/getting-started/quick-start)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/uswds/uswds-compile/releases).

## License

This project is licensed under the terms found in [LICENSE.md](LICENSE.md).

---

Built by the [U.S. Web Design System team](https://github.com/uswds)