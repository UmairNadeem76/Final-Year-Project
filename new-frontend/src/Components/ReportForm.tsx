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
    emergencyContact: string;
    emergencyPhone: string;
    relationship: string;
}

const ReportForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useGeneral();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [calculatedAge, setCalculatedAge] = useState<string>('');

    // Get scan result from location state (passed from Home component)
    const scanResult = location.state?.scanResult || 'No Tumor Detected';
    const scanImage = location.state?.scanImage || null;

    // Determine scan type based on scan result or default to MRI
    const getScanType = () => {
        // This would be determined by the actual scan type used
        // For now, we'll default to MRI, but this should come from the scan process
        return 'MRI';
    };

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
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        relationship: z.string().optional(),
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

    // Auto-fill user data when component mounts
    useEffect(() => {
        // Set scan type based on the scan that was performed
        setValue('scanType', getScanType());
    }, [setValue]);

    // Redirect if not logged in
    useEffect(() => {
        // Temporarily disabled for testing - will be re-enabled later
        // if (!isLoggedIn) {
        //     navigate('/login-signup');
        // }
    }, [isLoggedIn, navigate]);

    const onSubmit: SubmitHandler<ReportFormData> = (data) => {
        console.log('Form submitted:', data);

        // Navigate to download page with form data
        navigate('/download-report', {
            state: {
                formData: data,
                scanResult: scanResult,
                scanImage: scanImage,
                patientName: data.name,
                patientEmail: data.email
            }
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

                <div className="rf-patient-info-summary">
                    <h3>Scan Information</h3>
                    <div className="rf-info-grid">
                        <div className="rf-info-item">
                            <span className="label">Scan Result:</span>
                            <span className="value result">{scanResult}</span>
                        </div>
                        <div className="rf-info-item">
                            <span className="label">Scan Type:</span>
                            <span className="value">{getScanType()}</span>
                        </div>
                    </div>
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
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
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
                                    placeholder={getScanType()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rf-form-section">
                        <h3>Emergency Contact (Optional)</h3>
                        <div className="rf-form-group">
                            <label htmlFor="emergencyContact">Emergency Contact Name</label>
                            <div className="rf-input-wrapper">
                                <FaUserShield className="icon" />
                                <input
                                    type="text"
                                    id="emergencyContact"
                                    placeholder="Full name"
                                    {...register("emergencyContact")}
                                    className={errors.emergencyContact ? 'error' : ''}
                                />
                            </div>
                            {errors.emergencyContact && <span className="rf-error-message">{errors.emergencyContact.message}</span>}
                        </div>
                        <div className="rf-form-group">
                            <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
                            <div className="rf-input-wrapper">
                                <FaPhone className="icon" />
                                <input
                                    type="tel"
                                    id="emergencyPhone"
                                    placeholder="Phone number"
                                    {...register("emergencyPhone")}
                                    className={errors.emergencyPhone ? 'error' : ''}
                                />
                            </div>
                            {errors.emergencyPhone && <span className="rf-error-message">{errors.emergencyPhone.message}</span>}
                        </div>
                        <div className="rf-form-group">
                            <label htmlFor="relationship">Relationship</label>
                            <div className="rf-input-wrapper">
                                <FaLink className="icon" />
                                <select
                                    id="relationship"
                                    {...register("relationship")}
                                    className={errors.relationship ? 'error' : ''}
                                >
                                    <option value="">Select Relationship</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Child">Child</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Friend">Friend</option>
                                    <option value="No Relation">No Relation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {errors.relationship && <span className="rf-error-message">{errors.relationship.message}</span>}
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