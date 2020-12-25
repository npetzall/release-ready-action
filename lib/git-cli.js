const exec = require("@actions/exec");

const git = async (args, dir) => {
  let out = "";
  let errors = "";

  const options = {
    listeners: {
      stdout: (data) => {
        out += data.toString();
      },
      stderr: (error) => {
        errors += error.toString();
      },
    },
    failOnStdErr: true,
    silent: true,
  };
  options.cwd = dir || process.env.GITHUB_WORKSPACE || process.cwd();
  return new Promise((resolve, reject) => {
    exec
      .exec("git", ["--no-pager", ...args], options)
      .then(() => resolve(out))
      .catch((err) => reject({ err: err, stdErr: errors }));
  });
};

module.exports = { git };
