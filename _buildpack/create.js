const { resolve } = require("path");

function createMe({ fs, tasks, options, findPackageRoot }) {
  return {
    async before() {
      return tasks.CREATE({
        template: "@magento/venia-concept"
      });
    },
    visitor: {
      "package.json": ({ targetPath }) => {
        const pkg = fs.readJsonSync(targetPath);
        pkg.description =
          "A new project based on a local copy of @magento/venia-ui";
        fs.outputJsonSync(targetPath, pkg, {
          spaces: 2
        });
      },
      "webpack.config.js": tasks.COPY
    },
    async after() {
      const toCopyFromVeniaLib = [
        "lib",
        "venia-static",
        "templates",
        "upward.yml"
      ];
      const uiDepLocation = await findPackageRoot.local("@magento/venia-ui");
      await Promise.all(
        toCopyFromVeniaLib.map(veniaAsset =>
          fs.copy(
            resolve(uiDepLocation, veniaAsset),
            resolve(options.directory, "venia-ui", veniaAsset),
            {
              overwrite: false,
              dereference: true,
              preserveTimestamps: true
            }
          )
        )
      );
    }
  };
}

module.exports = createMe;
