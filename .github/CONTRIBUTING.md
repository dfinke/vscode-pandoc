# Publishing a release

* Ensure version in package.json has not been published yet. If already published, increase it (do nto forget package-lock.json). This kind of command be used: `npm version --no-git-tag-version patch`
* Create a tag and potentially a GitHub release
* Check GitHub Action `Publish Extension on tag` workflow has been triggered and is successful
* It is a good habit to upgrade the version after a successful publish, for instance with this kind of command: `npm version --no-git-tag-version patch`
