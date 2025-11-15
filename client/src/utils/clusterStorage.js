const KEY = "cluster";

// Private

const _getData = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

const _saveData = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

// Public

export const GetClusters = () => {
  const data = _getData();
  return Object.keys(data);
};

export const CreateCluster = (clusterName) => {
  if (!clusterName) return false;
  const data = _getData();
  if (data[clusterName]) return false;
  data[clusterName] = [];
  _saveData(data);
  return true;
};

export const GetClustersForRepo = (repoFullname) => {
  const data = _getData();
  const clustersFound = [];
  for (const clusterName in data) {
    if (data[clusterName].some((r) => r.fullname === repoFullname)) {
      clustersFound.push(clusterName);
    }
  }
  return clustersFound;
};

export const GetReposInCluster = (clusterName) => {
  const data = _getData();
  return data[clusterName] || [];
};

export const SaveRepoToCluster = (clusterName, repo) => {
  const data = _getData();
  if (!data[clusterName])
    return { success: false, message: "Cluster doesn't exist" };

  const cluster = data[clusterName];
  if (cluster.some((r) => r.fullname === repo.fullname))
    return { success: false, message: "Repo already in this cluster" };

  cluster.push({
    ...repo,
    savedAt: new Date().toISOString(),
  });
  
  _saveData(data);
  return { success: true, message: `Saved to ${clusterName}!` };
};

export const RemoveRepoFromCluster = (clusterName, repoFullname) => {
  const data = _getData();
  if (!data[clusterName]) return;

  data[clusterName] = data[clusterName].filter(
    (r) => r.fullname !== repoFullname
  );
  _saveData(data);
};

export const IsRepoSavedInAnyCluster = (repoFullname) => {
  const data = _getData();

  for (const clusterName in data) {
    if (data[clusterName].some((r) => r.fullname === repoFullname))
      return true;
  }
  return false;
};