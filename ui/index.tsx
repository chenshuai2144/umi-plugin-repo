import React from 'react';
import { IUiApi } from 'umi-types';
import RepoStatus from './component/RepoStatus';

export default (api: IUiApi) => {
  function PluginPanel() {
    return (
      <div style={{ padding: 20 }}>
        <RepoStatus api={api} />
      </div>
    );
  }

  api.addPanel({
    title: '项目详情',
    path: '/umi-plugin-repo',
    icon: 'home',
    component: PluginPanel,
  });
};
