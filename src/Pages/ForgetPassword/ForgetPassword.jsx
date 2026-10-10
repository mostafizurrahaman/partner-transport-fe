import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../../redux/api/authApi";
import { toast } from "sonner";

const ForgetPassword = () => {
    const [form] = Form.useForm();
    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
    const navigate = useNavigate();

    const onFinish = (values) => {
        const email = values?.email?.trim();
        forgetPassword({ email }).unwrap()
        .then((payload)=>{
            localStorage.setItem('email', email);
            navigate('/auth/otp');
            toast.success(payload?.message || "Verification code sent to your email!");
        })
        .catch((error)=>{
            toast.error(error?.data?.message || "Failed to send verification code. Please try again.");
        });
    };

    return (
        <div className="flex justify-center items-center gap-0 bg-[#EBEBEB] py-10 min-h-[100vh]">
            <div className="bg-white flex justify-center items-center rounded-lg">
                <Form
                    form={form}
                    name="forget_password"
                    className="password-form"
                    style={{ width: "630px", background: "white", borderRadius: "12px", padding: "90px 57px" }}
                    onFinish={onFinish}
                >
                    <div className="text-center mb-10">
                        <h1 style={{ fontSize: "30px", color: "#494949", textAlign: "center" }}>Forget Password?</h1>
                        <p style={{ color: "#7D7E8A", marginTop: "8px" }}>Please enter your email to get verification code</p>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label htmlFor="email" style={{ display: "block", marginBottom: "5px", color: "#38393E" }}>
                            Email Address
                        </label>
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="esteban_schiller@gmail.com"
                                type="email"
                                style={{
                                    border: "1px solid #E0E4EC",
                                    height: "52px",
                                    background: "white",
                                    borderRadius: "8px",
                                    outline: "none",
                                }}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={isLoading}
                            className="login-form-button rounded-3xl"
                            block
                            style={{
                                height: "45px",
                                fontWeight: "500",
                                fontSize: "18px",
                                background: "#050505",
                                color: "white",
                                marginTop: "30px",
                            }}
                        >
                            Continue
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-6">
                        <Link to="/auth/login" style={{ color: "#050505", textDecoration: "underline", fontSize: "14px" }}>
                            Back to Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ForgetPassword;