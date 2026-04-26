import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { changeMyPassword } from "../../api/user.api";

type PasswordChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type PasswordRule = {
    label: string;
    isValid: boolean;
};

function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
    const [isSaving, setIsSaving] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /* 🔥 password validation כמו register */
    const passwordRules = useMemo<PasswordRule[]>(
        () => [
            { label: "8+ characters", isValid: newPassword.length >= 8 },
            { label: "Up to 64 characters", isValid: newPassword.length <= 64 },
            { label: "Uppercase letter", isValid: /[A-Z]/.test(newPassword) },
            { label: "Lowercase letter", isValid: /[a-z]/.test(newPassword) },
            { label: "Number", isValid: /[0-9]/.test(newPassword) },
            { label: "Special character", isValid: /[^A-Za-z0-9]/.test(newPassword) },
        ],
        [newPassword]
    );

    const isPasswordValid = passwordRules.every((rule) => rule.isValid);

    const isConfirmValid =
        confirmPassword.length > 0 && confirmPassword === newPassword;

    const canSubmit =
        currentPassword.trim() &&
        isPasswordValid &&
        isConfirmValid &&
        !isSaving;

    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;
            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }
        return "Failed to update password.";
    };

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    };

    const handleClose = () => {
        if (isSaving) return;
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            setErrorMessage("Password does not meet requirements.");
            return;
        }

        if (!isConfirmValid) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const res = await changeMyPassword({
                currentPassword,
                newPassword,
            });

            setSuccessMessage(res.message || "Password updated successfully.");
            resetForm();

            setTimeout(() => {
                onClose();
                setSuccessMessage("");
            }, 900);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <form className="modal-box profile-password-modal" onSubmit={handleSubmit}>
                <div className="profile-modal-header">
                    <div>
                        <h3>Change password</h3>
                        <p className="modal-subtext">
                            Update your password securely.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-icon-close"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Current */}
                <div className="form-group">
                    <label>Current password</label>

                    <div className="password-input-wrapper">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={isSaving}
                        />

                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowCurrent((p) => !p)}
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* New */}
                <div className="form-group">
                    <label>New password</label>

                    <div className="password-input-wrapper">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isSaving}
                        />

                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowNew((p) => !p)}
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {newPassword && (
                        <div className="password-rules compact">
                            {passwordRules.map((rule) => (
                                <div
                                    key={rule.label}
                                    className={`password-rule ${
                                        rule.isValid ? "valid" : "invalid"
                                    }`}
                                >
                                    <span>{rule.isValid ? "✔" : "✕"}</span>
                                    <span>{rule.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirm */}
                <div className="form-group">
                    <label>Confirm password</label>

                    <div className="password-input-wrapper">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isSaving}
                        />

                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowConfirm((p) => !p)}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {confirmPassword && (
                        <p
                            className={`password-match-message ${
                                isConfirmValid ? "valid" : "invalid"
                            }`}
                        >
                            {isConfirmValid ? "✔ Passwords match" : "✕ Passwords do not match"}
                        </p>
                    )}
                </div>

                {errorMessage && (
                    <p className="form-error profile-message">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="form-success profile-message">{successMessage}</p>
                )}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="auth-secondary-button"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button profile-primary-button"
                        disabled={!canSubmit}
                    >
                        {isSaving ? "Updating..." : "Update password"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordChangeModal;