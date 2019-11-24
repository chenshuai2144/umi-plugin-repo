import React from 'react';
import { IUiApi } from 'umi-types';
import Switch from './switch';
import Counter from './counter';
import './index.less';

export default (api: IUiApi) => {
  function PluginPanel() {
    return (
      <Counter.Provider>
        <div className="umi-plugin-repo" style={{ padding: 16, height: '100%', overflow: 'auto' }}>
          <Switch api={api} />
        </div>
      </Counter.Provider>
    );
  }

  api.addPanel({
    title: '详情',
    path: '/details',
    icon: 'github',
    component: PluginPanel,
  });
};
