const { resolve } = require("path");

function createMe({ fs, tasks, options, findPackageRoot }) {
  return {
    async before() {
      return tasks.Create({
        template: "@magento/venia-concept"
      });
    },
    visitor: {
      "package.json": tasks.EditJson(({ target }) => {
        target.description =
          "A new project based on a local copy of @magento/venia-ui";
        return target;
      }),
      "webpack.config.js": async (opts, ...args) => {
        const { targetPath, options } = opts;
        // move the original out of the way
        await fs.move(
          targetPath,
          resolve(options.directory, "webpack.venia.config.js"),
          {
            overwrite: true
          }
        );
        // put ours in which calls the original from that path
        tasks.Copy(opts, ...args);
      }
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
            resolve(
              options.directory,
              "src",
              "@magento",
              "venia-ui",
              veniaAsset
            ),
            {
              overwrite: true,
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
