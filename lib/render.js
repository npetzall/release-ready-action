const { promises: fs } = require('fs');
const path = require('path');

const dot = require('dot');
dot.templateSettings.strip = false;
dot.templateSettings.varname = "currentVersion,nextVersion,changes";

const DEFAULT_TEMPLATE = path.join(__dirname,"defaultTemplate.dot");

const render = (template, currentVersion, nextVersion, changes) => {
  return dot.template(template)(currentVersion, nextVersion, changes);
}

const load = async(templatePath) => {
  return await fs.readFile(templatePath, 'utf8');
}

const loadTemplate = async(templatePath) => {
  return templatePath ? await load(templatePath) : await load(DEFAULT_TEMPLATE);
}

module.exports = {render, loadTemplate};