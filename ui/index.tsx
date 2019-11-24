import { Button } from 'antd';
import { IUiApi } from 'umi-types'

export default (api: IUiApi) => {
  const { callRemote } = api;

  function PluginPanel() {
    return (
      <div style={{ padding: 20 }}>
        <Button
          type="primary"
          onClick={async () => {
            const { data } = await callRemote({
              type: 'org.chenshuai2144.umi-plugin-repo.test',
            });
            alert(data);
          }}
        >Test</Button>
      </div>
    );
  }

  api.addPanel({
    title: 'umi-plugin-repo',
    path: '/umi-plugin-repo',
    icon: 'home',
    component: PluginPanel,
  });
}
