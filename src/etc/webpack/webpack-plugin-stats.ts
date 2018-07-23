import * as webpack from "webpack";

/**
 * Webpack Plugin that writes stats to a file
 */
export class WebpackPluginStats {
	// tslint:disable-line:export-name
	public output: string;
	constructor(output: string) {
		this.output = output;
		this.apply = this.apply.bind(this) as (c: webpack.Compiler) => void;
	}
	/** Apply the plugin to a configured webpack Compiler. Watch for stats, then add a new output for the stats file */
	public apply(compiler: webpack.Compiler): void {
		const output = this.output;
		type Errback = (err?: Error) => void;
		compiler.plugin(
			"emit",
			(compilation: webpack.compilation.Compilation, done: Errback) => {
				let result: string;
				interface Assets {
					[key: string]: {
						size(): number;
						source(): string;
					};
				}
				const assets: Assets = compilation.assets as Assets;
				assets[output] = {
					size: () => (result ? result.length : 0),
					source: () => {
						const stats: webpack.Stats = compilation
							.getStats()
							.toJson() as webpack.Stats;
						result = JSON.stringify(stats);
						return result;
					},
				};
				done();
			},
		);
	}
}
