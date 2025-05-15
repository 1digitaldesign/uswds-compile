'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const gulp = require('gulp');
const gulpfile = require('../../gulpfile');

describe('USWDS Compile Copy Tasks', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('Individual copy tasks', () => {
    it('should define copyTheme function', () => {
      expect(gulpfile.copyTheme).to.be.a('function');
    });
    
    it('should define copyFonts function', () => {
      expect(gulpfile.copyFonts).to.be.a('function');
    });
    
    it('should define copyImages function', () => {
      expect(gulpfile.copyImages).to.be.a('function');
    });
    
    it('should define copyJS function', () => {
      expect(gulpfile.copyJS).to.be.a('function');
    });
    
    it('should create the correct source path for copyTheme', () => {
      // Mock src function
      const srcSpy = sandbox.spy(gulp, 'src');
      const destStub = sandbox.stub(gulp, 'dest').returns({
        on: sandbox.stub().returns({})
      });
      
      // Call the copy function
      gulpfile.copyTheme();
      
      // Check that src was called with the correct path
      expect(srcSpy.calledOnce).to.be.true;
      
      const srcArgs = srcSpy.getCall(0).args[0];
      expect(srcArgs).to.include('theme');
    });
    
    it('should create the correct source path for copyFonts', () => {
      // Mock src function
      const srcSpy = sandbox.spy(gulp, 'src');
      const destStub = sandbox.stub(gulp, 'dest').returns({
        on: sandbox.stub().returns({})
      });
      
      // Call the copy function
      gulpfile.copyFonts();
      
      // Check that src was called with the correct path
      expect(srcSpy.calledOnce).to.be.true;
      
      const srcArgs = srcSpy.getCall(0).args[0];
      expect(srcArgs).to.include('fonts');
    });
    
    it('should create the correct source path for copyImages', () => {
      // Mock src function
      const srcSpy = sandbox.spy(gulp, 'src');
      const destStub = sandbox.stub(gulp, 'dest').returns({
        on: sandbox.stub().returns({})
      });
      
      // Call the copy function
      gulpfile.copyImages();
      
      // Check that src was called with the correct path
      expect(srcSpy.calledOnce).to.be.true;
      
      const srcArgs = srcSpy.getCall(0).args[0];
      expect(srcArgs).to.include('img');
    });
    
    it('should create the correct source path for copyJS', () => {
      // Mock src function
      const srcSpy = sandbox.spy(gulp, 'src');
      const destStub = sandbox.stub(gulp, 'dest').returns({
        on: sandbox.stub().returns({})
      });
      
      // Call the copy function
      gulpfile.copyJS();
      
      // Check that src was called with the correct path
      expect(srcSpy.calledOnce).to.be.true;
      
      const srcArgs = srcSpy.getCall(0).args[0];
      expect(srcArgs).to.include('js');
    });
    
    it('should handle errors properly in copy tasks', () => {
      // Create a mock error
      const mockError = new Error('Test error');
      
      // Mock the stream
      const mockStream = {
        emit: sandbox.spy()
      };
      
      // Call the error handler directly
      gulpfile._test.handleError.call(mockStream, mockError);
      
      // Verify that emit was called with 'end'
      expect(mockStream.emit.calledOnceWith('end')).to.be.true;
    });
  });
  
  describe('Composite copy tasks', () => {
    it('should define copyAssets function that combines individual asset copy tasks', () => {
      expect(gulpfile.copyAssets).to.be.a('function');
    });
    
    it('should define copyAll function that combines copyTheme and copyAssets', () => {
      expect(gulpfile.copyAll).to.be.a('function');
    });
  });

  describe('createCopyTask function behavior', () => {
    it('should log the source and destination paths', () => {
      // Spy on console.log
      const consoleLogSpy = sandbox.spy(console, 'log');
      
      // Mock gulp.src and gulp.dest
      sandbox.stub(gulp, 'src').returns({
        pipe: sandbox.stub().returns({
          on: sandbox.stub().returns({})
        })
      });
      
      // Call one of the copy functions
      gulpfile.copyTheme();
      
      // Verify console.log was called with source and destination info
      expect(consoleLogSpy.calledOnce).to.be.true;
      expect(consoleLogSpy.getCall(0).args[1]).to.include('Copy USWDS');
    });
  });
});