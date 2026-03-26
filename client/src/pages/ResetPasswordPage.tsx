import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword, validateResetToken } from "../api/auth.api";

type ResetForm = {
    password: string;
    confirmPassword: string;
};

type PasswordRule = {
    label: string;
    isValid: boolean;
};

type ResetStatus = "checking" | "form" | "success" | "invalid";

const initialForm: ResetForm = {
    password: "",
    confirmPassword: "",
};

/* Reset the password using the token from the URL */
function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const hasValidatedRef = useRef(false);

    const [form, setForm] = useState<ResetForm>(initialForm);
    const [status, setStatus] = useState<ResetStatus>(token ? "checking" : "invalid");
    const [errorMessage, setErrorMessage] = useState(token ? "" : "Missing reset token.");
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

    useEffect(() => {
        if (!token || hasValidatedRef.current) {
            return;
        }

        hasValidatedRef.current = true;

        const runValidation = async () => {
            try {
                const data = await validateResetToken(token);

                if (!data.valid) {
                    setStatus("invalid");
                    setErrorMessage(data.message || "This reset link is invalid or has expired.");
                    return;
                }

                setStatus("form");
            } catch (error: unknown) {
                let serverMessage = "This reset link is invalid or has expired.";

                if (error instanceof AxiosError) {
                    const responseMessage = error.response?.data?.message;

                    if (typeof responseMessage === "string" && responseMessage.trim()) {
                        serverMessage = responseMessage;
                    }
                }

                setStatus("invalid");
                setErrorMessage(serverMessage);
            }
        };

        void runValidation();
    }, [token]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setErrorMessage("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!token) {
            setErrorMessage("Missing reset token.");
            return;
        }

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
            const data = await resetPassword({
                token,
                password: form.password,
            });

            setSuccessMessage(
                data.message || "Password updated successfully. You can now sign in."
            );
            setStatus("success");
            setForm(initialForm);
        } catch (error: unknown) {
            let serverMessage = "Password reset failed. Please try again.";

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
            <div className="auth-card modern-card">
                <div className="auth-card-header center">
                    <h1 className="auth-title">Set New Password</h1>
                    <p className="auth-description auth-description-compact">
                        {status === "checking"
                            ? "Checking your reset link..."
                            : status === "success"
                                ? successMessage
                                : status === "invalid"
                                    ? errorMessage
                                    : "Create a new password for your account."}
                    </p>
                </div>

                {status === "checking" ? (
                    <div className="auth-form">
                        <button type="button" className="primary-button large" disabled>
                            Validating link...
                        </button>
                    </div>
                ) : null}

                {status === "invalid" ? (
                    <div className="auth-form">
                        <Link to="/forgot-password" className="primary-button auth-link-button large">
                            Request new reset link
                        </Link>
                    </div>
                ) : null}

                {status === "success" ? (
                    <div className="auth-form">
                        <Link to="/login" className="primary-button auth-link-button large">
                            Continue to sign in
                        </Link>
                    </div>
                ) : null}

                {status === "form" ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New password"
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
                                    placeholder="Confirm new password"
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

                        <button
                            type="submit"
                            className="primary-button large"
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? "Updating password..." : "Update password"}
                        </button>

                        <p className="auth-footer-text">
                            Back to <Link to="/login">sign in</Link>
                        </p>
                    </form>
                ) : null}
            </div>
        </section>
    );
}

export default ResetPasswordPage;