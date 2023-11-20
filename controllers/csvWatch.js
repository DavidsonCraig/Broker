const chokidar = require("chokidar");
const mime = require("mime-types");
let watch;

function startCsvWatch(path, onFileAdded) {
  watch = chokidar.watch(path, { ingnored: /^\./, persistent: true });

  watch
    .on("add", (path) => {
      const fileType = mime.lookup(path);
      switch (fileType) {
        case "text/csv":
          console.log(`Valid CSV: ${path}`);
          onFileAdded(path);
          break;
        default:
          console.log(`Invalid CSV: ${path}`);
          break;
      }
    })
    .on("error", (err) => {
      console.error(err);
    });
}

function stopWatching() {
  if (watch) {
    watch.close();
  }
}

module.exports = {
  startCsvWatch,
  stopWatching,
};
