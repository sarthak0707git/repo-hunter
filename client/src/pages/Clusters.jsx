import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as clusterStorage from '../utils/clusterStorage';
import Card from '../components/card';

export default function Clusters() {
    const navigate = useNavigate();
    const [clusters, setClusters] = useState([]);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [clusterRepos, setClusterRepos] = useState([]);
    const [clusterStats, setClusterStats] = useState({});
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        loadClusters();
    }, []);

    useEffect(() => {
        if (selectedCluster) {
            const repos = clusterStorage.GetReposInCluster(selectedCluster);
            setClusterRepos(repos);
        } else setClusterRepos([]);
    }, [selectedCluster]);

    const loadClusters = () => {
        setLoading(true);
        const allClusters = clusterStorage.GetClusters();
        setClusters(allClusters);

        const stats = {};
        allClusters.forEach((cluster) => {
            const repos = clusterStorage.GetReposInCluster(cluster);
            stats[cluster] = repos.length;
        });
        setClusterStats(stats);

        if (allClusters.length > 0 && !selectedCluster) setSelectedCluster(allClusters[0]);
        setLoading(false);
    };

    const handleDeleteCluster = (clusterName) => {
        if (!clusterName) return;
        if (window.confirm(`Delete cluster "${clusterName}"? This cannot be undone.`)) {
            const data = JSON.parse(localStorage.getItem('cluster') || '{}');
            delete data[clusterName];
            localStorage.setItem('cluster', JSON.stringify(data));

            if (selectedCluster === clusterName) {
                setSelectedCluster(null);
                setClusterRepos([]);
            }
            loadClusters();
        }
    };

    const handleRemoveRepo = (repoFullname) => {
        if (!selectedCluster || !repoFullname) return;
        clusterStorage.RemoveRepoFromCluster(selectedCluster, repoFullname);
        const repos = clusterStorage.GetReposInCluster(selectedCluster);
        setClusterRepos(repos);
        setClusterStats((prev) => ({ ...prev, [selectedCluster]: repos.length }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-[var(--text-secondary)]">Loading clusters...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="border-b border-[var(--border-muted)] bg-[var(--bg-secondary)] overflow-x-auto ">
                <div ref={scrollRef} className="flex gap-2 px-8 py-4 max-w-6xl mx-auto">
                    {clusters.length === 0 ? (
                        <p className="text-[var(--text-tertiary)]">No clusters yet</p>
                    ) : (
                        clusters.map((cluster) => (
                            <button
                                key={cluster}
                                onClick={() => setSelectedCluster(cluster)}
                                className={`px-4 py-2 rounded-md whitespace-nowrap transition-all ${selectedCluster === cluster
                                        ? 'bg-[var(--button-primary-bg)] text-white'
                                        : 'bg-[var(--bg-fourth)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                    }`}
                            >
                                {cluster}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {selectedCluster && (
                <div className="max-w-6xl mx-auto p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[var(--text-strong)]">
                            {selectedCluster}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleDeleteCluster(selectedCluster)}
                                className="rounded-md bg-[var(--bg-fourth)] px-4 py-2 text-sm text-red-500 hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-strong)]"
                            >
                                Delete Cluster
                            </button>
                        </div>
                    </div>

                    {clusterRepos.length === 0 ? (
                        <p className="text-[var(--text-tertiary)]">No repositories in this cluster</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clusterRepos.map((repo) => (
                                <Card
                                    key={repo.fullname}
                                    repo={repo}
                                    clusterName={selectedCluster}
                                    onRemove={() => handleRemoveRepo(repo.fullname)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}