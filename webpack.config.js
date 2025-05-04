import path from "path";
import {fileURLToPath} from "url";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

// Получаем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

// eslint-disable-next-line
const filename = (extension) => isDev ? `bundle.${extension}` : `bundle.[hash].${extension}`;

export default {
  context: path.resolve(__dirname, "src"),
  mode: isDev ? "development" : "production",
  entry: {
    index: "./index.js",
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".mjs", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core"),
    },
    fullySpecified: false, // Добавлено для решения проблемы с импортами
  },
  devServer: {
    port: 3000,
    hot: isDev,
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  devtool: isDev ? "source-map" : false,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
      inject: "body",
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist"),
      }],
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    new ESLintPlugin({
      extensions: ["js"],
      exclude: "node_modules",
      fix: isDev,
      emitWarning: true,
      failOnError: isProd,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
