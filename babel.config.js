module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript', ['@babel/preset-env', {targets: {node: 'current'}}]],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json'
          ],
          alias: {
            '~core': './src/core',
            '~routes': './src/routes',
            '~assets': './assets',
            '~api': './src/api',
            '~components': './src/components',
            '~store': './src/store',
            '~modules': './src/modules',
            '~tools': './src/tools',
            '~types': './src/types',
            '~hooks': './src/hooks'
          },
        },
        "@babel/plugin-transform-typescript",
        
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
