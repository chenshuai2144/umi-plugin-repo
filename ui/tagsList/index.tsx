import React from 'react';
import { PageHeader, List, Skeleton } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import Moment from 'moment';
import { Branches, ClockCircle, FileZip } from '@ant-design/icons';
import Counter from '../counter';
import { LogsItem } from 'ui/typing';

/**
 * tags
 * @param param0
 */
const TagsList: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const counter = Counter.useContainer();
  const { value, loading } = useAsyncRetry<LogsItem[]>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.tags',
    })) as {
      data: any[];
    };
    const logs = (await api.callRemote({
      type: 'org.umi-plugin-repo.logs',
    })) as {
      data: LogsItem[];
    };
    // 从commit信息里面取到tag数据
    const commits = logs.data.filter((a: any) => a.refs.startsWith('tag: '));
    const tagList = data.map(item => {
      let tag = { refs: item };
      commits.forEach((i: any) => {
        if (i.refs.includes(item)) {
          i.refs = item;
          tag = i;
        }
      });
      return tag;
    });
    return tagList;
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
        title="标签列表"
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
          <List.Item>
            <Skeleton loading={loading} avatar title={false}>
              <List.Item.Meta
                title={<a href="">{item.refs}</a>}
                description={
                  <>
                    <ClockCircle
                      style={{
                        marginRight: 8,
                      }}
                    />
                    {Moment(item.date).format('YYYY-MM-DD HH:mm')}{' '}
                    <Branches
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <a target="_blank" href={`${repoUrl}/commit/${item.hash}`.replace('.git', '')}>
                      {item.hash.slice(0, 7)}
                    </a>{' '}
                    <FileZip
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <a target="_blank" href={`${repoUrl}/archive/${item.refs}.tar.gz`.replace('.git', '')}>
                      tar.gz
                    </a>{' '}
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

export default TagsList;
