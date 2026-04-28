import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { verifyEmail } from "../api/auth.api";

type VerifyStatus = "loading" | "success" | "error";

/* Verify the user's email using the token from the URL */
function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const hasRequestedRef = useRef(false);

    const [status, setStatus] = useState<VerifyStatus>(() =>
        token ? "loading" : "error"
    );
    const [message, setMessage] = useState(() =>
        token ? "Verifying your email..." : "Missing verification token."
    );

    useEffect(() => {
        document.title = "StockWatch | Verify Email";
    }, []);

    useEffect(() => {
        if (!token || hasRequestedRef.current) {
            return;
        }

        hasRequestedRef.current = true;

        const runVerification = async () => {
            try {
                const data = await verifyEmail(token);

                setStatus("success");
                setMessage(data.message || "Your email has been verified successfully.");
            } catch (error: unknown) {
                let errorMessage = "Email verification failed.";

                if (error instanceof AxiosError) {
                    const responseMessage = error.response?.data?.message;

                    if (typeof responseMessage === "string" && responseMessage.trim()) {
                        errorMessage = responseMessage;
                    }
                }

                setStatus("error");
                setMessage(errorMessage);
            }
        };

        void runVerification();
    }, [token]);

    return (
        <section className="auth-page">
            <div className="auth-card modern-card">
                <div className="auth-card-header center">
                    <h1 className="auth-title">Verify Email</h1>
                    <p className="auth-description auth-description-compact">{message}</p>
                </div>

                <div className="auth-form">
                    {status === "loading" ? (
                        <button type="button" className="primary-button large" disabled>
                            Verifying...
                        </button>
                    ) : null}

                    {status === "success" ? (
                        <Link to="/login" className="primary-button auth-link-button large">
                            Continue to sign in
                        </Link>
                    ) : null}

                    {status === "error" ? (
                        <Link to="/register" className="auth-secondary-button centered-link-button">
                            Back to sign up
                        </Link>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default VerifyEmailPage;