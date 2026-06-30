const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Package Exports for Web3 packages like viem and thirdweb
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];
config.resolver.sourceExts.push('mjs', 'cjs');

// Limit workers to fix EMFILE issue on Windows
config.maxWorkers = 2;

module.exports = config;
