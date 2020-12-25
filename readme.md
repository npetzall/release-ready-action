# Release Ready Action

Simple action to create/update a draft so that a release is only a click away.  
Clicking publish on the draft.

Inspiration has been taken from...  
[universal-changelog-action](https://github.com/mrchief/universal-changelog-action)  
[conventional-commits-parser](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser)  
[git-log-to-json](https://github.com/simonrenoult/git-log-to-json)  
And has a single production dependency on:

[doT](https://github.com/olado/doT)  
This dependency is using commit-ish instead of tag  
(if you don't know why, you should look it up)

## Features
* Retrieve commits since last tag  
  * This is done with git-cli so checkout must be with fetch-depth: 0
* Create a release notes based on commits rendered by [doT](https://github.com/olado/doT) 
* Create/Update draft
  * Will remove assets on update
  * Body will be the release notes
* Expose good stuff for later steps


## Inputs [action.yml](action.yml)

### `token`

If other than exposed in workflow. (Same logic as [@actions/checkout](https://github.com/actions/checkout))

### `draft-tag`

Next potential tag name, to be set when publishing draft

### `draft-name`

Name of release/draft, defaults to Release ${draft-tag}

### `header-pattern`

Pattern for extraction header fields (git might call it subject fields)  
[conventional-commits-parser#headerpattern](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#headerpattern)

### `header-fields`

Fields matching the `header-pattern`  
[conventional-commits-parser#headercorrespondence](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#headercorrespondence)

### `template`

File path to a doT template to be used when producing release notes.  
[doT docs](http://olado.github.io/doT/)

### `update-draft`

If draft should be update or not, default true.  
When false outputs: `draft-id`, `upload-url` will not be populated.

## Outputs

### `release-notes`

Release notes based on commits and doT template.  
[input template](#template)  
[doT docs](http://olado.github.io/doT/)  

### `draft-id`

The id of release draft that was created or updated.

### `upload-url`

This can be used with [actions/upload-release-asset](https://github.com/actions/upload-release-asset)

### `commits-json`

Filename of a json containing all commits used when creating release note.  

## Example usage [dogfooding](.github/workflows/main.yml)
```yaml
uses: [where ever this action ends up]
with:
    draft-tag: "v0.0.${{ github.run_number }}"
    template: "./.github/release-ready/releasenote.dot"
    update-draft: ${{ github.ref == 'refs/heads/main' }}
```
