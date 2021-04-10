const { getCommitsSinceTag } = require("./commits");
const { getTags } = require("./tag");

describe("Git cli processing", () => {
  test("Get since since tag before latest", async () => {
    const tag = (await getTags())[1];
    const commits = await getCommitsSinceTag(tag);
    expect(commits).toBeDefined();
    expect(commits.length).toBeGreaterThan(0);
  });
});
