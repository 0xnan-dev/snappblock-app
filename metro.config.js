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
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
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
      string_decoder: require.resolve('string_decoder'),
      crypto: require.resolve('expo-standard-web-crypto'),
    },
  },
};