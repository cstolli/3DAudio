module.exports = {
    entry:  __dirname + "/code/index.tsx",
    output: {
        path: __dirname + "/dist",
        filename: "index.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx', '.less'],
        modulesDirectories: ['node_modules']
    },
	module: {
		loaders: [
            { test: /\.less/, loader: "style!css!less"},
            { test: /\.tsx/, loader: "ts-loader"},
		]
	}
}