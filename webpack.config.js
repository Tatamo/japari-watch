module.exports = {
	entry: "./src/scripts/main.ts",
	output: {
		filename: "./dist/bundle.js"
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		loaders: [{
			exclude: /(node_modules)/,
			test: /\.(ts|js)$/,
			loaders: ["babel-loader", "ts-loader"]
		}]
	},
	externals: [
		{"pixi.js": "PIXI"}
	]
};
