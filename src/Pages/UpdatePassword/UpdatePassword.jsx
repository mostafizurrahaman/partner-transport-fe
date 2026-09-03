
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";

const UpdatePassword = () => {
    const [resetPassword] = useResetPasswordMutation()
    const navigate = useNavigate();
    const [newPassError, setNewPassError] = useState("");
    const [conPassError, setConPassError] = useState("");
    const [curPassError, setCurPassError] = useState("");
    const [err, setErr] = useState("");

    const onFinish = (values) => {
        const email = localStorage.getItem('email')

        const data = {
            newPassword: values?.password,
            confirmPassword: values?.confirmPassword
        }
        resetPassword({email ,data}).unwrap()
            .then((payload) => console.log('fulfilled', payload))
            .catch((error) => console.error('rejected', error));

    };

    return (
        <div
            style={{
                width: "100%",
                background: "#EBEBEB",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                style={{ width: "630px", background: "white", borderRadius: "12px", padding: "90px 57px" }}
                onFinish={onFinish}
            >
                <h1 style={{ fontSize: "32px", color: "#38393E", marginBottom: "13px", textAlign: "center", fontWeight: "bold" }}>Set a new password</h1>
                <p style={{ width: "275px", color: "#7D7E8A", fontSize: "14px", fontWeight: 400, textAlign: "center", margin: "0 auto 0 auto" }}>
                    Create a new password. Ensure it differs from
                    previous ones for security
                </p>

                <div style={{ margin: "45px 0 20px 0" }}>
                    <label style={{ display: "block", color: "#38393E", marginBottom: "5px" }} htmlFor="">New Password</label>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new Password!",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input.Password
                            type="password"
                            placeholder="Enter New password"
                            style={{
                                border: "1px solid #E0E4EC",
                                height: "52px",
                                background: "white",
                                borderRadius: "8px",
                                outline: "none",
                            }}
                        />
                    </Form.Item>
                    {newPassError && <label style={{ display: "block", color: "red" }} htmlFor="error">{newPassError}</label>}
                </div>

                <div style={{ marginBottom: "40px" }}>
                    <label style={{ display: "block", color: "#38393E", marginBottom: "5px" }} htmlFor="email">Confirm Password</label>
                    <Form.Item
                        style={{ marginBottom: 0 }}
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Confirm Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            type="password"
                            placeholder="Enter Confirm password"
                            style={{
                                border: "1px solid #E0E4EC",
                                height: "52px",
                                background: "white",
                                borderRadius: "8px",
                                outline: "none",
                            }}
                        />
                    </Form.Item>
                    {conPassError && <label style={{ display: "block", color: "red" }} htmlFor="error">{conPassError}</label>}
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{
                            border: "none",
                            height: "51px",
                            background: "#050505",
                            color: "white",
                            borderRadius: "30px",
                            outline: "none",
                            marginTop: ""
                        }}
                    >

                        <Link
                            className="login-form-forgot "
                            style={{ color: "#FFF" }}
                            to="/"
                        >
                            Reset Password
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdatePassword;

