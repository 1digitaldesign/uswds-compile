'use strict';

const { expect } = require('chai');
const gulpfile = require('../../gulpfile');

describe('USWDS Compile Settings', () => {
  describe('Version settings', () => {
    it('should have a default version setting', () => {
      expect(gulpfile.settings.version).to.exist;
      expect(gulpfile.settings.version).to.be.a('number');
      expect(gulpfile.settings.version).to.equal(3);
    });

    it('should allow version to be modified', () => {
      const originalVersion = gulpfile.settings.version;
      
      // Change the version
      gulpfile.settings.version = 2;
      expect(gulpfile.settings.version).to.equal(2);
      
      // Reset to original for other tests
      gulpfile.settings.version = originalVersion;
    });
  });

  describe('Path settings', () => {
    it('should have default paths configuration', () => {
      expect(gulpfile.paths).to.exist;
      expect(gulpfile.paths.src).to.exist;
      expect(gulpfile.paths.dist).to.exist;
    });

    it('should have source paths with defaults', () => {
      const paths = gulpfile.paths;
      
      // Check source paths
      expect(paths.src.defaults).to.exist;
      expect(paths.src.defaults.v2).to.exist;
      expect(paths.src.defaults.v3).to.exist;
      
      // Check that v2 and v3 have different paths
      expect(paths.src.defaults.v2.uswds).to.not.equal(paths.src.defaults.v3.uswds);
    });

    it('should have distribution paths', () => {
      const paths = gulpfile.paths;
      
      // Check distribution paths
      expect(paths.dist.theme).to.exist;
      expect(paths.dist.css).to.exist;
      expect(paths.dist.img).to.exist;
      expect(paths.dist.fonts).to.exist;
      expect(paths.dist.js).to.exist;
    });

    it('should allow paths to be modified', () => {
      const paths = gulpfile.paths;
      const originalPath = paths.dist.css;
      
      // Modify a path
      paths.dist.css = './custom/css/path';
      expect(paths.dist.css).to.equal('./custom/css/path');
      
      // Reset for other tests
      paths.dist.css = originalPath;
    });
  });

  describe('Compile settings', () => {
    it('should have browserslist configuration', () => {
      expect(gulpfile.settings.compile.browserslist).to.exist;
      expect(gulpfile.settings.compile.browserslist).to.be.an('array');
      expect(gulpfile.settings.compile.browserslist).to.include('> 2%');
    });

    it('should have sass compilation settings', () => {
      expect(gulpfile.settings.compile.sassSourcemaps).to.exist;
      expect(gulpfile.settings.compile.sassDeprecationWarnings).to.exist;
      expect(gulpfile.settings.compile.sassSourcemaps).to.be.a('boolean');
    });
  });

  describe('Sprite settings', () => {
    it('should have sprite configuration', () => {
      expect(gulpfile.sprite).to.exist;
      expect(gulpfile.sprite.width).to.exist;
      expect(gulpfile.sprite.height).to.exist;
      expect(gulpfile.sprite.separator).to.exist;
      expect(gulpfile.sprite.projectIconsOnly).to.be.a('boolean');
    });
  });
});