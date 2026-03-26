import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";

type RegisterForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type PasswordRule = {
    label: string;
    isValid: boolean;
};

const initialForm: RegisterForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

/* Handle user registration with live client-side validation */
function RegisterPage() {
    const [form, setForm] = useState<RegisterForm>(initialForm);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRules = useMemo<PasswordRule[]>(
        () => [
            {
                label: "8+ characters",
                isValid: form.password.length >= 8,
            },
            {
                label: "Up to 64 characters",
                isValid: form.password.length <= 64,
            },
            {
                label: "Uppercase letter",
                isValid: /[A-Z]/.test(form.password),
            },
            {
                label: "Lowercase letter",
                isValid: /[a-z]/.test(form.password),
            },
            {
                label: "Number",
                isValid: /[0-9]/.test(form.password),
            },
            {
                label: "Special character",
                isValid: /[^A-Za-z0-9]/.test(form.password),
            },
        ],
        [form.password]
    );

    const isPasswordValid = passwordRules.every((rule) => rule.isValid);
    const isConfirmPasswordValid =
        form.confirmPassword.length > 0 && form.password === form.confirmPassword;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!isPasswordValid) {
            setErrorMessage("Please meet all password requirements before continuing.");
            return;
        }

        if (!isConfirmPasswordValid) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await registerUser({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            setSuccessMessage(
                data.message || "Registration successful. Please check your email to verify your account."
            );
            setForm(initialForm);
        } catch (error: unknown) {
            let serverMessage = "Registration failed. Please try again.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-card auth-card-wide modern-card">
                <div className="auth-card-header center">
                    <h1 className="auth-title">Sign Up</h1>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-grid">
                        <div className="form-field">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={form.firstName}
                                onChange={handleChange}
                                autoComplete="given-name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={handleChange}
                                autoComplete="family-name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {form.password ? (
                            <div className="password-rules compact">
                                {passwordRules.map((rule) => (
                                    <div
                                        key={rule.label}
                                        className={`password-rule ${rule.isValid ? "valid" : "invalid"}`}
                                    >
                                        <span className="password-rule-icon">
                                            {rule.isValid ? "✔" : "✕"}
                                        </span>
                                        <span>{rule.label}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="form-field">
                        <div className="password-input-wrapper">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() => setShowConfirmPassword((current) => !current)}
                                aria-label={
                                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {form.confirmPassword ? (
                            <p
                                className={`password-match-message ${
                                    isConfirmPasswordValid ? "valid" : "invalid"
                                }`}
                            >
                                {isConfirmPasswordValid ? "✔ Passwords match" : "✕ Passwords do not match"}
                            </p>
                        ) : null}
                    </div>

                    {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                    {successMessage ? <p className="form-success">{successMessage}</p> : null}

                    <button
                        type="submit"
                        className="primary-button large"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}

export default RegisterPage;