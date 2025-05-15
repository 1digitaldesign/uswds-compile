'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const gulp = require('gulp');
const sass = require('gulp-sass');
const fs = require('fs');
const gulpfile = require('../../gulpfile');
const { createTestDirs } = require('../test-helpers');

describe('USWDS Compile Compilation Tasks', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('Sass Compilation', () => {
    it('should define compileSass function', () => {
      expect(gulpfile.compileSass).to.be.a('function');
    });
    
    it('should define buildSass internal function', () => {
      expect(gulpfile._test.buildSass).to.be.a('function');
    });
    
    it('should use the right sass compilation settings', () => {
      // Spy on gulp.src
      const srcSpy = sandbox.spy(gulp, 'src');
      
      // Create a fake pipe chain that returns itself
      const fakePipe = {
        pipe: sandbox.stub().returns({
          pipe: sandbox.stub().returns({
            pipe: sandbox.stub().returns({})
          })
        })
      };
      
      // Stub gulp.src to return our fake pipe
      srcSpy.returns(fakePipe);
      
      // Call buildSass
      gulpfile._test.buildSass();
      
      // Check that src was called with the right path
      expect(srcSpy.calledOnce).to.be.true;
      expect(srcSpy.getCall(0).args[0]).to.include('.scss');
      
      // Verify source maps setting was passed to src
      const srcOptions = srcSpy.getCall(0).args[1];
      expect(srcOptions).to.have.property('sourcemaps');
      expect(srcOptions.sourcemaps).to.equal(!!gulpfile.settings.compile.sassSourcemaps);
    });
    
    it('should define watchSass function', () => {
      expect(gulpfile._test.watchSass).to.be.a('function');
    });
    
    it('should watch the correct scss directories', () => {
      // Mock the watch function
      const watchStub = sandbox.stub(gulp, 'watch').returns({});
      
      // Call watchSass
      gulpfile._test.watchSass();
      
      // Check watch was called with scss paths
      expect(watchStub.calledOnce).to.be.true;
      
      const watchPaths = watchStub.getCall(0).args[0];
      expect(watchPaths).to.be.an('array');
      expect(watchPaths.length).to.equal(2);
      expect(watchPaths[0]).to.include('.scss');
      expect(watchPaths[1]).to.include('.scss');
    });
  });
  
  describe('Icon Compilation', () => {
    it('should define compileIcons function', () => {
      expect(gulpfile.compileIcons).to.be.a('function');
    });
    
    it('should define buildSprite internal function', () => {
      expect(gulpfile._test.buildSprite).to.be.a('function');
    });
    
    it('should get sprite paths correctly', () => {
      // Save original values
      const originalProjectIcons = gulpfile.paths.src.projectIcons;
      const originalProjectIconsOnly = gulpfile.sprite.projectIconsOnly;
      
      // Test with default settings
      gulpfile.paths.src.projectIcons = '';
      gulpfile.sprite.projectIconsOnly = false;
      
      // Spy on console.log
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      // Mock gulp.src
      const fakePipe = {
        pipe: sandbox.stub().returns({
          pipe: sandbox.stub().returns({
            on: sandbox.stub().returns({
              pipe: sandbox.stub().returns({})
            })
          })
        })
      };
      
      const srcStub = sandbox.stub(gulp, 'src').returns(fakePipe);
      
      // Call buildSprite
      gulpfile._test.buildSprite();
      
      // Check that src was called with the right path
      expect(srcStub.calledOnce).to.be.true;
      
      // Should have logged the paths
      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy.getCall(0).args[1]).to.include('Building sprite');
      
      // Restore original values
      gulpfile.paths.src.projectIcons = originalProjectIcons;
      gulpfile.sprite.projectIconsOnly = originalProjectIconsOnly;
    });
    
    it('should define renameSprite internal function', () => {
      expect(gulpfile._test.renameSprite).to.be.a('function');
    });
    
    it('should rename the sprite file', () => {
      // Mock gulp.src
      const fakePipe = {
        pipe: sandbox.stub().returns({
          pipe: sandbox.stub().returns({})
        })
      };
      
      const srcStub = sandbox.stub(gulp, 'src').returns(fakePipe);
      
      // Call renameSprite
      gulpfile._test.renameSprite();
      
      // Check that src was called with the right path
      expect(srcStub.calledOnce).to.be.true;
      expect(srcStub.getCall(0).args[0]).to.include('usa-icons.svg');
    });
    
    it('should define cleanSprite internal function', () => {
      expect(gulpfile._test.cleanSprite).to.be.a('function');
    });
    
    it('should clean up the temporary sprite file', (done) => {
      // Create a mock file path
      const filePath = './test/tmp-sprite/usa-icons.svg';
      const dirPath = './test/tmp-sprite';
      
      // Ensure the directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Create a mock file
      fs.writeFileSync(filePath, '<svg></svg>');
      
      // Mock the paths
      const originalImgPath = gulpfile.paths.dist.img;
      gulpfile.paths.dist.img = dirPath;
      
      // Spy on console.log
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      // Call cleanSprite
      gulpfile._test.cleanSprite((err) => {
        // Should not have errors
        expect(err).to.be.undefined;
        
        // File should be deleted
        expect(fs.existsSync(filePath)).to.be.false;
        
        // Should have logged the deletion
        expect(consoleLogSpy.calledOnce).to.be.true;
        expect(consoleLogSpy.getCall(0).args[1]).to.include('Deleted temporary sprite');
        
        // Restore original path
        gulpfile.paths.dist.img = originalImgPath;
        
        // Clean up test directory
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
        
        done();
      });
    });
    
    it('should handle errors when cleaning sprite file', (done) => {
      // Stub fs.existsSync to return true
      sandbox.stub(fs, 'existsSync').returns(true);
      
      // Stub fs.unlinkSync to throw an error
      sandbox.stub(fs, 'unlinkSync').throws(new Error('unlink error'));
      
      // Spy on console.log
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      // Call cleanSprite
      gulpfile._test.cleanSprite((err) => {
        // Should have error
        expect(err).to.exist;
        expect(err.message).to.equal('unlink error');
        
        // Should have logged the error
        expect(consoleLogSpy.calledOnce).to.be.true;
        expect(consoleLogSpy.getCall(0).args[1]).to.include('Error deleting file');
        
        done();
      });
    });
  });
  
  describe('Compilation Task Composition', () => {
    it('should define compile function that combines all compilation tasks', () => {
      expect(gulpfile.compile).to.be.a('function');
    });
    
    it('should define updateUswds function that combines copyAssets and compile', () => {
      expect(gulpfile.updateUswds).to.be.a('function');
    });
    
    it('should define init function that combines copyAll and compile', () => {
      expect(gulpfile.init).to.be.a('function');
    });
    
    it('should define default task as watch', () => {
      expect(gulpfile.default).to.equal(gulpfile.watch);
    });
  });
});