module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          assets: "./src/assets",
          components: "./src/components",
          configs: "./src/configs",
          containers: "./src/containers",
          lang: "./src/lang/index",
          navigations: "./src/navigations/index",
          reducers: "./src/store/reducers/index",
          store: "./src/store/store",
          src: "./src",
        },
      },
    ],
    'react-native-reanimated/plugin',
    'react-native-worklets-core/plugin',
  ],
};
