const path = require('path');
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event;
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};



const common = {
	entry: {
		app: PATHS.app	
	},
	resolve: {
		extensions: ['', '.js', '.jsx']	
	},
	output:{
		path: PATHS.build,
		filename: 'bundle.js'	
	},
	module: {
		loaders: [
			{
				//test expects regex
				test: /\.css$/,
				loaders: ['style', 'css'],
				//include accepts a path or an array of paths
				include: PATHS.app	
			},	
			{
				test: /\.jsx?$/,
				loaders: ['babel?cacheDirectory'],
				//parse only app files
				include: PATHS.app	
			}
		]
	}
};
if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			contentBase: PATHS.build,
			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.		
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			
			//display only errors
			stats: 'errors-only',
			host: process.env.HOST,
			port: process.env.PORT			 
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new NpmInstallPlugin({
				save:true //--save	
			})	
		]	
	});
}

if(TARGET === 'build') {
	module.exports = merge(common, {});
}
