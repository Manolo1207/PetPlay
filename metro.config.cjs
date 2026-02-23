const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Agregar soporte para alias de imports
config.resolver.extraNodeModules = {
    '@components': path.resolve(__dirname, 'src/components'),
    '@screens': path.resolve(__dirname, 'src/screens'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@types': path.resolve(__dirname, 'src/types'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@navigation': path.resolve(__dirname, 'src/navigation'),
    '@': path.resolve(__dirname, './'),
};

module.exports = config;