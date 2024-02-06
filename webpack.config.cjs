const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);
  const { shareAll } = require('@angular-architects/module-federation/webpack');
  
module.exports = {
  output: {
    uniqueName: "commonApp",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },   
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        name: "commonApp",
        filename: "remoteEntry.js",
        exposes: {
          "./ChartComponent":'.//src/app/chart/chart.component.ts',
          './VolumeTrendComponent': './/src/app/production-volume-trend/production-volume-trend.component.ts',
          './TrendWidget':'.//src/app/trend-widget/trend-widget.component.ts',
        },        
        // For hosts (please adjust)
        // remotes: {
        //     "mfe1": "http://localhost:3000/remoteEntry.js",

        // },

        shared: { ...shareAll({
          singleton: true,
        }),}
        
    }),
    sharedMappings.getPlugin()
  ],
};
