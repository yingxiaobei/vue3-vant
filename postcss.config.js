const path = require("path");

module.exports = ({ file }) => {
  // console.log(file);
  //   const designWidth = file.dirname.includes(path.join("node_modules", "vant"))
  //     ? 375
  //     : 750;

  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {
        overrideBrowserslist: [
          "Android 4.1",
          "iOS 7.1",
          "Chrome > 31",
          "ff > 31",
          // "ie >= 8",
          //'last 10 versions', // 所有主流浏览器最近2个版本
        ],
        grid: true,
      },
      "postcss-px-to-viewport": {
        unitToConvert: "px",
        viewportWidth: 375,
        unitPrecision: 6,
        propList: ["*"],
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: true,
        exclude: [],
        landscape: false,
      },
    },
  };
};
