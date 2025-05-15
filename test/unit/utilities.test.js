'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const gulpfile = require('../../gulpfile');
const { createTestDirs } = require('../test-helpers');

describe('USWDS Compile Utilities', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('cleanPath function', () => {
    it('should replace double slashes with single slashes', () => {
      const input = './node_modules//uswds/dist//img';
      const expected = './node_modules/uswds/dist/img';
      
      expect(gulpfile._test.cleanPath(input)).to.equal(expected);
    });

    it('should not modify paths without double slashes', () => {
      const input = './node_modules/uswds/dist/img';
      expect(gulpfile._test.cleanPath(input)).to.equal(input);
    });
    
    it('should handle multiple consecutive slashes', () => {
      const input = './node_modules///uswds////dist/img';
      const expected = './node_modules/uswds/dist/img';
      
      expect(gulpfile._test.cleanPath(input)).to.equal(expected);
    });
  });

  describe('getSrcFrom function', () => {
    it('should return the source path for a given key', () => {
      const result = gulpfile._test.getSrcFrom('uswds');
      expect(result).to.exist;
      expect(result).to.be.a('string');
    });

    it('should return different paths based on version setting', () => {
      // Get path with version 3
      const originalVersion = gulpfile.settings.version;
      gulpfile.settings.version = 3;
      const v3Path = gulpfile._test.getSrcFrom('uswds');
      
      // Get path with version 2
      gulpfile.settings.version = 2;
      const v2Path = gulpfile._test.getSrcFrom('uswds');
      
      // Reset version
      gulpfile.settings.version = originalVersion;
      
      // Paths should be different between v2 and v3
      expect(v3Path).to.not.equal(v2Path);
    });
    
    it('should return user-defined path if set', () => {
      const originalPath = gulpfile.paths.src.uswds;
      
      // Set a custom path
      gulpfile.paths.src.uswds = './custom/path';
      
      // Test that it returns the custom path
      expect(gulpfile._test.getSrcFrom('uswds')).to.equal('./custom/path');
      
      // Reset the path
      gulpfile.paths.src.uswds = originalPath;
    });
  });
  
  describe('handleError function', () => {
    it('should log error messages and emit end event', () => {
      // Create a spy for console.log
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      // Create a mock stream with emit method
      const mockStream = {
        emit: sandbox.spy()
      };
      
      // Create a mock error
      const mockError = new Error('Test error');
      mockError.stack = 'Test stack trace';
      
      // Call handleError bound to mockStream
      gulpfile._test.handleError.call(mockStream, mockError);
      
      // Verify console.log was called with error message
      expect(consoleLogSpy.calledTwice).to.be.true;
      
      // Verify emit was called with 'end'
      expect(mockStream.emit.calledOnceWith('end')).to.be.true;
    });
  });
  
  describe('logVersion function', () => {
    it('should log the current USWDS version', async () => {
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      await gulpfile._test.logVersion();
      
      // Verify that console.log was called with version info
      expect(consoleLogSpy.calledOnce).to.be.true;
      
      const versionCall = consoleLogSpy.getCall(0);
      expect(versionCall.args[1]).to.include('USWDS version');
    });
  });
  
  describe('getUswdsVersion function', () => {
    it('should handle errors gracefully', async () => {
      // Mock require.resolve to throw an error
      sandbox.stub(require, 'resolve').throws(new Error('Package not found'));
      
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      const result = await gulpfile._test.getUswdsVersion();
      
      // Should return 'unknown' on error
      expect(result).to.equal('unknown');
      
      // Should log the error
      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy.getCall(0).args[1]).to.include('Error getting USWDS version');
    });
  });
  
  describe('Directory Management Functions', () => {
    let testEnv;
    
    before(() => {
      testEnv = createTestDirs('./test/tmp-utilities');
      testEnv.setup();
    });
    
    after(() => {
      testEnv.cleanup();
    });
    
    describe('makeDestFolders function', () => {
      it('should create destination folders if they do not exist', (done) => {
        // Store original paths
        const originalPaths = { ...gulpfile.paths.dist };
        
        // Set paths to test directories
        Object.keys(gulpfile.paths.dist).forEach(key => {
          gulpfile.paths.dist[key] = path.join('./test/tmp-utilities', key);
        });
        
        // Delete the directories if they exist
        Object.values(gulpfile.paths.dist).forEach(dir => {
          if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
          }
        });
        
        // Spy on console.log
        const consoleLogSpy = sandbox.spy(console, 'log');
        
        // Call makeDestFolders
        gulpfile._test.makeDestFolders((err) => {
          // Check that all directories were created
          Object.values(gulpfile.paths.dist).forEach(dir => {
            expect(fs.existsSync(dir)).to.be.true;
          });
          
          // Check that console.log was called for each directory
          expect(consoleLogSpy.callCount).to.equal(Object.keys(gulpfile.paths.dist).length);
          
          // Reset paths
          Object.assign(gulpfile.paths.dist, originalPaths);
          
          done(err);
        });
      });
      
      it('should handle errors gracefully', (done) => {
        // Stub fs.mkdirSync to throw an error
        sandbox.stub(fs, 'mkdirSync').throws(new Error('mkdir error'));
        
        // Spy on console.log
        const consoleLogSpy = sandbox.spy(console, 'log');
        
        // Call makeDestFolders with a callback
        gulpfile._test.makeDestFolders((err) => {
          // Error should be passed to callback
          expect(err).to.exist;
          expect(err.message).to.equal('mkdir error');
          
          // Should log the error
          expect(consoleLogSpy.calledOnce).to.be.true;
          expect(consoleLogSpy.getCall(0).args[1]).to.include('Error creating directories');
          
          done();
        });
      });
    });
    
    describe('cleanAll function', () => {
      it('should delete all files in destination folders', (done) => {
        // Store original paths
        const originalPaths = { ...gulpfile.paths.dist };
        
        // Set paths to test directories
        Object.keys(gulpfile.paths.dist).forEach(key => {
          gulpfile.paths.dist[key] = path.join('./test/tmp-utilities', key);
          
          // Create the directory if it doesn't exist
          if (!fs.existsSync(gulpfile.paths.dist[key])) {
            fs.mkdirSync(gulpfile.paths.dist[key], { recursive: true });
          }
          
          // Create a test file in the directory
          fs.writeFileSync(path.join(gulpfile.paths.dist[key], 'test-file.txt'), 'test content');
        });
        
        // Spy on console.log
        const consoleLogSpy = sandbox.spy(console, 'log');
        
        // Call cleanAll
        gulpfile._test.cleanAll((err) => {
          // Check that all files were deleted
          Object.values(gulpfile.paths.dist).forEach(dir => {
            // Directory should still exist
            expect(fs.existsSync(dir)).to.be.true;
            
            // But no files in it
            expect(fs.readdirSync(dir)).to.have.lengthOf(0);
          });
          
          // Reset paths
          Object.assign(gulpfile.paths.dist, originalPaths);
          
          done(err);
        });
      });
      
      it('should handle errors gracefully', (done) => {
        // Stub fs.readdirSync to throw an error
        sandbox.stub(fs, 'readdirSync').throws(new Error('readdir error'));
        
        // Spy on console.log
        const consoleLogSpy = sandbox.spy(console, 'log');
        
        // Call cleanAll with a callback
        gulpfile._test.cleanAll((err) => {
          // Error should be passed to callback
          expect(err).to.exist;
          expect(err.message).to.equal('readdir error');
          
          // Should log the error
          expect(consoleLogSpy.calledOnce).to.be.true;
          expect(consoleLogSpy.getCall(0).args[1]).to.include('Error cleaning folder contents');
          
          done();
        });
      });
    });
    
    describe('getSpritePaths function', () => {
      it('should return the default sprite path when no custom path is defined', () => {
        // Save original values
        const originalProjectIcons = gulpfile.paths.src.projectIcons;
        const originalProjectIconsOnly = gulpfile.sprite.projectIconsOnly;
        
        // Set values for test
        gulpfile.paths.src.projectIcons = '';
        gulpfile.sprite.projectIconsOnly = false;
        
        const paths = gulpfile._test.getSpritePaths();
        
        // Should include the default path
        expect(paths).to.have.lengthOf(1);
        expect(paths[0]).to.include('usa-icons');
        
        // Restore original values
        gulpfile.paths.src.projectIcons = originalProjectIcons;
        gulpfile.sprite.projectIconsOnly = originalProjectIconsOnly;
      });
      
      it('should include custom path when defined', () => {
        // Save original values
        const originalProjectIcons = gulpfile.paths.src.projectIcons;
        const originalProjectIconsOnly = gulpfile.sprite.projectIconsOnly;
        
        // Set values for test
        gulpfile.paths.src.projectIcons = './custom/icons';
        gulpfile.sprite.projectIconsOnly = false;
        
        const paths = gulpfile._test.getSpritePaths();
        
        // Should include custom path and default path
        expect(paths).to.have.lengthOf(2);
        expect(paths[0]).to.equal('./custom/icons/**/*.svg');
        expect(paths[1]).to.include('usa-icons');
        
        // Restore original values
        gulpfile.paths.src.projectIcons = originalProjectIcons;
        gulpfile.sprite.projectIconsOnly = originalProjectIconsOnly;
      });
      
      it('should only include custom path when projectIconsOnly is true', () => {
        // Save original values
        const originalProjectIcons = gulpfile.paths.src.projectIcons;
        const originalProjectIconsOnly = gulpfile.sprite.projectIconsOnly;
        
        // Set values for test
        gulpfile.paths.src.projectIcons = './custom/icons';
        gulpfile.sprite.projectIconsOnly = true;
        
        const paths = gulpfile._test.getSpritePaths();
        
        // Should only include custom path
        expect(paths).to.have.lengthOf(1);
        expect(paths[0]).to.equal('./custom/icons/**/*.svg');
        
        // Restore original values
        gulpfile.paths.src.projectIcons = originalProjectIcons;
        gulpfile.sprite.projectIconsOnly = originalProjectIconsOnly;
      });
      
      it('should log warning when projectIconsOnly is true but no custom path defined', () => {
        // Save original values
        const originalProjectIcons = gulpfile.paths.src.projectIcons;
        const originalProjectIconsOnly = gulpfile.sprite.projectIconsOnly;
        
        // Set values for test
        gulpfile.paths.src.projectIcons = '';
        gulpfile.sprite.projectIconsOnly = true;
        
        // Spy on console.log
        const consoleLogSpy = sandbox.spy(console, 'log');
        
        const paths = gulpfile._test.getSpritePaths();
        
        // Should include default path
        expect(paths).to.have.lengthOf(1);
        expect(paths[0]).to.include('usa-icons');
        
        // Should log warning
        expect(consoleLogSpy.calledOnce).to.be.true;
        expect(consoleLogSpy.getCall(0).args[1]).to.include('sprite.projectIconsOnly');
        
        // Restore original values
        gulpfile.paths.src.projectIcons = originalProjectIcons;
        gulpfile.sprite.projectIconsOnly = originalProjectIconsOnly;
      });
    });
  });
  
  // Export function tests
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
    
    it('should export all copy task functions', () => {
      expect(gulpfile.copyTheme).to.be.a('function');
      expect(gulpfile.copyFonts).to.be.a('function');
      expect(gulpfile.copyImages).to.be.a('function');
      expect(gulpfile.copyJS).to.be.a('function');
      expect(gulpfile.copyAssets).to.be.a('function');
      expect(gulpfile.copyAll).to.be.a('function');
    });
    
    it('should export all compilation functions', () => {
      expect(gulpfile.compileSass).to.be.a('function');
      expect(gulpfile.compileIcons).to.be.a('function');
      expect(gulpfile.compile).to.be.a('function');
    });
  });
});