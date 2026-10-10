import OtpInput from 'react-otp-input';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useVerifyOtpMutation, useResendOtpMutation } from '../../redux/api/authApi';
import { toast } from 'sonner';

const Otp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [resendCooldown, setResendCooldown] = useState(60);

    const email = localStorage.getItem('email');
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    useEffect(() => {
        if (!email) {
            toast.error("Please enter your email first.");
            navigate('/auth/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleResendCode = () => {
        if (resendCooldown > 0 || isResending) return;
        resendOtp({ email }).unwrap()
            .then((payload) => {
                toast.success(payload?.message || "Verification code resent successfully!");
                setResendCooldown(60);
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to resend verification code.");
            });
    };

    const handleVerifyOtp = () => {
        if (!otp || otp.length < 6) {
            toast.error("Please enter the complete 6-digit verification code.");
            return;
        }

        const data = {
            email,
            code: otp.trim()
        };

        verifyOtp(data).unwrap()
            .then((payload) => {
                toast.success(payload?.message || "Code verified successfully!");
                navigate('/auth/update-password');
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Invalid or expired verification code.");
            });
    };

    return (
        <div className='flex items-center justify-center bg-[#EBEBEB] py-10 min-h-[100vh]'>
            <div style={{ width: "630px", background: "white", padding: "90px 57px", borderRadius: '12px' }}>
                <h1 style={{ fontSize: "32px", color: "#6A6D7C", marginBottom: "13px", textAlign: "center" }}>Check your email</h1>
                <p style={{ width: "420px", color: "#B8B8B8", margin: "0 auto 0 auto", textAlign: "center" }}>
                    We sent a verification code to <span style={{ color: "#545454", fontWeight: "600" }}>{email || "your email"}</span>.
                    Please enter the 6-digit code mentioned in the email.
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "30px" }} className="py-7">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputStyle={{
                            height: "48px",
                            width: "48px",
                            borderRadius: "8px",
                            marginRight: "12px",
                            fontSize: "22px",
                            border: "1px solid #A9A9A9",
                            color: "#2B2A2A",
                            outline: "none"
                        }}
                        renderInput={(props) => <input {...props} />}
                    />
                </div>
                <Button
                    onClick={handleVerifyOtp}
                    loading={isVerifying}
                    disabled={isVerifying || otp.length < 6}
                    block
                    type="primary"
                    style={{
                        height: "52px",
                        fontWeight: "500",
                        fontSize: "18px",
                        color: "white",
                        background: "#050505",
                        marginTop: "20px",
                        border: "none",
                        outline: "none",
                        marginBottom: "20px",
                        borderRadius: '30px'
                    }}
                >
                    Continue
                </Button>
                <div className='flex justify-center items-center gap-2 text-sm text-[#7D7E8A]'>
                    <span>Didn’t receive code?</span>
                    {resendCooldown > 0 ? (
                        <span style={{ color: "#999" }}>Resend in {resendCooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            style={{ color: "#050505", textDecoration: "underline", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                        >
                            {isResending ? "Sending..." : "Resend"}
                        </button>
                    )}
                </div>
                <div className="text-center mt-4">
                    <Link to="/auth/forgot-password" style={{ color: "#7D7E8A", fontSize: "13px", textDecoration: "underline" }}>
                        Change email
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Otp;