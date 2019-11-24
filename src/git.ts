import git from 'simple-git';

class GitAction {
  gitAction: any;
  constructor(cwd: string) {
    console.log(cwd);
    this.gitAction = git(cwd);
  }
  getTags = () =>
    new Promise<string[]>((resolve, reject) => {
      this.gitAction.tags((err, tags) => {
        if (err) {
          reject(err);
        }
        resolve(tags.all);
      });
    });
  getLogs = () =>
    new Promise<string[]>((resolve, reject) => {
      this.gitAction.log((err, logs) => {
        if (err) {
          reject(err);
        }
        resolve(logs.all);
      });
    });
  getBranch = () =>
    new Promise<string[]>((resolve, reject) => {
      this.gitAction.branchLocal((err, branch) => {
        if (err) {
          reject(err);
        }
        resolve(branch.all);
      });
    });
  getRemote = () =>
    new Promise<string[]>((resolve, reject) => {
      this.gitAction.listRemote(['--get-url'], (err, data) => {
        if (!err) {
          resolve(data);
        }
        reject(err);
      });
    });
}

export default GitAction;
