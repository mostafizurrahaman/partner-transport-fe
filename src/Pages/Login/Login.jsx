import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginAdminMutation } from '../../redux/api/authApi';
import { toast } from 'sonner';

const Login = () => {

    const [loginAdmin, { isLoading }] = useLoginAdminMutation()
    const navigate = useNavigate()
    // handle login data
    const onFinish = (values) => {
        const data ={
            email: values?.email,
            password: values?.password 
        }
        loginAdmin(data).unwrap()
        .then((payload)=>{
            if(payload?.data?.accessToken){
                localStorage.setItem('token', JSON.stringify(payload?.data?.accessToken));
                navigate('/')
                toast.success(payload?.message);
            }

        })
        .catch((error)=>{
            toast.error(error?.data?.message)
        })

    };
    return (
        <div className='bg-[#EBEBEB] min-h-[100vh] flex  items-center justify-center'>

            <div className=" flex justify-center items-center  py-10">

                <div className="bg-white flex justify-center items-center rounded-lg">
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        style={{
                            width: "630px",
                            background: "white",
                            borderRadius: "12px",
                            padding: "90px 57px",
                        }}
                        onFinish={onFinish}
                    >
                        <h1
                            style={{ fontSize: "30px", color: "#38393E", textAlign: "center" }}
                        >
                            Login to Account
                        </h1>

                        <p
                            style={{ color: "#7D7E8A", textAlign: "center", marginBottom: '30px' }}
                        >
                            Please enter your email and password to continue
                        </p>
                        <div style={{ marginBottom: "24px" }}>
                            <label
                                htmlFor="email"
                                style={{ display: "block", marginBottom: "5px" }}
                            >
                                {" "}
                                Email address:{" "}
                            </label>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name="email"
                                id="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter your email address"
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

                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{ display: "block", marginBottom: "5px" }}
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Password!",
                                    },
                                ]}
                            >
                                <Input.Password
                                    type="password"
                                    placeholder="Enter your password"
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

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox style={{ color: "#050505" }} className="custom-checkbox">Remember me</Checkbox>
                            </Form.Item>
                            <Link
                                className="login-form-forgot "
                                style={{}}
                                to="/auth/forgot-password"
                            >
                                Forgot Password
                            </Link>
                        </div>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                className="rounded-3xl mt-8 bg-[var(--primary-color)] py-5"
                                block
                                style={{
                                    fontWeight: "400px",
                                    fontSize: "18px",
                                    background: "#050505",
                                    marginTop: "56px",

                                }}
                            >

                                    Sign In
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;
