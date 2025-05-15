'use strict';

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { createTestDirs, checkFileContent } = require('./test-helpers');

// Skip integration tests by default - they require more setup and are slower
describe.skip('USWDS Compile Integration Tests', function() {
  // Increase timeout for integration tests
  this.timeout(10000);
  
  let testEnv;
  let gulpfile;
  let originalPaths;
  let sandbox;
  
  before(() => {
    // Create test directories
    testEnv = createTestDirs('./test/tmp');
    const dirs = testEnv.setup();
    
    // Create a mock SCSS file for testing
    const scssContent = `
      // Mock SCSS file for testing
      @use "uswds-core" with (
        $theme-show-notifications: false,
        $theme-font-path: "../fonts",
        $theme-image-path: "../img"
      );
      
      .test-component {
        color: red;
        padding: 1rem;
      }
    `;
    
    fs.writeFileSync(path.join(dirs.theme, 'styles.scss'), scssContent);
    
    // Create a mock SVG icon for testing
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    `;
    
    // Create the usa-icons directory
    fs.mkdirSync(path.join(dirs.img, 'usa-icons'), { recursive: true });
    fs.writeFileSync(path.join(dirs.img, 'usa-icons', 'test-icon.svg'), svgContent);
    
    // Load gulpfile module
    gulpfile = require('../gulpfile');
    
    // Store original paths
    originalPaths = {
      dist: { ...gulpfile.paths.dist }
    };
    
    // Override paths for testing
    gulpfile.paths.dist.theme = dirs.theme;
    gulpfile.paths.dist.css = dirs.css;
    gulpfile.paths.dist.img = dirs.img;
    gulpfile.paths.dist.fonts = dirs.fonts;
    gulpfile.paths.dist.js = dirs.js;
    
    sandbox = sinon.createSandbox();
  });
  
  after(() => {
    // Clean up
    testEnv.cleanup();
    
    // Restore original paths
    Object.assign(gulpfile.paths.dist, originalPaths.dist);
  });
  
  // These tests actually run the gulp tasks, which may be time-consuming
  // and depend on the file system, so they are skipped by default
  
  describe('Running compileSass', () => {
    beforeEach(() => {
      sandbox.stub(console, 'log'); // Suppress logs
    });
    
    afterEach(() => {
      sandbox.restore();
    });
    
    it('should compile SCSS files to CSS', async function() {
      // This test actually runs the compileSass task, which could take time
      const compileSass = gulpfile.compileSass;
      
      // Convert gulp task to promise
      await new Promise((resolve, reject) => {
        const stream = compileSass();
        stream.on('end', resolve);
        stream.on('error', reject);
      });
      
      // Check if CSS file was created
      const cssFile = path.join(gulpfile.paths.dist.css, 'styles.css');
      expect(fs.existsSync(cssFile)).to.be.true;
      
      // Check if CSS content makes sense
      const cssContent = fs.readFileSync(cssFile, 'utf-8');
      expect(cssContent).to.include('.test-component');
    });
  });
  
  describe('Running compileIcons', () => {
    beforeEach(() => {
      sandbox.stub(console, 'log'); // Suppress logs
    });
    
    afterEach(() => {
      sandbox.restore();
    });
    
    it('should compile SVG icons into a sprite', async function() {
      // This test actually runs the compileIcons task
      const compileIcons = gulpfile.compileIcons;
      
      // Convert gulp task to promise
      await new Promise((resolve, reject) => {
        const stream = compileIcons();
        stream.on('end', resolve);
        stream.on('error', reject);
      });
      
      // Check if sprite.svg was created
      const spriteFile = path.join(gulpfile.paths.dist.img, 'sprite.svg');
      expect(fs.existsSync(spriteFile)).to.be.true;
      
      // Check if sprite content includes our test icon
      const spriteContent = fs.readFileSync(spriteFile, 'utf-8');
      expect(spriteContent).to.include('test-icon');
    });
  });
});