import React, { useState } from 'react';
import './Home.css';
import useGeneral from '../hooks/useGeneral';
import { useNavigate } from 'react-router-dom';

const CTScanUpload: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { setUploadHistory, uploadHistory, isLoggedIn } = useGeneral();
    const navigate = useNavigate();

    const resetAll = () => {
        setImage(null);
        setImageUrl(null);
        setFileDetails(null);
        setProgress(0);
        setSuccess(false);
        setPrediction(null);
        setError(null);
    };

    const formatSize = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2) + ' MB';
    };

    const handleImageChange = (file: File) => {
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setFileDetails({ name: file.name, size: formatSize(file.size) });
            setProgress(0);
            setSuccess(false);
            setPrediction(null);
        } else {
            alert('Please upload a PNG or JPEG image.');
            resetAll();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
        const file = event.dataTransfer.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleSubmit = async () => {
        if (!image) return;

        if (!isLoggedIn) {
            setError('You must be logged in to upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            setProgress(1);
            const uploadProgress = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(uploadProgress);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 30);

            // Use CT-Scan model endpoint
            const response = await fetch('http://localhost:5000/upload-ctscan', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            clearInterval(uploadProgress);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const data = await response.json();
            setProgress(100);
            setSuccess(true);
            setPrediction(data.prediction);

            setUploadHistory([
                ...uploadHistory,
                {
                    id: Date.now(),
                    filename: image.name,
                    date: new Date().toISOString(),
                    result: data.prediction,
                    imageUrl: imageUrl,
                }
            ]);

        } catch (err: any) {
            setError(err.message || 'Upload failed');
        }
    };

    return (
        <div className="home-container" id="upload-ctscan">
            <video autoPlay muted loop playsInline className="upload-background-video">
                <source src={require('../Assets/mri_video1.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className={`upload-box ${dragOver ? 'drag-over' : ''} ${image ? 'image-present' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {imageUrl ? (
                    <div className="preview-container">
                        <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
                        {fileDetails && (
                            <div className="file-info">
                                <p><strong>File:</strong> {fileDetails.name}</p>
                                <p><strong>Size:</strong> {fileDetails.size}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="upload-message">
                        <p>Drag And Drop An Image Here Or Click 'Browse'</p>
                        <p>Supported Formats: PNG, JPEG</p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="file-input"
                    id="file-upload-ctscan"
                />
                {!image && (
                    <label htmlFor="file-upload-ctscan" className="browse-button">
                        Browse
                    </label>
                )}
            </div>

            {(image && !success && !error) && (
                <div className="button-group">
                    <button
                        className={`upload-submit-button ${image ? 'enabled' : ''}`}
                        onClick={handleSubmit}
                        disabled={!image}
                    >
                        Submit
                    </button>
                    <button className="upload-cancel-button" onClick={resetAll}>
                        Cancel
                    </button>
                </div>
            )}

            {(success || error) && (
                <div className="button-group">
                    <button
                        className="upload-again-button"
                        onClick={resetAll}
                    >
                        Upload Again?
                    </button>
                </div>
            )}

            {progress > 0 && progress < 100 && (
                <div className="progress-wrapper">
                    <div className="progress-label">Uploading: {progress}%</div>
                    <div className="progress-bar-wrapper">
                        <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            {success && prediction && (
                <div className="upload-success-popup">
                    ✅ Image Uploaded Successfully<br />
                    <strong>Prediction:</strong> {prediction}
                    <div className="report-actions">
                        <button
                            className="download-report-button"
                            onClick={() => navigate('/report-form', {
                                state: {
                                    scanResult: prediction,
                                    scanImage: imageUrl,
                                    scanType: 'CT-Scan'
                                }
                            })}
                        >
                            Download Report
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="upload-success-popup" style={{ color: 'salmon' }}>
                    ❌ {error}
                </div>
            )}
        </div>
    );
};

export default CTScanUpload; 