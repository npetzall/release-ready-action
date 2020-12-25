const { git } = require("./git-cli");

const getTags = async (dir) => {
  return new Promise((resolve, reject) => {
    git(["tag", "-l", "--sort=-v:refname"], dir)
      .then((out) => {
        resolve(out.trim() === "" ? [] : out.trim().split(/\r?\n/));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

module.exports = { getTags };
