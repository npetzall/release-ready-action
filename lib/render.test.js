const {loadTemplate, render} = require('./render');

describe("render", () => {
  test("filter eval", () => {
    const template = "Fix:\n" +
      "{{ for (var fix of changes.filter(function(change) { return change.header.type === 'fix'})) { }}" +
      "* {{=fix.header.message}}\n" +
      "{{ } }}" +
      "Features:\n" +
      "{{ for(var feat of changes.filter(function(change) { return change.header.type === 'feat' })) { }}" +
      "* {{=feat.header.message}}\n" +
      "{{ } }}";
    const expectation = "Fix:\n* fix1\n* fix2\nFeatures:\n* feat1\n* feat2\n";
    const output = render(template, undefined, undefined,[{header:{type: "feat", message: "feat1"}},{header:{type: "fix", message: "fix1"}},{header:{ type: "feat", message: "feat2"}},{header:{type: "fix", message: "fix2"}}]);
    expect(output).toStrictEqual(expectation);
  });

  test("defaultTemplate", async ()=> {
    const template = await loadTemplate(undefined);
    const changes = [{header:{type: "feat", message: "feat1"}},{header:{type: "fix", message: "fix1"}},{header:{ type: "feat", message: "feat2"}},{header:{type: "fix", message: "fix2"}}];
    expect(render(template, undefined,undefined, changes)).toBeDefined();
  });
})