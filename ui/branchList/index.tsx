import React, { useState } from 'react';
import { PageHeader, Input, Button, Table, message } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import { Delete, Reload, Branches } from '@ant-design/icons';
import Counter from '../counter';
import { modalCheck } from 'ui/component/fastUi';
import { TableRowSelection } from 'antd/lib/table/interface';

/**
 * 分支列表
 * @param param0
 */
const LogsList: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const counter = Counter.useContainer();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [keyWord, setKeyWord] = useState<string>('');
  const { value = [], loading, retry } = useAsyncRetry<
    {
      name: string;
    }[]
  >(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.branch',
    })) as {
      data: string[];
    };
    return data.map(key => ({
      name: key,
    }));
  });

  const columns = [
    {
      title: '分支名',
      dataIndex: 'name',
      key: 'name',
      render: text => (
        <span>
          <Branches
            style={{
              marginRight: 8,
            }}
          />{' '}
          {text}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: text =>
        text !== 'master' && (
          <Delete
            onClick={async () => {
              await modalCheck({
                title: `确定要删除 ${text} 分支吗？`,
                content: '删除将会使用 -D 参数删除，请谨慎操作！',
              });
              try {
                await api.callRemote({
                  type: 'org.umi-plugin-repo.deleteBranchList',
                  payload: { branchList: [text] },
                });
                message.success('删除成功！');
                retry();
              } catch (error) {
                message.error('删除失败，请重试！');
                retry();
              }
            }}
            style={{
              marginRight: 8,
            }}
          />
        ),
    },
  ];

  const rowSelection: TableRowSelection<{ name: string }> = {
    selectedRowKeys,
    getCheckboxProps: props => ({
      disabled: props.name === 'master',
    }),
    onChange: rowKeys => setSelectedRowKeys(rowKeys as string[]),
  };

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
        title="分支列表"
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 0',
        }}
      >
        <Input.Search
          value={keyWord}
          style={{
            marginRight: 8,
            width: 200,
          }}
          placeholder="请输入分支名"
          onChange={e => setKeyWord(e.target.value)}
        />
        <Button
          disabled={selectedRowKeys.length < 1}
          style={{
            marginRight: 8,
          }}
          onClick={async () => {
            await modalCheck({
              title: `确定要删除 ${selectedRowKeys.join(',')} 分支吗？`,
              content: '删除将会使用 -D 参数删除，请谨慎操作！',
            });
            try {
              await api.callRemote({
                type: 'org.umi-plugin-repo.deleteBranchList',
                payload: { branchList: selectedRowKeys },
              });
              message.success('删除成功！');
              retry();
            } catch (error) {
              message.error('删除失败，请重试！');
              retry();
            }
          }}
        >
          <Delete />
          删除分支
        </Button>
        <Button onClick={() => retry()} loading={loading}>
          <Reload />
        </Button>
      </div>
      <Table<{
        name: string;
      }>
        style={{
          margin: 16,
        }}
        columns={columns}
        loading={loading}
        rowKey="name"
        dataSource={value.filter(item => item.name.includes(keyWord))}
        rowSelection={rowSelection}
      />
    </>
  );
};

export default LogsList;
