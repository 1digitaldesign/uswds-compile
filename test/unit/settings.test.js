'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const gulpfile = require('../../gulpfile');

describe('USWDS Compile Settings', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
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
  
  describe('Internal utility functions', () => {
    it('should clean paths with double slashes', () => {
      expect(gulpfile._test.cleanPath('./path//with//double//slashes')).to.equal('./path/with/double/slashes');
    });
    
    it('should get source paths based on settings', () => {
      const originalVersion = gulpfile.settings.version;
      try {
        // Test with version 3
        gulpfile.settings.version = 3;
        const v3Path = gulpfile._test.getSrcFrom('uswds');
        expect(v3Path).to.include('@uswds');
        
        // Test with version 2
        gulpfile.settings.version = 2;
        const v2Path = gulpfile._test.getSrcFrom('uswds');
        expect(v2Path).to.include('uswds/dist');
        
        // Test with custom path
        const originalPath = gulpfile.paths.src.uswds;
        gulpfile.paths.src.uswds = './custom/path';
        expect(gulpfile._test.getSrcFrom('uswds')).to.equal('./custom/path');
        gulpfile.paths.src.uswds = originalPath;
      } finally {
        // Reset version
        gulpfile.settings.version = originalVersion;
      }
    });
    
    it('should handle errors properly', () => {
      const consoleLogSpy = sandbox.spy(console, 'log');
      const mockStream = { emit: sandbox.spy() };
      const mockError = new Error('Test error');
      mockError.stack = 'Test stack trace';
      
      gulpfile._test.handleError.call(mockStream, mockError);
      
      expect(consoleLogSpy.calledTwice).to.be.true;
      expect(mockStream.emit.calledOnceWith('end')).to.be.true;
    });
  });
});