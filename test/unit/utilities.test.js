'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const gulpfile = require('../../gulpfile');

// These tests are for the internal utility functions
// We'll need to expose them for testing, let's check if cleanPath is exposed first
describe('USWDS Compile Utilities', () => {
  // If the internals aren't exposed, these tests will be skipped
  // This is a design decision for the package author - whether to expose these or not
  
  describe('cleanPath function', () => {
    // Try to access internal functions through module.exports
    let cleanPathFn;
    before(() => {
      // Check if cleanPath is exposed or accessible somehow
      if (typeof gulpfile.cleanPath === 'function') {
        cleanPathFn = gulpfile.cleanPath;
      } else {
        console.warn('cleanPath function is not exposed for testing');
      }
    });

    it('should replace double slashes with single slashes', function() {
      if (!cleanPathFn) this.skip();
      
      const input = './node_modules//uswds/dist//img';
      const expected = './node_modules/uswds/dist/img';
      
      expect(cleanPathFn(input)).to.equal(expected);
    });

    it('should not modify paths without double slashes', function() {
      if (!cleanPathFn) this.skip();
      
      const input = './node_modules/uswds/dist/img';
      expect(cleanPathFn(input)).to.equal(input);
    });
  });

  describe('getSrcFrom function tests', () => {
    let getSrcFromFn;
    before(() => {
      if (typeof gulpfile.getSrcFrom === 'function') {
        getSrcFromFn = gulpfile.getSrcFrom;
      } else {
        console.warn('getSrcFrom function is not exposed for testing');
      }
    });

    it('should return the source path for a given key', function() {
      if (!getSrcFromFn) this.skip();
      
      const result = getSrcFromFn('uswds');
      expect(result).to.exist;
      expect(result).to.be.a('string');
    });

    it('should return different paths based on version setting', function() {
      if (!getSrcFromFn) this.skip();
      
      // Get path with version 3
      const originalVersion = gulpfile.settings.version;
      gulpfile.settings.version = 3;
      const v3Path = getSrcFromFn('uswds');
      
      // Get path with version 2
      gulpfile.settings.version = 2;
      const v2Path = getSrcFromFn('uswds');
      
      // Reset version
      gulpfile.settings.version = originalVersion;
      
      // Paths should be different between v2 and v3
      expect(v3Path).to.not.equal(v2Path);
    });
  });

  // Even if we can't test internal functions directly, we can test exported functions
  describe('Exported functions', () => {
    it('should export compileSass function', () => {
      expect(gulpfile.compileSass).to.be.a('function');
    });

    it('should export compileIcons function', () => {
      expect(gulpfile.compileIcons).to.be.a('function');
    });

    it('should export copyAssets function', () => {
      expect(gulpfile.copyAssets).to.be.a('function');
    });

    it('should export init function', () => {
      expect(gulpfile.init).to.be.a('function');
    });

    it('should export watch function', () => {
      expect(gulpfile.watch).to.be.a('function');
    });
  });
});