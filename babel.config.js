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
            '.json',
          ],
          alias: {
            '~core': './src/core/Core',
            '~routes': './src/routes',
            '~screens': './src/screens',
            '~assets': './assets',
            '~i18n': './src/i18n',
            '~styles': './src/styles',
            '~models': './src/models',
            '~components': './src/components',
            '~firebase': './src/Firebase',
            '~constants': './src/constants'
          },
        },
        "@babel/plugin-transform-typescript"
      ],
    ]
  };
};
