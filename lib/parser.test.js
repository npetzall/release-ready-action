const {parse} = require("./parser");

describe('Parsing', () => {
  test("Parse conventional commits headers", () => {
    const headers = parse(["fix(ui): corrected css"], "^(\\w*)(?:\\(([\\w$.\\-*/ ]*)\\))?: (.*)$", ["type", "scope", "message"])
    expect(headers[0]).toStrictEqual({type: "fix", scope: "ui", message: "corrected css"})
  });
  test("Parse invalid header", () => {
    const headers = parse(["corrected css"], "^(\\w*)(?:\\(([\\w$.\\-*/ ]*)\\))?: (.*)$", ["type", "scope", "message"])
    expect(headers[0]).toStrictEqual({type: "invalid", message: "corrected css"})
  });
});