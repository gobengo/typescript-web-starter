declare module "html-webpack-plugin" {
	import { Plugin } from "webpack";
	class HtmlWebpackPluginType extends Plugin {}
	interface HtmlWebpackPluginOpts {
		template: string;
	}
	interface HtmlWebpackPluginConstructor {
		new (o: HtmlWebpackPluginOpts): HtmlWebpackPluginType;
	}
	const HtmlWebpackPlugin: HtmlWebpackPluginConstructor;
	export = HtmlWebpackPlugin;
}
