/**
 * Webpack Configuration that all config variations have in common.
 */
import { join, resolve } from "path";
import { Loader } from "webpack";

const outputPath = resolve(join(__dirname, "../../../dist"));
const publicPath = "/dist";

export default {
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"],
		// Fix webpack's default behavior to not load packages with jsnext:main module
		// https://github.com/Microsoft/TypeScript/issues/11677
		mainFields: ["main"],
	},
	target: <"web">"web",
	context: resolve(join(__dirname, "../../")),
	output: {
		filename: "[name].js",
		path: outputPath,
		publicPath: publicPath,
	},
	optimization: {
		splitChunks: {
			chunks: <"initial">"initial", // <-- The key to this
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				exclude: /node_modules/,
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							context: join(__dirname, "../../../"),
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader?modules", "postcss-loader"],
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 1,
							sourceMap: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: (loader: Loader) => [
								require("postcss-smart-import"), // tslint:disable-line:no-require-imports
								require("autoprefixer"), // tslint:disable-line:no-require-imports
							],
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					"file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
					"image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false",
				],
			},
		],
	},
	plugins: [],
	performance: {
		hints: <false>false,
	},
	stats: {
		colors: true,
		errorDetails: true,
		modules: true,
		reasons: true,
	},
};
