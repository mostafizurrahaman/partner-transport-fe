import OtpInput from 'react-otp-input';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "antd";
import { useVerifyOtpMutation } from '../../redux/api/authApi';
import { toast } from 'sonner';

const Otp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [err, setErr] = useState("");

    const [verifyOtp] =  useVerifyOtpMutation()
    const handleResendCode = () => {

    }
    const handleVerifyOtp = () => {
        const data = {
            email: localStorage.getItem('email'),
            code:otp
        }
        console.log(data);
        verifyOtp(data).unwrap()
            .then((payload) => {
                
                    navigate('/auth/update-password')
                
                toast.success(payload?.message)
            })
            .catch((error) => toast.error(error?.data?.message));

    }

    return (
        <div
            className='flex items-center justify-center bg-[#EBEBEB] py-10 min-h-[100vh]'
        // style={{
        //     width: "100%",
        //     background: "#2AB9A4",
        //     height: "100vh",
        //     display: "flex",
        //     alignItems: "center",
        //     justifyContent: "center"
        // }}
        >
            <div style={{ width: "630px", background: "white", padding: "90px 57px", borderRadius: '12px' }}>
                <h1 style={{ fontSize: "32px", color: "#6A6D7C", marginBottom: "13px", textAlign: "center" }}>Check your email</h1>
                <p style={{ width: "380px", color: "#B8B8B8", margin: "0 auto 0 auto" }}>
                    We sent a reset link to <span style={{ color: "#545454" }}> contact@dscode...com </span>
                    enter 6 digit code that mentioned in the email
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "30px", }} className="py-7">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputStyle={{
                            height: "44px",
                            width: "44px",
                            borderRadius: "8px",
                            marginRight: "16px",
                            fontSize: "20px",
                            border: "1px solid #A9A9A9",
                            color: "#2B2A2A",
                            outline: "none"
                        }}
                        renderInput={(props) => <input {...props} />}
                    />
                </div>
                <Button
                    onClick={handleVerifyOtp}
                    block
                    htmlType="submit"
                    style={{
                        height: "52px",
                        fontWeight: "400px",
                        fontSize: "18px",
                        color: "white",
                        background: "#050505",
                        marginTop: "30px",
                        border: "none",
                        outline: "none",
                        marginBottom: "20px",
                        borderRadius: '30px'
                    }}
                >


                    <Link
                        className="login-form-forgot  "
                        style={{ color: "#FFF" }}
                        // to="/auth/update-password"
                    >
                        Continue
                    </Link>
                </Button>
                <p className='flex  justify-center gap-2'>
                    Didn’t receive code?
                    <p onClick={handleResendCode} style={{ color: "#050505", textDecoration: "underline", cursor: "pointer" }}>Resend </p>
                </p>
            </div>
        </div>
    );
};

export default Otp;