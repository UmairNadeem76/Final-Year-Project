import React, { useState, useMemo, useEffect } from 'react';
import './AccountInfo.css';
import useGeneral from '../hooks/useGeneral';
import { PdfHistoryItem } from '../types';

const AccountInfo: React.FC = () => {
    const { user, loading } = useGeneral();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedPdfFilter, setSelectedPdfFilter] = useState('All');
    const [showPdfHistory, setShowPdfHistory] = useState(false);
    const [pdfHistory, setPdfHistory] = useState<PdfHistoryItem[]>([]);
    const [pdfLoading, setPdfLoading] = useState(false);

    // Fetch PDF history from API
    const fetchPdfHistory = async () => {
        if (!user) return;

        setPdfLoading(true);

        try {
            const response = await fetch('http://localhost:5000/users/pdf-history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PDF history');
            }

            const data = await response.json();
            setPdfHistory(data);
        } catch (error) {
            // Silently handle error - no user notification
        } finally {
            setPdfLoading(false);
        }
    };

    // Fetch PDF history when user is available and PDF history tab is shown
    useEffect(() => {
        if (user && showPdfHistory) {
            fetchPdfHistory();
        }
    }, [user, showPdfHistory]);

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

    const filteredPdfHistory = useMemo(() => {
        const filtered = selectedPdfFilter === 'All'
            ? pdfHistory
            : pdfHistory.filter(pdf => pdf.category === selectedPdfFilter);

        return filtered.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [selectedPdfFilter, pdfHistory]);

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : 'N/A';

    const handleDownloadPdf = async (pdfData: PdfHistoryItem) => {
        try {
            const response = await fetch(`http://localhost:5000/users/download-pdf/${pdfData._id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = pdfData.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Failed to download PDF. Please try again later.');
        }
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

            {/* Toggle Button */}
            <div className="history-toggle-section">
                <button
                    className={`toggle-button ${!showPdfHistory ? 'active' : ''}`}
                    onClick={() => setShowPdfHistory(false)}
                >
                    Upload History
                </button>
                <button
                    className={`toggle-button ${showPdfHistory ? 'active' : ''}`}
                    onClick={() => setShowPdfHistory(true)}
                >
                    PDF History
                </button>
            </div>

            {/* Upload History Section */}
            {!showPdfHistory && (
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
                                            minute: '2-digit',
                                            hour12: true
                                        })}</td>
                                        <td>{item.result}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* PDF History Section */}
            {showPdfHistory && (
                <div className="history-section">
                    <h2>PDF History & Results</h2>

                    {pdfLoading ? (
                        <div className="pdf-loading">
                            <div className="loading-icon"></div>
                            <div className="loading-text">Loading PDF History...</div>
                        </div>
                    ) : (
                        <>
                            <div className="filter-bar">
                                <label htmlFor="pdf-filter">Filter by Category:</label>
                                <select
                                    id="pdf-filter"
                                    value={selectedPdfFilter}
                                    onChange={(e) => setSelectedPdfFilter(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="MRI">MRI</option>
                                    <option value="CT-Scan">CT-Scan</option>
                                </select>
                            </div>

                            {filteredPdfHistory.length === 0 ? (
                                <div className="no-pdfs-message">
                                    {pdfHistory.length === 0
                                        ? 'No PDF Reports Found. Your Generated Reports Will Appear Here.'
                                        : 'No PDFs Match The Selected Filter.'
                                    }
                                </div>
                            ) : (
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>PDF File</th>
                                            <th>Date Generated</th>
                                            <th>Category</th>
                                            <th>Scan Result</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPdfHistory.map((pdf) => (
                                            <tr key={pdf._id}>
                                                <td>
                                                    <span className="pdf-filename">
                                                        {pdf.filename}
                                                    </span>
                                                </td>
                                                <td>{new Date(pdf.date).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}</td>
                                                <td>{pdf.category}</td>
                                                <td>{pdf.scanResult}</td>
                                                <td>
                                                    <button
                                                        className="download-pdf-button"
                                                        onClick={() => handleDownloadPdf(pdf)}
                                                    >
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            )}

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
