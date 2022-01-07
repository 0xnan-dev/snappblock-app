const { getDefaultConfig } = require("expo/metro-config");

const {
  resolver: { extraNodeModules, sourceExts, assetExts, ...resolver },
  transformer,
  ...config
} = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  transformer: {
    ...transformer,
    // This was important for me
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...resolver,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      ...extraNodeModules,
      stream: require.resolve('readable-stream'),
      crypto: require.resolve('react-native-crypto-polyfill'),
      fs: require.resolve('expo-file-system'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      path: require.resolve('react-native-path'),
      buffer: require.resolve('buffer'),
      randombytes: require.resolve('react-native-randombytes'),
      process: require.resolve('process/browser.js'),
      string_decoder: require.resolve('string_decoder'),
      punycode: require.resolve('punycode'),
      os: require.resolve('os-browserify'),
    },
  },
};