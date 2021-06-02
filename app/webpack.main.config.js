/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  externals: {
    native: path.resolve(__dirname, '..', 'native', 'index.node'),
  },
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: ['data'].map((asset) => {
    return new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', asset),
          to: path.resolve(__dirname, '.webpack', asset),
        },
      ],
    });
  }),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
