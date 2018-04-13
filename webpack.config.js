/**
 * @link	  https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license	  https://www.giggrafter.com/license
 */
 
 /**
  * Webpack 4 is meant to be zero config which is fine for a vanilla JS project but since we're dealing with React and dealing with multiple loaders, we still need a config as per Webpack 4 docs.
  * We could pass flags e.g --module-bind js=babel-loader to prevent having a config file but I'm not a fan of this method as it makes NPM scripts very long!
  */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, options) => {
	console.log(`Running in ${options.mode} mode.`);
    
    return {
	    entry: [
			'./src/assets/js/scheduler.jsx',
		],
		output: {
			publicPath: '/',
			filename: 'assets/js/[name].bundle.js',
			path: path.resolve(__dirname, 'public'),
		},
		watchOptions: {
			ignored: /node_modules/,
		},
		devtool: ('production' === options.mode) ? 'source-map' : 'eval-source-map',
		devServer: {
			hot: true,
			watchContentBase: true,
			historyApiFallback: true,
			contentBase: path.join(__dirname, 'src'),
		},
	    module: {
			rules: [{
				test: /\.(js|jsx)$/,
				exclude: /node_modules|bower_components/,
				use: 'babel-loader',
			}, {
				test: /\.js$/,
				exclude: /node_modules|bower_components/,
				use: [
					'babel-loader',
					'eslint-loader',
				],
			}, {
				test: /\.(css|scss)$/,
				exclude: /node_modules|bower_components/,
				use: [
					{
						/* Basically does what it says on the tin - watches for style changes! */
						loader: 'css-hot-loader',
						options: {
							sourceMap: true,
                		},
					},
					/**
					 * Commented out as we want to extract the styles into a seperate file which the mini CSS extract plugin will do. 
					 * If you want to keep the styles within the scripts, comment this back in and comment out mini CSS extract plugin line below.
					 */
					/*
					{
						loader: 'style-loader',
						options: {
							sourceMap: true,
                		},	
					},
					*/ 
					MiniCssExtractPlugin.loader,
					{
						/* Interprets `@import` and `url()` like `import/require()` and will resolve them */
						loader: 'css-loader',
						options: {
							sourceMap: true,
                		},
					}, {
						/* Loader for webpack to process CSS with PostCSS */
						loader: 'postcss-loader',
						options: {
							autoprefixer: {
								browsers: ['last 2 versions'],
							},
							plugins: (loader) => [
								require('precss')(),
								require('autoprefixer')(),
							],
							sourceMap: true,
                		},
                	}, {
						/* Loads a SASS/SCSS file and compiles it to CSS */
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			}, {
				test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules|bower_components/,
				use: 'url-loader?limit=10000',
			}, {
				test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
				exclude: /node_modules|bower_components/,
				use: 'file-loader',
			}, {
				test: /\.(png|jp(e*)g|svg|gif)$/,  
				exclude: /node_modules|bower_components/,
				use: [{
					loader: 'url-loader',
					options: { 
						limit: 8000, /* Convert images < 8kb to base64 strings */
						name: 'assets/img/[name]-[hash].[ext]',
					},
				}],
			}, {
				test: /\.html$/,
				exclude: /node_modules|bower_components/,
				use: {
					loader: 'html-loader',
					options: {
						minimize: true,
					},
				},
			}, {
				test: /bootstrap\/dist\/js\/umd\//, 
				use: 'imports-loader?jQuery=jquery',
			}],
		},
		resolve: {
			extensions: ['*', '.jsx', '.js', '.scss', '.css', '.html'],
		},
		performance: {
			hints: false,
		},
		optimization: {
			runtimeChunk: false,
			splitChunks: {
				cacheGroups: {
					commons: {
						minSize: 0,
						minChunks: 2,
						chunks: 'all',
						maxInitialRequests: 5,
					},
					vendor: {
						priority: 10,
						chunks: 'all',
						enforce: true,
						name: 'vendors',
						test: /node_modules/,
					},
					styles: {
						chunks: 'all',
						enforce: true,
						test: /\.css$/,
						name: 'styles',
					},
					scripts: {
						chunks: 'all',
						enforce: true,
						test: /\.js$/,
						name: 'scripts',
					},
				},
			},
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true,
				}),
				new OptimizeCSSAssetsPlugin(),
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'assets/css/[name].bundle.css',
			}),
			new HtmlWebPackPlugin({
				template: 'src/index.html',
				filename: 'index.html',
				hash: (options.mode === 'production') ? false : true,
			}),
			new HtmlWebPackPlugin({
				template: 'src/404.html',
				filename: '404.html',
				hash: (options.mode === 'production') ? false : true,
			}),
			new webpack.HashedModuleIdsPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					'API_HOST': JSON.stringify('https://www.giggrafter.com/api'),
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				},
			}),
			new CopyWebpackPlugin([{
				from: 'src/assets/img',
				to: 'assets/img',
			}]),
		],
	}
};
