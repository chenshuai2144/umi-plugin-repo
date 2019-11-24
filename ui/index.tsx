import React from 'react';
import { IUiApi } from 'umi-types';
import RepoStatus from './component/RepoStatus';

export default (api: IUiApi) => {
  function PluginPanel() {
    return (
      <div className="umi-plugin-repo" style={{ padding: 20, height: '100%', overflow: 'auto' }}>
        <RepoStatus api={api} />
      </div>
    );
  }

  api.addPanel({
    title: '详情',
    path: '/details',
    icon: 'fork',
    component: PluginPanel,
  });
};
