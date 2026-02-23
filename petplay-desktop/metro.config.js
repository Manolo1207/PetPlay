// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// workaround for: https://github.com/expo/expo/issues/22603
config.resolver.extraNodeModules = require('node-libs-browser');

module.exports = config;

