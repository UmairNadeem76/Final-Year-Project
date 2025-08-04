import React, { useState, useMemo, useEffect } from 'react';
import './AccountInfo.css';
import useGeneral from '../hooks/useGeneral';
import { useNavigate } from 'react-router-dom';
import { PdfHistoryItem } from '../types';

const AccountInfo: React.FC = () => {
    const { user, loading } = useGeneral();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedScanType, setSelectedScanType] = useState('All');
    const navigate = useNavigate();

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : 'N/A';

    const filteredHistory = useMemo(() => {
        const history = user?.history ?? [];

        const filtered = history.filter(item => {
            const matchesScanType =
                selectedScanType === 'All' || item.scan_type === selectedScanType;

            const matchesResult =
                selectedFilter === 'All' ||
                item.result.toLowerCase().includes(selectedFilter.toLowerCase());

            return matchesScanType && matchesResult;
        });

        return filtered.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [selectedFilter, selectedScanType, user?.history]);

    const generateSegmentationFilename = (filename: string): string => {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex === -1
            ? `${filename}_segmentation`
            : `${filename.substring(0, lastDotIndex)}_segmentation${filename.substring(lastDotIndex)}`;
    };

    return (
        <div className="account-info-container">
            {loading ? (
                <div className="account-card">
                    <div className="account-loading">
                        <div className="account-loading-icon"></div>
                        <div className="account-loading-text">Loading User Information</div>
                        <div className="account-loading-dots">
                            <div className="account-loading-dot"></div>
                            <div className="account-loading-dot"></div>
                            <div className="account-loading-dot"></div>
                        </div>
                    </div>
                </div>
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
                    <label htmlFor="scan-type-filter">Filter by Scan Type:</label>
                    <select
                        id="scan-type-filter"
                        value={selectedScanType}
                        onChange={(e) => {
                            setSelectedScanType(e.target.value);
                            setSelectedFilter('All');
                        }}
                    >
                        <option value="All">All</option>
                        <option value="MRI">MRI</option>
                        <option value="CT">CT</option>
                    </select>

                    <label htmlFor="result-filter">Filter by Result:</label>
                    <select
                        id="result-filter"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {selectedScanType === 'CT' ? (
                            <>
                                <option value="All">All</option>
                                <option value="No Tumor">No Tumor</option>
                                <option value="Tumor">Tumor</option>
                            </>
                        ) : (
                            <>
                                <option value="All">All</option>
                                <option value="No Tumor">No Tumor</option>
                                <option value="Glioma">Glioma</option>
                                <option value="Meningioma">Meningioma</option>
                                <option value="Pituitary">Pituitary</option>
                            </>
                        )}
                    </select>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="no-uploads-message">
                        {user?.history?.length === 0
                            ? 'No Upload History Found. Your Scan Results Will Appear Here.'
                            : 'No Uploads Match The Selected Filter.'
                        }
                    </div>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>File</th>
                                {(selectedScanType === 'MRI' || selectedScanType === 'All') && <th>Segmented File</th>}
                                <th>Date</th>
                                <th>Scan Type</th>
                                <th>Result</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <span
                                            className="clickable-filename"
                                            onClick={() =>
                                                setPreviewUrl(`http://localhost:5000/upload/display/${item.filename}`)
                                            }
                                        >
                                            {item.filename}
                                        </span>
                                    </td>

                                    {(selectedScanType === 'MRI' || selectedScanType === 'All') && (
                                        <td>
                                            {item.scan_type === 'MRI' ? (
                                                <span
                                                    className="clickable-filename"
                                                    onClick={() => {
                                                        const segmentationFilename = generateSegmentationFilename(item.filename);
                                                        setPreviewUrl(`http://localhost:5000/upload/display/${segmentationFilename}`);
                                                    }}
                                                >
                                                    {generateSegmentationFilename(item.filename)}
                                                </span>
                                            ) : (
                                                <span>&nbsp;</span>
                                            )}
                                        </td>
                                    )}

                                    <td>{new Date(item.timestamp).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}</td>
                                    <td>{item.scan_type}</td>
                                    <td>{item.result}</td>
                                    <td>
                                        <button
                                            className="generate-report-btn"
                                            onClick={() => {
                                                const baseUrl = 'http://localhost:5000/upload/display/';
                                                const imageUrl = `${baseUrl}${item.filename}`;

                                                const navigationState = {
                                                    filename: item.filename,
                                                    scanType: item.scan_type,
                                                    scanResult: item.result,
                                                    timestamp: item.timestamp,
                                                    scanImage: imageUrl,
                                                    serverFilename: item.filename,
                                                    ...(item.scan_type === 'MRI' && {
                                                        segmentedImageUrl: `${baseUrl}${generateSegmentationFilename(item.filename)}`
                                                    })
                                                };

                                                navigate('/report-form', {
                                                    state: navigationState
                                                });
                                            }}
                                        >
                                            Generate Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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