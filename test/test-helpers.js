'use strict';

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

/**
 * Create temporary test directories
 * @param {string} basePath - The base path for temp directories
 * @returns {Object} - Object with setup and cleanup functions
 */
function createTestDirs(basePath = './test/tmp') {
  // Define test directories
  const testDirs = {
    base: basePath,
    theme: path.join(basePath, 'sass'),
    css: path.join(basePath, 'assets/uswds/css'),
    img: path.join(basePath, 'assets/uswds/img'),
    fonts: path.join(basePath, 'assets/uswds/fonts'),
    js: path.join(basePath, 'assets/uswds/js'),
    projectSass: path.join(basePath, 'custom-sass'),
    projectIcons: path.join(basePath, 'custom-icons')
  };

  /**
   * Setup test directories
   */
  function setup() {
    // Create each directory
    Object.values(testDirs).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    return testDirs;
  }

  /**
   * Clean up test directories
   */
  function cleanup() {
    if (fs.existsSync(testDirs.base)) {
      fs.rmSync(testDirs.base, { recursive: true, force: true });
    }
  }

  return {
    setup,
    cleanup,
    dirs: testDirs
  };
}

/**
 * Verify that a file exists and contains specific content
 * @param {string} filePath - Path to the file
 * @param {string|RegExp} content - Content to check for
 */
function checkFileContent(filePath, content) {
  expect(fs.existsSync(filePath), `File ${filePath} should exist`).to.be.true;
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  if (content instanceof RegExp) {
    expect(fileContent).to.match(content);
  } else {
    expect(fileContent).to.include(content);
  }
}

module.exports = {
  createTestDirs,
  checkFileContent
};