const fs = require('fs');

// Ultimate EMFILE workaround for Windows Node 22 + Expo
const originalReadFile = fs.promises.readFile;
fs.promises.readFile = async function (...args) {
  let retries = 0;
  while (true) {
    try {
      return await originalReadFile.apply(this, args);
    } catch (e) {
      if (e.code === 'EMFILE' && retries < 100) {
        retries++;
        await new Promise(r => setTimeout(r, 10 * retries));
        continue;
      }
      throw e;
    }
  }
};

const originalOpen = fs.promises.open;
fs.promises.open = async function (...args) {
  let retries = 0;
  while (true) {
    try {
      return await originalOpen.apply(this, args);
    } catch (e) {
      if (e.code === 'EMFILE' && retries < 100) {
        retries++;
        await new Promise(r => setTimeout(r, 10 * retries));
        continue;
      }
      throw e;
    }
  }
};

const originalWriteFile = fs.promises.writeFile;
fs.promises.writeFile = async function (...args) {
  let retries = 0;
  while (true) {
    try {
      return await originalWriteFile.apply(this, args);
    } catch (e) {
      if (e.code === 'EMFILE' && retries < 100) {
        retries++;
        await new Promise(r => setTimeout(r, 10 * retries));
        continue;
      }
      throw e;
    }
  }
};

const { getDefaultConfig } = require('expo/metro-config');
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Package Exports for Web3 packages like viem and thirdweb
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];
config.resolver.sourceExts.push('mjs', 'cjs');

// Limit workers to fix EMFILE issue on Windows
config.maxWorkers = 1;

module.exports = config;
