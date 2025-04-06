const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ExtReloader = require('webpack-ext-reloader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts',
    content: './src/content.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' }
      ]
    }),
    new ExtReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: 'content',
        background: 'background'
      }
    })
  ],
  devtool: 'cheap-source-map',
  watch: true
};
