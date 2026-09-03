import React, { useState } from 'react';
import { Modal, Form, Input, Checkbox, Button, Radio } from 'antd';
import { useCreateMakeAdminMutation } from '../redux/api/makeAdminApi';
import { toast } from 'sonner';

const { Item } = Form;
const CheckboxGroup = Checkbox.Group;

const accessOptions = [
    "Dashboard Home",
    "Auction Manage",
    "User Manage",
    "Partner Manage",
    "Transaction",
    "Category Manage",
    "Variable Manage",
    "Review Conversation",
    "Support",
    "Settings",
    "Admin Manage",
    "Notifications Manage",
    "Audit Dashboard",
    "Supervision Dashboard",
    "Activity Log",
];

const MakeAdminModal = ({ openModal, setOpenModal }) => {
    const [createMakeAdmin] = useCreateMakeAdminMutation();

    const [form] = Form.useForm();
    const [accessRights, setAccessRights] = useState(
        accessOptions.reduce((acc, option) => {
            acc[option] = { selected: false, canEdit: false };
            return acc;
        }, {})
    );

    // Handle checkbox changes
    const handleCheckboxChange = (checkedValues) => {
        const updatedRights = { ...accessRights };

        Object.keys(updatedRights).forEach((key) => {
            if (checkedValues.includes(key)) {
                updatedRights[key].selected = true;
            } else {
                updatedRights[key] = { selected: false, canEdit: false };
            }
        });

        setAccessRights(updatedRights);
    };

    // Handle radio button changes
    const handleRadioChange = (key, value) => {
        if (!accessRights[key]?.selected) return; 

        const updatedRights = {
            ...accessRights,
            [key]: {
                ...accessRights[key],
                canEdit: value === 'canEdit', 
            },
        };

        setAccessRights(updatedRights);
    };

    // Handle form submission
    const onFinish = (values) => {
        const formattedData = {
            ...values,
            role: "ADMIN",
            ...Object.keys(accessRights).reduce((acc, key) => {
                if (accessRights[key].selected) {
                    acc[`accTo_${key.replace(/\s+/g, '_').toLowerCase()}`] = true; 
                    acc[`accTo_${key.replace(/\s+/g, '_').toLowerCase()}_edit`] = accessRights[key].canEdit;
                }
                return acc;
            }, {}),
        };


        createMakeAdmin(formattedData)
            .unwrap()
            .then(() => {
                toast.success("Admin created successfully");
                setOpenModal(false);
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to create admin");
            });
    };

    return (
        <Modal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div className="text-center font-medium text-xl py-4">Make Admin</div>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Item
                    label="Name of the Admin"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the name' }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <Item
                    label="Contact Number"
                    name="phone_number"
                    rules={[{ required: true, message: 'Please enter the contact number' }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter the password' }]}
                >
                    <Input.Password placeholder="Type here" />
                </Item>

                <Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm the password' }]}
                >
                    <Input.Password placeholder="Type here" />
                </Item>

                <div className="flex items-center justify-between">
                    <div style={{ width: '50%' }}>
                        <CheckboxGroup
                            options={accessOptions}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <div style={{ width: '50%' }}>
                        {accessOptions.map((option) => (
                            <div key={option}>
                                <Radio.Group
                                    value={accessRights[option]?.canEdit ? 'canEdit' : 'viewOnly'} // Guard added here
                                    onChange={(e) => handleRadioChange(option, e.target.value)}
                                    disabled={!accessRights[option]?.selected} // Guard added here
                                >
                                    <Radio value="canEdit">Can Edit</Radio>
                                    <Radio value="viewOnly">View Only</Radio>
                                </Radio.Group>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    className="bg-black text-white"
                    htmlType="submit"
                    block
                    style={{ backgroundColor: 'black', borderRadius: 20, marginTop: 20 }}
                >
                    Make
                </Button>
            </Form>
        </Modal>
    );
};

export default MakeAdminModal;
