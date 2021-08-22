const core = require("@actions/core");
const github = require("@actions/github");
const {Octokit} = require("@octokit/rest");

const getNewReleaseTag = (oldReleaseTag, versionBuild, versionPrefix) => {
    console.log(1)
    console.log(2)
    if (!versionPrefix) versionPrefix = ''
    if (!oldReleaseTag) {
        return `${versionPrefix}0.0.1`
    }
    oldReleaseTag = oldReleaseTag
        .replace('v', '')
        .replace('v.', '')
        .replace('v-', '')
        .replace(`${versionPrefix}`, '')
    const version = oldReleaseTag.split(".").map((x) => Number(x));
    if (version.length < 1) {
        return `${versionPrefix}0.0.1`
    }
    if (versionBuild === 'major') {
        version[0] = version[0] + 1
    } else if (versionBuild === 'minor') {
        if (version.length < 2) {
            version[0] = version[0] + 1
        } else {
            version[1] = version[1] + 1
        }
    } else if (versionBuild === 'patch') {
        if (version.length < 2) {
            version[0] = version[0] + 1
        } else if (version.length < 3) {
            version[1] = version[1] + 1
        } else {
            version[2] = version[2] + 1
        }
    } else {
        version[0] = version[0] + 1
    }
    return `${versionPrefix}${version.join('.')}`
};

const generateNextReleaseTag = async () => {
    try {
        const githubToken = core.getInput("GITHUB_TOKEN");
        const versionBuild = core.getInput("VERSION_BUILD");
        const versionPrefix = core.getInput("PREFIX");
        const octokit = new Octokit({auth: githubToken})
        const {owner, repo} = github.context.repo;
        const response = await octokit.rest.repos.listTags({
            owner,
            repo,
            per_page: 5
        });
        const oldReleaseTag = response.data && response.data.length > 0 ? response.data[0].name : null;
        const newReleaseTag = getNewReleaseTag(oldReleaseTag, versionBuild, versionPrefix);
        console.log(`Previous Release Tag: ${oldReleaseTag}`);
        console.log(`New Release Tag: ${newReleaseTag}`);
        core.exportVariable("RELEASE_TAG", newReleaseTag);
    } catch (error) {
        core.setFailed(error.message);
    }
};

generateNextReleaseTag();
