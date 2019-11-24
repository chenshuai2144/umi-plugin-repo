import React from 'react';
import { Avatar, PageHeader, Button, List, Skeleton } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import Moment from 'moment';
import { Select, Code, Branches } from '@ant-design/icons';
import Counter from '../counter';
import { LogsItem } from 'ui/typing';

/**
 * 提交记录
 * @param param0
 */
const LogsList: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const counter = Counter.useContainer();
  const { value, loading } = useAsyncRetry<LogsItem[]>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.logs',
    })) as {
      data: LogsItem[];
    };
    return data;
  });
  const repoUrl = counter.repoInfo.toString('https');
  return (
    <>
      <PageHeader
        style={{
          margin: -16,
          marginBottom: 0,
          backgroundColor: '#30303d',
          borderLeft: '1px solid #23232e',
        }}
        onBack={() => {
          counter.setPage('detail');
        }}
        title="提交列表"
      />
      <List<LogsItem>
        style={{
          margin: 16,
        }}
        loading={loading}
        itemLayout="horizontal"
        dataSource={value}
        pagination={{
          pageSize: 10,
        }}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                target="_blank"
                onClick={() => {
                  window.open(`${repoUrl}/commit/${item.hash}`.replace('.git', ''));
                }}
              >
                <Select />
              </Button>,
              <Button
                target="_blank"
                onClick={() => {
                  window.open(`${repoUrl}/tree/${item.hash}`.replace('.git', ''));
                }}
              >
                <Code />
              </Button>,
            ]}
          >
            <Skeleton loading={loading} avatar title={false}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    src={`https://avatars.githubusercontent.com/${item.author_name}?size=64`}
                    style={{
                      marginRight: 8,
                    }}
                  />
                }
                title={<a href="https://ant.design">{item.message}</a>}
                description={
                  <>
                    <a
                      target="_blank"
                      href={`${repoUrl}/commits?author=${item.author_name}`.replace('.git', '')}
                    >
                      {item.author_name}
                    </a>{' '}
                    提交于 {Moment(item.date).format('YYYY-MM-DD HH:mm')}
                  </>
                }
              />
              {}
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

export default LogsList;
