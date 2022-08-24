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
            '~core': './src/core',
            '~routes': './src/routes',
            '~screens': './src/screens',
            '~assets': './assets',
            '~api': './src/api',
            '~components': './src/components',
            '~firebase': './src/Firebase',
            '~constants': './src/constants',
            '~store': './src/store',
            '~containers': './src/containers',
            '~hooks': './src/hooks',
            '~contexts': './src/contexts',
            '~HOC': './src/HOC',
            '~modules': './src/modules'
          },
        },
        "@babel/plugin-transform-typescript",
        
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
