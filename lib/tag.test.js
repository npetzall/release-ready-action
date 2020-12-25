const { getTags } = require("./tag");
describe("tag", () => {
  test("getTags when no tags exists return empty array", async () => {
    const tags = await getTags();
    expect(tags).toBeDefined();
    expect(tags.length).toEqual(0);
  });
  test.skip("getTags when tags exists, return array bigger than 0", async () => {
    const tags = await getTags();
    expect(tags).toBeDefined();
    expect(tags.length).toBeGreaterThan(0);
  });
});
