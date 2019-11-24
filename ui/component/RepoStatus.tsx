import React from 'react';
import { Tags, History, Branches, Loading } from '@ant-design/icons';
import Moment from 'moment';
import { Avatar, Tooltip } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import ReadMe from './ReadMe';

export const LoadingTag = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Loading
      style={{
        marginRight: 8,
      }}
    />
    加载中...
  </div>
);

export interface LogsItem {
  hash?: string;
  date?: string;
  message?: string;
  refs?: string;
  body?: string;
  author_name?: string;
  author_email?: string;
}

const LogsTag: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const { value, loading } = useAsyncRetry<LogsItem[]>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.logs',
    })) as {
      data: LogsItem[];
    };
    return data;
  });
  if (loading) {
    return <LoadingTag />;
  }
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #30303d',
      }}
    >
      <History
        style={{
          marginRight: 8,
        }}
      />
      {value.length} 次提交
    </div>
  );
};

const BranchTag: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const { value, loading } = useAsyncRetry(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.branch',
    })) as {
      data: [];
    };
    return data;
  });
  if (loading) {
    return <LoadingTag />;
  }
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #30303d',
      }}
    >
      <Branches
        style={{
          marginRight: 8,
        }}
      />
      {value.length} 个分支
    </div>
  );
};

const TagsInfoTag: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const { value, loading } = useAsyncRetry(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.tags',
    })) as {
      data: [];
    };
    return data;
  });
  if (loading) {
    return <LoadingTag />;
  }
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tags
        style={{
          marginRight: 8,
        }}
      />
      {value.length} 个标签
    </div>
  );
};

export const LastCommit = ({ api }: { api: IUiApi }) => {
  const { value, loading } = useAsyncRetry<LogsItem[]>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.logs',
    })) as {
      data: LogsItem[];
    };
    return data;
  });

  if (loading) {
    return <LoadingTag />;
  }
  const lastCommit = value[0];

  return (
    <div
      style={{
        backgroundColor: '#30303d',
        padding: 8,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <History
        style={{
          marginRight: 8,
        }}
      />
      <Tooltip title={lastCommit.author_name}>
        <a href={`https://github.com/${lastCommit.author_name}`} target="_blank">
          <Avatar
            size="small"
            shape="square"
            src={`https://avatars.githubusercontent.com/${lastCommit.author_name}?size=64`}
            style={{
              marginRight: 8,
            }}
          >
            {lastCommit.author_name}
          </Avatar>
        </a>
      </Tooltip>{' '}
      <Tooltip title={lastCommit.body}>
        <span
          style={{
            flex: 1,
          }}
        >
          {lastCommit.message}
        </span>
      </Tooltip>
      <span>
        最后一次提交{' '}
        <Tooltip title={lastCommit.hash}>
          <span>{lastCommit.hash.slice(0, 6)} </span>{' '}
        </Tooltip>
        在 {Moment(lastCommit.date).format('YYYY-MM-DD HH:mm:SS')}
      </span>
    </div>
  );
};

export default ({ api }: { api: IUiApi }) => (
  <>
    <div
      style={{
        display: 'flex',
        padding: 8,
        boxShadow: '0 1px 3px rgba(26,26,26,.1)',
        border: '1px solid #30303d',
      }}
    >
      <LogsTag api={api} />
      <BranchTag api={api} />
      <TagsInfoTag api={api} />
    </div>
    <LastCommit api={api} />
    <ReadMe api={api} />
  </>
);
