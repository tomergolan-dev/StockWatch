import { useState, type ChangeEvent, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";

/* Request a password reset email */
function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* Update the email field */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setErrorMessage("");
        setSuccessMessage("");
    };

    /* Submit the password reset request */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            const data = await forgotPassword({
                email: email.trim(),
            });

            setSuccessMessage(
                data.message || "If the account exists, a password reset email has been sent."
            );
            setEmail("");
        } catch (error: unknown) {
            let serverMessage = "Password reset request failed. Please try again.";

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
            <div className="auth-card">
                <div className="auth-card-header">
                    <p className="auth-eyebrow">Password Recovery</p>
                    <h1 className="auth-title">Forgot Password</h1>
                    <p className="auth-description">
                        Enter your email address and we will send you a password reset link.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                    {successMessage ? <p className="form-success">{successMessage}</p> : null}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending reset link..." : "Send reset link"}
                    </button>

                    <p className="auth-footer-text">
                        Remembered your password? <Link to="/login">Back to login</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}

export default ForgotPasswordPage;