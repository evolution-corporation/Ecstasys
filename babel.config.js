module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
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
            '~core': './src/core/Core',
            '~routes': './src/routes',
            '~screens': './src/screens',
            '~assets': './assets',
            '~i18n': './src/i18n',
            '~styles': './src/styles',
            '~api': './src/api',
            '~components': './src/components',
            '~firebase': './src/Firebase',
            '~constants': './src/constants',
            '~store': './src/store',
            '~containers': './src/containers'

          },
        },
        "@babel/plugin-transform-typescript",
        
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
