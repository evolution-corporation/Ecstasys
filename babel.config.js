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
            '~tools': './src/tools',
            '~types': './src/types',
            '~hooks': './src/hooks',
            '~i18n': './src/i18n'
          },
        },
        "@babel/plugin-transform-typescript",
        
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
