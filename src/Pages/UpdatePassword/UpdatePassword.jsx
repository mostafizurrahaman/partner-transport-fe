import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";
import { toast } from "sonner";

const UpdatePassword = () => {
    const [form] = Form.useForm();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();

    const email = localStorage.getItem('email');

    useEffect(() => {
        if (!email) {
            toast.error("Please verify your email first.");
            navigate('/auth/forgot-password');
        }
    }, [email, navigate]);

    const onFinish = (values) => {
        if (!email) {
            toast.error("Session expired. Please start again.");
            navigate('/auth/forgot-password');
            return;
        }

        const data = {
            newPassword: values.password,
            confirmPassword: values.confirmPassword,
        };

        resetPassword({ email, data }).unwrap()
            .then((payload) => {
                toast.success(payload?.message || "Password has been reset successfully!");
                localStorage.removeItem('email');
                navigate('/auth/login');
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to reset password. Please try again.");
            });
    };

    return (
        <div
            style={{
                width: "100%",
                background: "#EBEBEB",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0"
            }}
        >
            <Form
                form={form}
                name="update_password"
                className="login-form"
                style={{ width: "630px", background: "white", borderRadius: "12px", padding: "90px 57px" }}
                onFinish={onFinish}
            >
                <h1 style={{ fontSize: "32px", color: "#38393E", marginBottom: "13px", textAlign: "center", fontWeight: "bold" }}>
                    Set a new password
                </h1>
                <p style={{ width: "320px", color: "#7D7E8A", fontSize: "14px", fontWeight: 400, textAlign: "center", margin: "0 auto 30px auto" }}>
                    Create a new password. Ensure it differs from previous ones for security.
                </p>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", color: "#38393E", marginBottom: "5px" }}>
                        New Password
                    </label>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                            {
                                min: 6,
                                message: "Password must be at least 6 characters!",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input.Password
                            placeholder="Enter new password"
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

                <div style={{ marginBottom: "35px" }}>
                    <label style={{ display: "block", color: "#38393E", marginBottom: "5px" }}>
                        Confirm Password
                    </label>
                    <Form.Item
                        style={{ marginBottom: 0 }}
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The two passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm your password"
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
                        block
                        style={{
                            border: "none",
                            height: "51px",
                            background: "#050505",
                            color: "white",
                            borderRadius: "30px",
                            outline: "none",
                            fontSize: "18px",
                            fontWeight: "500",
                        }}
                    >
                        Reset Password
                    </Button>
                </Form.Item>

                <div className="text-center mt-6">
                    <Link to="/auth/login" style={{ color: "#050505", textDecoration: "underline", fontSize: "14px" }}>
                        Back to Login
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default UpdatePassword;

