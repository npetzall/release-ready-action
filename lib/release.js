const { context } = require("@actions/github");

const opt = {
  owner: context.repo.owner,
  repo: context.repo.repo,
};

const clearAssets = async(github, assets) => {
  for (let asset of assets) {
    await github.rest.repos.deleteReleaseAsset({...opt, asset_id: asset.id});
  }
}

const createOrUpdateDraft = async(github, draftTag, draftName, releaseNote) => {
  const {data: releases} = await github.rest.repos.listReleases(opt);
  const currentDraft = releases.find(r => r.draft);
  if (currentDraft) {
    console.log(`Updating draft: ${currentDraft.id}`);
    const updatedDraft = await github.rest.repos.updateRelease({...opt,
      release_id: currentDraft.id,
      tag_name: draftTag,
      target_commitish: context.sha,
      name: draftName,
      body: releaseNote,
      draft: true,
    });
    await clearAssets(github, updatedDraft.data.assets);
    return updatedDraft;
  } else {
    console.log("Creating a new draft");
    return await  github.rest.repos.createRelease({...opt,
      tag_name: draftTag,
      target_commitish: context.sha,
      name: draftName,
      body: releaseNote,
      draft: true,
      prerelease: false
    });
  }
}

module.exports = {createOrUpdateDraft};