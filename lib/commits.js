const { git } = require("./git-cli");

const getCommitsSinceTag = async (tag, dir) => {
  const format = {
    hash: "%H",
    date: "%aI",
    header: "%s",
    body: "%b",
    author: { name: "%an", email: "%ae" },
  };
  const gitLogFormat = JSON.stringify(format).replace(/"/gm, "%x1A");

  const range = tag ? `${tag}..HEAD` : "HEAD";

  return new Promise((resolve, reject) => {
    git(["log", range, "--no-merges", `--pretty=format:,${gitLogFormat}`], dir)
      .then((out) => {
        resolve(
          out.trim() === ""
            ? []
            : // eslint-disable-next-line no-control-regex
              JSON.parse(`[${out.replace(/\x1A/gm, '"').substring(1)}]`)
        );
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

module.exports = { getCommitsSinceTag };
