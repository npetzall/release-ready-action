const core = require("@actions/core");
const { promises: fs } = require("fs");
const { getOctokit } = require("@actions/github");

const { getTags } = require("./lib/tag");
const { getCommitsSinceTag } = require("./lib/commits");
const { parserFunc } = require("./lib/parser");
const { loadTemplate, render } = require("./lib/render");
const { createOrUpdateDraft } = require("./lib/release");

async function run() {
  try {
    const draftTag = core.getInput("draft-tag");
    const draftName = core.getInput("draft-name") || `Release ${draftTag}`;
    console.log(`Drafting next version ${draftName} with tag ${draftTag}`);
    const tags = await getTags();
    const tag = tags[0];
    if (tags.length > 0) {
      console.log(`Latest tag is ${tag}`);
    } else {
      console.log(`This repo has no tags, fetching all history`);
    }
    const rawCommits = getCommitsSinceTag(tag);
    const toHeaderObject = parserFunc(
      core.getInput("header-pattern"),
      JSON.parse(core.getInput("header-fields"))
    );
    const parsedCommits = rawCommits.map((commit) => {
      const parsedCommit = { ...commit };
      parsedCommit.header = toHeaderObject(commit.header);
      return parsedCommit;
    });
    const commitsFilename = `${draftName}-commits.json`;
    await fs.writeFile(
      commitsFilename,
      JSON.stringify(parsedCommits, (key, value) => value),
      2
    );
    core.setOutput("commits-json", commitsFilename);
    const template = await loadTemplate(core.getInput("template"));
    const releaseNotes = render(template, tag, draftTag, parsedCommits);
    const github = getOctokit(core.getInput("token", { required: true }));
    if (core.getInput("update-draft") === "true") {
      const { data: draft } = await createOrUpdateDraft(
        github,
        draftTag,
        draftName,
        releaseNotes
      );
      core.setOutput("upload-url", draft.upload_url);
      core.setOutput("draft-id", draft.id);
    }

    core.setOutput("release-notes", releaseNotes);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
