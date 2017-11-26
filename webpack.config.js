module.exports = {
	entry: "./src/main.ts",
	output: {
		filename: "./dist/bundle.js"
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		loaders: [{
			exclude: /(node_modules)/,
			loaders: ["babel-loader", "ts-loader"]
		}]
	},
	externals: [
		{"pixi.js": "PIXI"}
	]
};
