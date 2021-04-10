const { git } = require("./git-cli");

const getCommitsSinceTag = async (tag, dir) => {
  const format = {
    hash: "%H",
    date: "%aI",
    header: "%s",
    body: "%b",
    author: { name: "%an", email: "%ae" },
  };
  const gitLogFormat = JSON.stringify(format).replace(/"/gm, "%x1A") + "%x17";

  const range = tag ? `${tag}..HEAD` : "HEAD";

  return new Promise((resolve, reject) => {
    git(["log", range, "--no-merges", `--pretty=format:${gitLogFormat}`], dir)
      .then((out) => {
        resolve(
          out.trim() === ""
            ? []
            : // eslint-disable-next-line no-control-regex
              JSON.parse(
                `[${out
                  .replace(/"/gm, '\\"')
                  // eslint-disable-next-line no-control-regex
                  .replace(/\x1A/gm, '"')
                  // eslint-disable-next-line no-control-regex
                  .replace(/\x17\n/gm, ",")
                  .replace(/(\r\n|\r|\n)/gm, "\\n")
                  .slice(0, -1)}]`
              )
        );
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

module.exports = { getCommitsSinceTag };
