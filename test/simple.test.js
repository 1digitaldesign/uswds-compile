'use strict';

const { expect } = require('chai');
const gulpfile = require('../gulpfile');

describe('USWDS Compile', () => {
  // Test exported properties
  describe('Settings and Paths', () => {
    it('should export settings', () => {
      expect(gulpfile.settings).to.exist;
      expect(gulpfile.settings.version).to.be.a('number');
      expect(gulpfile.settings.compile).to.exist;
    });
    
    it('should export paths', () => {
      expect(gulpfile.paths).to.exist;
      expect(gulpfile.paths.src).to.exist;
      expect(gulpfile.paths.dist).to.exist;
    });
    
    it('should export sprite settings', () => {
      expect(gulpfile.sprite).to.exist;
      expect(gulpfile.sprite.width).to.be.a('number');
      expect(gulpfile.sprite.height).to.be.a('number');
      expect(gulpfile.sprite.separator).to.be.a('string');
      expect(gulpfile.sprite.projectIconsOnly).to.be.a('boolean');
    });
  });
  
  // Test exported functions
  describe('Task Functions', () => {
    it('should export copy functions', () => {
      expect(gulpfile.copyTheme).to.be.a('function');
      expect(gulpfile.copyFonts).to.be.a('function');
      expect(gulpfile.copyImages).to.be.a('function');
      expect(gulpfile.copyJS).to.be.a('function');
      expect(gulpfile.copyAssets).to.be.a('function');
      expect(gulpfile.copyAll).to.be.a('function');
    });
    
    it('should export compilation functions', () => {
      expect(gulpfile.compileSass).to.be.a('function');
      expect(gulpfile.compileIcons).to.be.a('function');
      expect(gulpfile.compile).to.be.a('function');
    });
    
    it('should export workflow functions', () => {
      expect(gulpfile.init).to.be.a('function');
      expect(gulpfile.watch).to.be.a('function');
      expect(gulpfile.updateUswds).to.be.a('function');
      expect(gulpfile.default).to.be.a('function');
      expect(gulpfile.cleanAll).to.be.a('function');
    });
  });
  
  // Test internal functions
  describe('Internal Functions', () => {
    it('should expose internal functions for testing', () => {
      expect(gulpfile._test).to.exist;
      expect(gulpfile._test.cleanPath).to.be.a('function');
      expect(gulpfile._test.getSrcFrom).to.be.a('function');
      expect(gulpfile._test.logVersion).to.be.a('function');
    });
    
    it('should clean paths properly', () => {
      const result = gulpfile._test.cleanPath('./path//with/slashes');
      expect(result).to.be.a('string');
    });
    
    it('should get source paths', () => {
      const result = gulpfile._test.getSrcFrom('uswds');
      expect(result).to.be.a('string');
    });
  });
});