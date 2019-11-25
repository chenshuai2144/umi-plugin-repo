import React from 'react';
import { Popover, PageHeader, Button, List, Skeleton } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import Moment from 'moment';
import { Branches, ClockCircle, Dash, FileZip } from '@ant-design/icons';
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
      data: LogsItem[];
    };
    return data;
  });
  console.log(value);
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
          <List.Item
            actions={[
              <Popover
                content={
                  <div>
                    <a>创建发布</a>
                  </div>
                }
                trigger="click"
              >
                <Dash />
              </Popover>,
            ]}
          >
            <Skeleton loading={loading} avatar title={false}>
              <List.Item.Meta
                title={<a href="">{item}</a>}
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
                    <a target="_blank" href="">
                      分支
                    </a>{' '}
                    <FileZip
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <a target="_blank" href="">
                      压缩
                    </a>{' '}
                    <FileZip
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <a target="_blank" href="">
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
