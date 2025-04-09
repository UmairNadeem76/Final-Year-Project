import React, { useState, useMemo } from 'react';
import './AccountInfo.css';
import useGeneral from '../hooks/useGeneral';

const AccountInfo: React.FC = () => {
    const { user, loading } = useGeneral();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filteredHistory = useMemo(() => {
        const history = user?.history ?? [];

        const filtered = selectedFilter === 'All'
            ? history
            : history.filter(item =>
                item.result.toLowerCase().includes(selectedFilter.toLowerCase())
            );

        return filtered.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [selectedFilter, user?.history]);

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : 'N/A';

    return (
        <div className="account-info-container">
            {loading ? (
                <div className="account-card">Loading user info...</div>
            ) : !user ? (
                <div className="account-card error">User not found or not logged in.</div>
            ) : (
                <div className="account-card">
                    <h2>Account Information</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Account Created On:</strong> {formattedDate}</p>
                </div>
            )}

            <div className="history-section">
                <h2>Upload History & Results</h2>

                <div className="filter-bar">
                    <label htmlFor="filter">Filter by Result:</label>
                    <select
                        id="filter"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="No Tumor">NoTumor</option>
                        <option value="Glioma">Glioma</option>
                        <option value="Meningioma">Meningioma</option>
                        <option value="Pituitary">Pituitary</option>
                    </select>
                </div>

                <table className="history-table">
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Date</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <span className="clickable-filename" onClick={() => setPreviewUrl(`http://localhost:5000/upload/display/${item.filename}`)}>
                                        {item.filename}
                                    </span>

                                </td>
                                <td>{new Date(item.timestamp).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                                <td>{item.result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {previewUrl && (
                <div className="image-popup">
                    <div className="image-popup-content">
                        <button className="close-button" onClick={() => setPreviewUrl(null)}>×</button>
                        <img src={previewUrl} alt="Preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;
