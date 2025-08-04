import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, FieldErrors, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReportForm.css';
import useGeneral from '../hooks/useGeneral';
import { FaUser, FaVenusMars, FaStethoscope, FaClipboardList, FaFileMedical, FaCapsules, FaAllergies, FaUserShield, FaPhone, FaLink, FaEnvelope, FaCalendarAlt, FaBirthdayCake, FaBrain } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ReportFormData {
    name: string;
    email: string;
    dateOfBirth: string;
    calculatedAge: string;
    gender: string;
    scanType: string;
}

const ReportForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useGeneral();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [calculatedAge, setCalculatedAge] = useState<string>('');

    // Get data from location state - this can come from either upload pages or account info
    const locationState = location.state || {};

    // Extract scan data - handling both direct upload and account info navigation
    const scanResult = locationState.scanResult || 'No Tumor Detected';
    const serverFilename = locationState.serverFilename || null;
    const scanImage = `http://localhost:5000/upload/display/${serverFilename}`
    const scanType = locationState.scanType || 'MRI';
    const segmentedImageUrl =
    scanType === 'MRI' && serverFilename
        ? `http://localhost:5000/upload/display/${serverFilename.replace(/\.(jpg|jpeg|png)$/i, '')}_segmentation.jpg`
        : null;
    // Function to calculate age from date of birth
    const calculateAge = (dateOfBirth: string): string => {
        if (!dateOfBirth) return '';

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust for negative months or days
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years}Y - ${months}M - ${days}D`;
    };

    const reportSchema = z.object({
        name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
        email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
        dateOfBirth: z.string().min(1, "Date of birth is required").refine((val) => {
            if (!val) return false;
            const birthDate = new Date(val);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 0 && age <= 120;
        }, "Please enter a valid date of birth (age must be between 0 and 120)"),
        calculatedAge: z.string(),
        gender: z.string().min(1, "Gender is required"),
        scanType: z.string().min(1, "Scan type is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
        control
    } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        mode: "onChange"
    });

    // Watch date of birth changes to calculate age
    const watchedDateOfBirth = watch("dateOfBirth");

    useEffect(() => {
        if (watchedDateOfBirth) {
            const age = calculateAge(watchedDateOfBirth);
            setCalculatedAge(age);
            setValue('calculatedAge', age);
        } else {
            setCalculatedAge('');
            setValue('calculatedAge', '');
        }
    }, [watchedDateOfBirth, setValue]);

    // Auto-fill scan type when component mounts
    useEffect(() => {
        setValue('scanType', scanType);
    }, [scanType, setValue]);

    // Redirect if not logged in
    useEffect(() => {
        // Temporarily disabled for testing - will be re-enabled later
        // if (!isLoggedIn) {
        //     navigate('/login-signup');
        // }
    }, [isLoggedIn, navigate]);

    const onSubmit: SubmitHandler<ReportFormData> = (data) => {


        // Prepare navigation state with all image data
        const navigationState = {
            formData: data,
            scanResult: scanResult,
            scanImage: scanImage,
            patientName: data.name,
            patientEmail: data.email,
            scanType: data.scanType,
            // Include segmented image URL for MRI scans
            ...(segmentedImageUrl && { segmentedImageUrl })
        };


        // Navigate to download page with form data and image URLs
        navigate('/download-report', {
            state: navigationState
        });
    };

    // Temporarily disabled for testing - will be re-enabled later
    // if (!isLoggedIn) {
    //     return null;
    // }

    return (
        <div className="rf-container">
            <div className="rf-wrapper">
                <div className="rf-header">
                    <h1>Generate Medical Report</h1>
                    <p>Please provide the following information to generate your comprehensive medical report.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="rf-form">
                    <div className="rf-form-section">
                        <h3>Patient Information</h3>
                        <div className="rf-form-group">
                            <label htmlFor="name">Full Name *</label>
                            <div className="rf-input-wrapper">
                                <FaUser className="icon" />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    {...register("name")}
                                    className={errors.name ? 'error' : ''}
                                />
                            </div>
                            {errors.name && <span className="rf-error-message">{errors.name.message}</span>}
                        </div>
                        <div className="rf-form-group">
                            <label htmlFor="email">Email Address *</label>
                            <div className="rf-input-wrapper">
                                <FaEnvelope className="icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email address"
                                    {...register("email")}
                                    className={errors.email ? 'error' : ''}
                                />
                            </div>
                            {errors.email && <span className="rf-error-message">{errors.email.message}</span>}
                        </div>
                        <div className="rf-form-group">
                            <label htmlFor="dateOfBirth">Date of Birth *</label>
                            <div className="rf-input-wrapper">
                                <FaCalendarAlt className="icon" />
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            id="dateOfBirth"
                                            selected={field.value ? new Date(field.value + 'T00:00:00') : null}
                                            onChange={(date) => {
                                                if (date) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    const dateString = `${year}-${month}-${day}`;
                                                    field.onChange(dateString);
                                                } else {
                                                    field.onChange('');
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="dd/mm/yyyy"
                                            maxDate={new Date()}
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                            className="custom-datepicker-input"
                                            autoComplete="off"
                                        />
                                    )}
                                />
                            </div>
                            {errors.dateOfBirth && <p className="rf-error-message">{errors.dateOfBirth.message}</p>}
                        </div>
                        {calculatedAge && (
                            <div className="rf-form-group">
                                <label>Calculated Age</label>
                                <div className="rf-input-wrapper">
                                    <FaUser className="icon" />
                                    <input
                                        type="text"
                                        value={calculatedAge}
                                        readOnly
                                        className="readonly"
                                        placeholder="Age will be calculated automatically"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="rf-form-group">
                            <label htmlFor="gender">Gender *</label>
                            <div className="rf-input-wrapper">
                                <FaVenusMars className="icon" />
                                <select
                                    id="gender"
                                    {...register("gender")}
                                    className={errors.gender ? 'error' : ''}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            {errors.gender && <span className="rf-error-message">{errors.gender.message}</span>}
                        </div>
                        <div className="rf-form-group">
                            <label htmlFor="scanType">Type of Scan</label>
                            <div className="rf-input-wrapper">
                                <FaStethoscope className="icon" />
                                <input
                                    type="text"
                                    id="scanType"
                                    {...register("scanType")}
                                    readOnly
                                    className="readonly"
                                    placeholder={scanType}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rf-submit-section">
                        <button
                            type="submit"
                            className="rf-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Generating Report...' : 'Generate Report'}
                        </button>
                    </div>

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ReportForm;