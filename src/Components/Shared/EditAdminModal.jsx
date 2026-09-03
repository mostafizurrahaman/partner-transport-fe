import React, { useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Radio } from "antd";
import { useGetAdminDetailsQuery, useUpdateMakeAdminMutation } from "../../redux/api/makeAdminApi";
import { toast } from "sonner";

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

export const EditAdminModal = ({ openEditModal, setOpenEditModal, id, authId }) => {
    const [updateMakeAdmin] = useUpdateMakeAdminMutation()
    const { data: adminDetails } = useGetAdminDetailsQuery(id);
    const [form] = Form.useForm();


    console.log(adminDetails?.data);
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [radioValues, setRadioValues] = React.useState({});

    // Populate form and derive selected options and radio values
    useEffect(() => {
        if (adminDetails?.data) {
            const { name, email, phone_number, ...accessData } = adminDetails.data;

            // Set form fields
            form.setFieldsValue({ name, email, phone_number });

            // Extract selected options and radio values from accessData
            const selected = [];
            const radio = {};

            Object.keys(accessData).forEach((key) => {
                const normalizedKey = key.replace("accTo_", "").replace(/_/g, " ");
                const isEditKey = key.endsWith("_edit");
                const baseKey = normalizedKey.replace(" edit", "");

                if (accessOptions.includes(baseKey)) {
                    if (!isEditKey && accessData[key]) {
                        selected.push(baseKey);
                    } else if (isEditKey) {
                        radio[baseKey] = accessData[key] ? "canEdit" : "viewOnly";
                    }
                }
            });

            setSelectedOptions(selected);
            setRadioValues(radio);
        }
    }, [adminDetails, form]);

    // Handle checkbox changes
    const handleCheckboxChange = (checkedValues) => {
        setSelectedOptions(checkedValues);

        // Reset corresponding radio values if unchecked
        const updatedRadioValues = { ...radioValues };
        accessOptions.forEach((option) => {
            if (!checkedValues.includes(option)) {
                updatedRadioValues[option] = "viewOnly";
            }
        });
        setRadioValues(updatedRadioValues);
    };

    // Handle radio button changes
    const handleRadioChange = (key, value) => {
        setRadioValues((prev) => ({ ...prev, [key]: value }));
    };

    // Handle form submission
    const onFinish = (values) => {
        const formattedData = {
            ...values,
            ...selectedOptions.reduce((acc, key) => {
                const normalizedKey = key.replace(/\s+/g, "_").toLowerCase();
                acc[`accTo_${normalizedKey}`] = true;
                acc[`accTo_${normalizedKey}_edit`] = radioValues[key] === "canEdit";
                return acc;
            }, {}),
        };
        // console.log("Submitted Data:", formattedData);
        updateMakeAdmin({ userId: id, authId: authId, data: formattedData }).unwrap()
            .then((payload) =>{
                toast.success(payload?.message)
                setOpenEditModal(false)
            })
            .catch((error) => toast.error(error?.data?.message));
    };

    return (
        <Modal
            open={openEditModal}
            onCancel={() => setOpenEditModal(false)}
            footer={null}
            centered
        >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div className="text-center font-medium text-xl py-4">Edit Admin</div>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Item
                    label="Name of the Admin"
                    name="name"
                    rules={[{ required: true, message: "Please enter the name" }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <Item
                    label="Contact Number"
                    name="phone_number"
                    rules={[{ required: true, message: "Please enter the contact number" }]}
                >
                    <Input placeholder="Type here" />
                </Item>

                <div className="flex items-center justify-between">
                    <div style={{ width: "50%" }}>
                        <CheckboxGroup
                            options={accessOptions}
                            value={selectedOptions}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <div style={{ width: "50%" }}>
                        {accessOptions.map((option) => (
                            <div key={option}>
                                <Radio.Group
                                    value={radioValues[option] || "viewOnly"}
                                    onChange={(e) => handleRadioChange(option, e.target.value)}
                                    disabled={!selectedOptions.includes(option)}
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
                    style={{ backgroundColor: "black", borderRadius: 20, marginTop: 20 }}
                >
                    Update
                </Button>
            </Form>
        </Modal>
    );
};
