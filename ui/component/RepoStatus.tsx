import React from 'react';
import { Tags, Github, History, Branches, Loading } from '@ant-design/icons';
import Moment from 'moment';
import { Avatar, Tooltip } from 'antd';
import { IUiApi } from 'umi-types';
import { useAsyncRetry } from 'react-use';
import gitUrlParse, { GitUrl } from 'git-url-parse';
import ReadMe from './ReadMe';
import Counter from '../counter';
import { LogsItem } from 'ui/typing';

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

/**
 * 仓库的 remote 信息
 * @param param0
 */
const RemoteTag: React.FC<{
  api: IUiApi;
}> = ({ api }) => {
  const counter = Counter.useContainer();
  const { value, loading } = useAsyncRetry<GitUrl>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.remote',
    })) as {
      data: string;
    };
    const repoInfo = gitUrlParse(data);
    counter.setRepoInfo(repoInfo);
    return repoInfo;
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
        cursor: 'pointer',
      }}
      onClick={() => {
        window.open(value.toString('https'));
      }}
    >
      <Github
        style={{
          marginRight: 8,
        }}
      />
      {value.name}
    </div>
  );
};

/**
 * 提交记录
 * @param param0
 */
const LogsTag: React.FC<{
  api: IUiApi;
  onClick: () => void;
}> = ({ api, onClick }) => {
  const { value = [] } = useAsyncRetry<LogsItem[]>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.logs',
    })) as {
      data: LogsItem[];
    };
    return data;
  });

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #30303d',
        cursor: 'pointer',
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

/**
 * 分支信息
 * @param param0
 */
const BranchTag: React.FC<{
  api: IUiApi;
  onClick: () => void;
}> = ({ api, onClick }) => {
  const { value = [] } = useAsyncRetry(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.branch',
    })) as {
      data: [];
    };
    return data;
  });

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #30303d',
        cursor: 'pointer',
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

/**
 * 标签列表
 * @param param0
 */
const TagsInfoTag: React.FC<{
  api: IUiApi;
  onClick: () => void;
}> = ({ api, onClick }) => {
  const { value = [], loading } = useAsyncRetry(async () => {
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
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
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

/**
 * 上次提交的信息
 * @param param0
 */
export const LastCommit = ({ api }: { api: IUiApi }) => {
  const {
    value = {
      commit: {
        hash: '',
      },
      remote: 'https://github.com/chenshuai2144/umi-plugin-repo',
    },
  } = useAsyncRetry<{
    commit: LogsItem;
    remote: string;
  }>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.lastCommit',
    })) as {
      data: {
        commit: Partial<LogsItem>;
        remote: string;
      };
    };
    return data;
  });

  const lastCommit = (value || {}).commit || {};
  const repoInfo = gitUrlParse((value || {}).remote);
  const repoUrl = repoInfo.toString('https');
  return (
    <div
      style={{
        backgroundColor: '#30303d',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 24px',
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
          <a target="_blank" href={`${repoUrl}/commit/${lastCommit.hash}`.replace('.git', '')}>
            {lastCommit.hash.slice(0, 7)}{' '}
          </a>{' '}
        </Tooltip>
        在 {Moment(lastCommit.date).format('YYYY-MM-DD HH:mm')}
      </span>
    </div>
  );
};

export default ({ api }: { api: IUiApi }) => {
  const counter = Counter.useContainer();
  return (
    <>
      <div
        style={{
          display: 'flex',
          padding: 8,
          boxShadow: '0 1px 3px rgba(26,26,26,.1)',
          border: '1px solid #30303d',
        }}
      >
        <RemoteTag api={api} />
        <LogsTag
          api={api}
          onClick={() => {
            counter.setPage('commit');
          }}
        />
        <BranchTag
          onClick={() => {
            counter.setPage('branch');
          }}
          api={api}
        />
        <TagsInfoTag
          onClick={() => {
            counter.setPage('tags');
          }}
          api={api}
        />
      </div>
      <LastCommit api={api} />
      <ReadMe api={api} />
    </>
  );
};
