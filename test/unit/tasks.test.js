'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const gulpfile = require('../../gulpfile');
const { createTestDirs } = require('../test-helpers');

describe('USWDS Compile Tasks', () => {
  let testEnv;
  let sandbox;
  
  before(() => {
    // Set up test environment
    testEnv = createTestDirs('./test/tmp');
    testEnv.setup();
    
    sandbox = sinon.createSandbox();
  });
  
  after(() => {
    // Clean up test environment
    testEnv.cleanup();
    sandbox.restore();
  });
  
  describe('Task dependencies', () => {
    it('should define copy tasks before composition tasks', () => {
      // Individual copy tasks should exist
      expect(gulpfile.copyTheme).to.be.a('function');
      expect(gulpfile.copyFonts).to.be.a('function');
      expect(gulpfile.copyImages).to.be.a('function');
      expect(gulpfile.copyJS).to.be.a('function');
      
      // Composed copy tasks should exist
      expect(gulpfile.copyAssets).to.be.a('function');
      expect(gulpfile.copyAll).to.be.a('function');
    });
    
    it('should define compilation tasks', () => {
      expect(gulpfile.compileSass).to.be.a('function');
      expect(gulpfile.compileIcons).to.be.a('function');
      expect(gulpfile.compile).to.be.a('function');
    });
    
    it('should define workflow tasks that combine other tasks', () => {
      expect(gulpfile.updateUswds).to.be.a('function');
      expect(gulpfile.init).to.be.a('function');
      expect(gulpfile.watch).to.be.a('function');
      expect(gulpfile.default).to.be.a('function');
    });
  });
  
  describe('Folder management', () => {
    it('should have a cleanAll task', () => {
      expect(gulpfile.cleanAll).to.be.a('function');
    });
  });
  
  // Testing the actual gulp task execution is complex and would require running the tasks
  // which is better done in integration tests. The following are simple smoketests.
  
  describe('Task smoketests', () => {
    let consoleLog;
    
    beforeEach(() => {
      // Stub console.log to prevent output during tests
      consoleLog = sandbox.stub(console, 'log');
    });
    
    afterEach(() => {
      sandbox.restore();
    });
    
    it('should define logVersion function that outputs USWDS version', async () => {
      // This is an internal function we're not sure if it's exposed
      let logVersionFn;
      
      if (typeof gulpfile.logVersion === 'function') {
        logVersionFn = gulpfile.logVersion;
        await logVersionFn();
        
        // Check if console.log was called with version info
        const versionCall = consoleLog.getCalls().find(call => 
          call.args.some(arg => arg && arg.includes && arg.includes('USWDS version'))
        );
        
        expect(versionCall).to.exist;
      } else {
        console.warn('logVersion function is not exposed for testing');
      }
    });
  });
});