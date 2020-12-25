const { getCommitsSinceTag } = require("./commits");
const { parse, parserFunc } = require("./parser");

describe("Parsing", () => {
  test("Parse conventional commits headers", () => {
    const headers = parse(
      ["fix(ui): corrected css"],
      "^(\\w*)(?:\\(([\\w$.\\-*/ ]*)\\))?: (.*)$",
      ["type", "scope", "message"]
    );
    expect(headers[0]).toStrictEqual({
      type: "fix",
      scope: "ui",
      message: "corrected css",
    });
  });
  test("Parse invalid header", () => {
    const headers = parse(
      ["corrected css"],
      "^(\\w*)(?:\\(([\\w$.\\-*/ ]*)\\))?: (.*)$",
      ["type", "scope", "message"]
    );
    expect(headers[0]).toStrictEqual({
      type: "invalid",
      message: "corrected css",
    });
  });
});

describe("parserFun", () => {
  test("Using parserFunc on raw commits", async () => {
    const rawCommits = await getCommitsSinceTag(undefined, undefined);
    const toHeaderObject = parserFunc(/^(\w*)(?:\(([\w$.\-*/ ]*)\))?: (.*)$/, [
      "type",
      "scope",
      "message",
    ]);
    const parsedCommits = rawCommits.map((commit) => {
      const parsedCommmit = { ...commit };
      parsedCommmit.header = toHeaderObject(commit.header);
      return parsedCommmit;
    });
    expect(parsedCommits.length).toEqual(rawCommits.length);
  });
});
