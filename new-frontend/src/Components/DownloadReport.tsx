import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DownloadReport.css';
import useGeneral from '../hooks/useGeneral';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../Assets/logo_new.png';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineScanner } from 'react-icons/md';
import testScanImage from '../Assets/Te-pi_0063.jpg';

interface ReportData {
    formData: {
        name: string;
        email: string;
        dateOfBirth: string;
        calculatedAge: string;
        gender: string;
        scanType: string;
        emergencyContact: string;
        emergencyPhone: string;
        relationship: string;
    };
    scanResult: string;
    scanImage: string | null;
    patientName: string;
    patientEmail: string;
}

const DownloadReport: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useGeneral();
    const [isGenerating, setIsGenerating] = useState(false);
    const reportPreviewRef = useRef<HTMLDivElement>(null);

    const reportData: ReportData | null = location.state?.formData ? {
        formData: location.state.formData,
        scanResult: location.state.scanResult,
        scanImage: location.state.scanImage,
        patientName: location.state.patientName,
        patientEmail: location.state.patientEmail
    } : null;

    useEffect(() => {
        // Temporarily disabled for testing - will be re-enabled later
        // if (!isLoggedIn) {
        //     navigate('/login-signup');
        //     return;
        // }

        if (!reportData) {
            navigate('/home');
            return;
        }
    }, [isLoggedIn, reportData, navigate]);

    const downloadPDF = async () => {
        if (!reportPreviewRef.current) {
            alert("Could not capture the report preview.");
            return;
        }
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(reportPreviewRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // A4 dimensions in points
            const pdfWidth = 595.28;
            const pdfHeight = 841.89;

            // Virtually zero margins (0.05 inch = 3.6 points)
            const margin = 3.6; // 0.05 inch margin
            const contentWidth = pdfWidth - (2 * margin); // Width minus left and right margins
            const contentHeight = pdfHeight - (2 * margin); // Height minus top and bottom margins

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            // Scale the preview to fit within the content area (absolute maximum size)
            let finalPdfWidth, finalPdfHeight;

            if (canvasAspectRatio > contentWidth / contentHeight) {
                // Preview is wider - fit to content width (absolute maximum width usage)
                finalPdfWidth = contentWidth;
                finalPdfHeight = contentWidth / canvasAspectRatio;
            } else {
                // Preview is taller - fit to content height (absolute maximum height usage)
                finalPdfHeight = contentHeight;
                finalPdfWidth = contentHeight * canvasAspectRatio;
            }

            // Position with virtually zero margins
            const xOffset = margin + (contentWidth - finalPdfWidth) / 2; // Center within content area
            const yOffset = margin + (contentHeight - finalPdfHeight) / 2; // Center within content area

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            doc.addImage(imgData, 'JPEG', xOffset, yOffset, finalPdfWidth, finalPdfHeight);

            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}_${month}_${year}`;

            const fileName = `${reportData?.patientName?.replace(/\s+/g, '_')}_medical_report_${formattedDate}.pdf`;

            doc.save(fileName);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Temporarily disabled for testing - will be re-enabled later
    // if (!isLoggedIn || !reportData) {
    //     return null;
    // }

    if (!reportData) {
        return (
            <div className="dr-container">
                <div className="dr-wrapper">
                    <div className="dr-header">
                        <h1>No Report Data</h1>
                        <p>Please generate a report first by filling out the form.</p>
                        <button
                            onClick={() => navigate('/report-form')}
                            className="dr-generate-button"
                        >
                            Go to Report Form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className="dr-container">
            <div className="dr-wrapper">
                <div className="dr-header">
                    <h1>Medical Report Generated</h1>
                    <p>Your comprehensive medical report has been prepared successfully.</p>
                </div>

                <div className="dr-preview">
                    <div className="dr-content" ref={reportPreviewRef}>
                        <div className="report-header">
                            <div className="header-left">
                                <img src={logo} alt="Logo" className="header-logo" />
                                <div className="header-title-section">
                                    <h1 className="main-title">Brain Tumor Detection Using AI</h1>
                                    <div className="header-subtitle">
                                        <MdOutlineScanner className="subtitle-icon" />
                                        <span>MRI | CT-Scan</span>
                                    </div>
                                    <div className="header-address">
                                        <FaMapMarkerAlt className="address-icon" />
                                        <span>ST-16 Main University Rd, Block 5 Gulshan-e-Iqbal, Karachi</span>
                                    </div>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="contact-group">
                                    <div className="contact-info">
                                        <FaPhone className="contact-icon" />
                                        <span>021-34988000</span>
                                    </div>
                                    <div className="contact-info">
                                        <FaEnvelope className="contact-icon" />
                                        <span>support@btd.ai</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-bar"></div>

                        <div className="patient-info-bar">
                            <div className="patient-name">{reportData.patientName}</div>
                            <div className="patient-meta-container">
                                <div className="patient-details">
                                    <span className="meta-label">PATIENT INFO: </span>
                                    <span className="meta-value">{reportData.formData.calculatedAge} / {reportData.formData.gender}</span>
                                </div>
                                <div className="report-ids">
                                    <div className="id-item">
                                        <span className="id-label">Patient ID: </span>
                                        <span className="id-value">{reportData.patientName?.replace(/\s+/g, '').toLowerCase()}-{Date.now()}</span>
                                    </div>
                                    <div className="id-item">
                                        <span className="id-label">Report ID: </span>
                                        <span className="id-value">{Date.now()}</span>
                                    </div>
                                </div>
                                <div className="report-date">
                                    <span className="date-label">Reported On: </span>
                                    <span className="date-value">{formatDateTime(new Date())}</span>
                                </div>
                            </div>
                        </div>

                        <div className="report-body">
                            {reportData.scanImage || testScanImage ? (
                                <div className="scan-image-container">
                                    <img src={testScanImage} alt="Scan" className="scan-image" />
                                </div>
                            ) : null}
                            <h2 className="section-title">{reportData.formData.scanType === 'MRI' ? 'MRI Image' : 'CT-Scan Image'}</h2>

                            <div className="dr-scan-section">
                                <h3>Scan Analysis Results</h3>
                                <div className="dr-scan-result">
                                    <div className="dr-result-item">
                                        <span className="label">Scan Type: </span>
                                        <span className="value">{reportData.formData.scanType}</span>
                                    </div>
                                    <div className="dr-result-item">
                                        <span className="label">AI Analysis Result: </span>
                                        <span className="value result">{reportData.scanResult}</span>
                                    </div>
                                    <div className="dr-result-item">
                                        <span className="label">Analysis Date: </span>
                                        <span className="value">{formatDate(new Date())}</span>
                                    </div>
                                </div>
                            </div>

                            {(reportData.formData.emergencyContact || reportData.formData.emergencyPhone || reportData.formData.relationship) && (
                                <div className="dr-emergency-section">
                                    <h3>Emergency Contact Information</h3>
                                    <div className="dr-emergency-info">
                                        <div className="dr-info-item">
                                            <span className="label">Name: </span>
                                            <span className="value">{reportData.formData.emergencyContact || 'Unknown'}</span>
                                        </div>
                                        <div className="dr-info-item">
                                            <span className="label">Phone: </span>
                                            <span className="value">{reportData.formData.emergencyPhone || 'Unknown'}</span>
                                        </div>
                                        <div className="dr-info-item">
                                            <span className="label">Relationship: </span>
                                            <span className="value">{reportData.formData.relationship || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="dr-disclaimer-section">
                                <h3>Important Disclaimers</h3>
                                <div className="dr-disclaimer-content">
                                    <p><strong>Medical Disclaimer:</strong> This report is generated by an AI system and should not be considered as a final medical diagnosis. Always consult with a qualified healthcare professional for proper medical evaluation and treatment.</p>
                                    <p><strong>Confidentiality:</strong> This report contains sensitive medical information and should be handled with appropriate confidentiality measures.</p>
                                    <p><strong>Accuracy:</strong> While our AI system strives for accuracy, results should be verified by medical professionals before making any treatment decisions.</p>
                                </div>
                            </div>

                            <div className="report-final-notes">
                                <p>Report generated by Brain Tumor Detection AI System</p>
                                <p>For questions or concerns, please contact your healthcare consultant</p>
                            </div>
                        </div>

                        <div className="report-footer">
                            <div className="gradient-bar-footer"></div>
                            <div className="footer-content">
                                <span>Report generated on: {formatDateTime(new Date())}</span>
                                <span>Page 1 of 1</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="dr-actions">
                    <div className="dr-download-section">
                        <button
                            onClick={downloadPDF}
                            className="dr-download-button"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Downloading...' : 'Download PDF Report'}
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="dr-back-button"
                        >
                            Back to Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadReport; 