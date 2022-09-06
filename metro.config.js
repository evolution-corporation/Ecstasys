const {
  getDefaultConfig
} = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const {
    transformer,
    resolver
  } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", "cjs"],
  };

  return config;
})();
// const path = require("path");
// const fs = require("fs");
// const {
//   getDefaultConfig
// } = require("expo/metro-config");

// const workspaces = fs.readdirSync(path.resolve(__dirname, "../"));
// const currentWorkspace = path.basename(__dirname);

// module.exports = (async () => {
//   const expoMetroConfig = await getDefaultConfig(__dirname);
//   const {
//     resolver
//   } = expoMetroConfig;



//   return {
//     ...expoMetroConfig,
//     projectRoot: __dirname,
//     watchFolders: workspaces
//       .filter((f) => f !== currentWorkspace)
//       .map((f) => path.join(__dirname, "../", f)),
//     resolver: {
//       extraNodeModules: new Proxy({}, {
//         get: (target, name) => path.join(__dirname, `node_modules/${name}`),

//       }),
//       assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//       sourceExts: [...resolver.sourceExts, "svg", "cjs"],
//     },
//     transformer: {
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: true,
//           babelTransformerPath: require.resolve("react-native-svg-transformer")
//         },
//       }),
//     },
//   };
// })();
