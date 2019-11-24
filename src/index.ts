// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import GitAction from './git';

export default function(api: IApi, options) {
  // Example: output the webpack config
  api.chainWebpackConfig(config => {
    // console.log(config.toString());
  });
  const gitAction = new GitAction(api.winPath(api.cwd));
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
  });
}
