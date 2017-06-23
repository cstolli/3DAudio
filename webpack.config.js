/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2015-11-27T19:28:20-08:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2017-06-22T22:10:28-07:00
* @License: MIT
*/

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
      { test: /\.json/, loader: "json-loader"},
  	]
	}
}
