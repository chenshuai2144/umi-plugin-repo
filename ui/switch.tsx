import React from 'react';
import { IUiApi } from 'umi-types';
import Counter from './counter';
import RepoStatus from './component/RepoStatus';
import CommitList from './commitList';
import BranchList from './branchList';

const getPage = (page: 'detail' | 'commit' | 'branch' | 'tags', api: IUiApi) => {
  if (page === 'commit') {
    return <CommitList api={api} />;
  }
  if (page === 'branch') {
    return <BranchList api={api} />;
  }
  return null;
};

export default ({ api }: { api: IUiApi }) => {
  const { page } = Counter.useContainer();

  return (
    <>
      <div
        style={{
          display: page === 'detail' ? 'block' : 'none',
        }}
      >
        <RepoStatus api={api} />
      </div>
      {getPage(page, api)}
    </>
  );
};
