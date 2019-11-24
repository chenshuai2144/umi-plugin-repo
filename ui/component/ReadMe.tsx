import React, { useRef, useEffect } from 'react';
import { IUiApi } from 'umi-types';

import { useAsyncRetry } from 'react-use';
import PageLoading from './PageLoading';

export default ({ api }: { api: IUiApi }) => {
  const ref = useRef<HTMLDivElement>();
  const { value, loading } = useAsyncRetry<string>(async () => {
    const { data } = (await api.callRemote({
      type: 'org.umi-plugin-repo.readme',
    })) as {
      data: string;
    };

    return data;
  });

  useEffect(() => {
    if (ref) {
      const { current } = ref;
      if (current) {
        current.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css">
        ${value}`;
      }
    }
  }, [value]);

  return (
    <div
      ref={ref}
      style={{
        boxShadow: '0 1px 3px rgba(26,26,26,.1)',
        border: '1px solid #30303d',
        padding: 24,
        overflow: 'auto',
        minHeight: 600,
      }}
      className="markdown-body entry-content"
    />
  );
};
