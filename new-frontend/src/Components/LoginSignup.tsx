import React, { useState } from 'react';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import loginBg from '../Assets/login_background1 - Copy.png';
import useGeneral from '../hooks/useGeneral';

interface SignupFormData {
    fullName: string;
    email: string;
    password: string;
}

interface LoginFormData {
    email: string;
    password: string;
}

const LoginSignup: React.FC = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState<'Signup' | 'Login'>("Signup");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { setIsLoggedIn, setUser } = useGeneral();

    const evaluatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length > 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        switch (strength) {
            case 0:
            case 1: return "Weak";
            case 2: return "Moderate";
            case 3:
            case 4: return "Strong";
            default: return "";
        }
    };

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const signupSchema = z.object({
        fullName: z.string().min(1, "Full Name Is Required"),
        email: z.string().email("Please Enter A Valid Email Address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.")
            .regex(/[A-Z]/, "Password must include at least one Uppercase Letter.")
            .regex(/[a-z]/, "Password must include at least one Lowercase Letter.")
            .regex(/[0-9]/, "Password Must Include At Least One Number."),
    });

    const loginSchema = z.object({
        email: z.string().email("Please Enter A Valid Email Address"),
        password: z.string().min(8, "Password Must Be At Least 8 Characters Long"),
    });

    const schema = action === "Signup" ? signupSchema : loginSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SignupFormData | LoginFormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const onSubmit: SubmitHandler<SignupFormData | LoginFormData> = async (data) => {
        try {
            const endpoint =
                action === "Signup"
                    ? "http://localhost:5000/users/register"
                    : "http://localhost:5000/users/login";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    action === "Signup"
                        ? {
                            name: (data as SignupFormData).fullName,
                            email: data.email,
                            password: data.password,
                        }
                        : {
                            email: data.email,
                            password: data.password,
                        }
                ),
            });

            const result = await response.json();
            console.log("Auth response result:", result);

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            if (action === "Signup") {
                setSuccessMessage("Signup Successful. Please login ✅");
                setAction("Login");
            } else {
                const userResponse = await fetch("http://localhost:5000/users/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const userData = await userResponse.json();
                console.log("Fetched user data:", userData);

                if (!userResponse.ok) {
                    throw new Error(userData.message || "Failed to fetch user data");
                }

                setIsLoggedIn(true);
                setUser(userData);

                setSuccessMessage("Login Successful ✅");
                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            }
        } catch (error: any) {
            console.error("Error:", error);
            setSuccessMessage(error.message || "An error occurred. Please try again.");
        } finally {
            reset();
            setPasswordStrength("");
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="form-section">
                <div className='container'>
                    <div className="tab-header">
                        <div
                            className={`tab ${action === "Signup" ? "active-tab" : ""}`}
                            onClick={() => setAction("Signup")}
                        >
                            Signup
                        </div>
                        <div
                            className={`tab ${action === "Login" ? "active-tab" : ""}`}
                            onClick={() => setAction("Login")}
                        >
                            Login
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="inputs">
                        {action === "Signup" && (
                            <div className="input-wrapper">
                                <div className="input">
                                    <img src={user_icon} alt="User Icon" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        {...register("fullName")}
                                    />
                                </div>
                                {errors && 'fullName' in errors && (
                                    <div className="error-message">
                                        {(errors as FieldErrors<SignupFormData>).fullName?.message}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="input-wrapper">
                            <div className="input input-with-error">
                                <img src={email_icon} alt="Email Icon" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <div className="error-message">{errors.email.message}</div>
                            )}
                        </div>

                        <div className="input-wrapper">
                            <div className="input password-input">
                                <img src={password_icon} alt="Password Icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    {...register("password", {
                                        onChange: (e) => {
                                            const value = e.target.value;
                                            setPasswordStrength(evaluatePasswordStrength(value));
                                        }
                                    })}
                                />
                                <span className="toggle-password" onClick={togglePasswordVisibility}>
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                            {action === "Signup" && passwordStrength && (
                                <div className={`strength-meter ${passwordStrength.toLowerCase()}`}>
                                    Strength: {passwordStrength}
                                </div>
                            )}
                            {errors.password && (
                                <div className="error-message">{errors.password.message}</div>
                            )}
                        </div>

                        {action === "Login" && (
                            <div className="forgot-password">Forgot Password? <span>Click Here</span></div>
                        )}

                        <button type="submit" className="submit-button">
                            {action === "Signup" ? "Create Account" : "Log In"}
                        </button>

                        {successMessage && (
                            <div className="success-popup">{successMessage}</div>
                        )}
                    </form>
                </div>
            </div>
            <div className="image-section">
                <img src={loginBg} alt="Login Visual" />
            </div>
        </div>
    );
};

export default LoginSignup;
