module.exports = {
    entry:  __dirname + "/static/ts/index.tsx",
    output: {
        path: __dirname + "/dist",
        filename: "index.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx',],
        modulesDirectories: ['node_modules']
    },
	module: {
		loaders: [
			{ test: /\.tsx/, loader: "ts-loader"}
		]
	}
}