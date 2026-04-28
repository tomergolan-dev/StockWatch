import {useState, type ChangeEvent, type FormEvent, useEffect} from "react";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

/* Handle user login through the authentication API */
function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "StockWatch | Login";
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const data = await loginUser(form);

            login({
                token: data.token,
                user: data.user,
            });

            navigate("/");
        } catch (error: unknown) {
            let serverMessage = "Login failed. Please try again.";

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
                    <h1 className="auth-title">Sign In</h1>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() => setShowPassword((current) => !current)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {errorMessage && <p className="form-error">{errorMessage}</p>}

                    <button
                        type="submit"
                        className="primary-button large"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="auth-footer-group">
                        <p className="auth-footer-text">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </p>

                        <p className="auth-footer-text">
                            No account? <Link to="/register">Sign up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default LoginPage;