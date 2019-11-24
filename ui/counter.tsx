import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { GitUrl } from 'git-url-parse';

function useCounter() {
  const [repoInfo, setRepoInfo] = useState<GitUrl>();
  const [page, setPage] = useState<'detail' | 'commit' | 'branch' | 'tags'>('detail');
  return { repoInfo, setRepoInfo, page, setPage };
}
const Counter = createContainer(useCounter);

export default Counter;
