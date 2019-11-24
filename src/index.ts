// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import fs from 'fs';
import { join } from 'path';

import GitAction from './git';

export default function(api: IApi, options) {
  // Example: output the webpack config
  api.chainWebpackConfig(config => {
    // console.log(config.toString());
  });
  const gitAction = new GitAction(api.winPath(api.paths.cwd));
  api.addUIPlugin(require.resolve('../dist/index.umd'));
  api.onUISocket(({ action, failure, success }) => {
    if (action.type === 'org.umi-plugin-repo.tags') {
      (async () => {
        const tags = await gitAction.getTags();
        success({
          data: tags,
        });
      })();
    }
    if (action.type === 'org.umi-plugin-repo.logs') {
      (async () => {
        const logs = await gitAction.getLogs();
        success({
          data: logs,
        });
      })();
    }

    if (action.type === 'org.umi-plugin-repo.branch') {
      (async () => {
        const branch = await gitAction.getBranch();
        success({
          data: branch,
        });
      })();
    }

    if (action.type === 'org.umi-plugin-repo.remote') {
      (async () => {
        const remote = await gitAction.getRemote();
        success({
          data: remote,
        });
      })();
    }
    if (action.type === 'org.umi-plugin-repo.lastCommit') {
      (async () => {
        const remote = await gitAction.getRemote();
        const logs = await gitAction.getLogs();
        success({
          data: {
            remote,
            commit: logs[0],
          },
        });
      })();
    }

    if (action.type === 'org.umi-plugin-repo.readme') {
      (async () => {
        const cwd = api.winPath(api.paths.cwd);
        const READMEPath = join(cwd, 'README.md');
        const emoji = require('markdown-it-emoji');
        const md = require('markdown-it')({
          html: true,
          linkify: true,
          typographer: true,
        });
        md.use(emoji);
        if (fs.existsSync(READMEPath)) {
          const readmeFile = fs.readFileSync(READMEPath, 'utf-8');
          success({
            data: md.render(readmeFile),
          });
          return;
        }
        success({
          data: `没有找到您项目中的 README.md 文件`,
        });
      })();
    }
  });
}
