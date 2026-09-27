import React, { useState } from "react";
import { Form, Input, Modal, Select, Upload, message } from "antd";
import { UploadOutlined, WarningOutlined } from "@ant-design/icons";
import { useCreateFileClaimMutation } from "../redux/api/supportApi";
import { toast } from "sonner";

const { TextArea } = Input;

export const CLAIM_TYPES = [
  { value: "SERVICE_NON_COMPLIANCE", label: "Service Non-Compliance" },
  { value: "DAMAGES", label: "Damages to Property or Goods" },
  { value: "CANCELLATION_ISSUE", label: "Cancellation Dispute" },
  { value: "PRICE_DISCREPANCY", label: "Price / Charge Difference" },
  { value: "LOCATION_PROBLEM", label: "Pickup / Delivery Location Issue" },
  { value: "LACK_OF_RESPONSE", label: "Lack of Partner/User Response" },
  { value: "DELIVERY_PROBLEM", label: "Delivery / Unloading Problem" },
  { value: "OTHER", label: "Other Disagreement" },
];

const ClaimFilingModal = ({ open, onCancel, serviceId, userRole = "Admin" }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [createClaim, { isLoading }] = useCreateFileClaimMutation();

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("claimType", values.claimType);
      formData.append("description", values.description);
      formData.append("isDuringActiveService", "true");

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("fileClaimImage", file.originFileObj);
        }
      });

      await createClaim({ serviceId, data: formData }).unwrap();
      toast.success("Claim filed successfully and sent for admin review.");
      form.resetFields();
      setFileList([]);
      onCancel();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to file claim");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={560}
      title={
        <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
          <WarningOutlined />
          <span>File Active Service Claim (Feature 10)</span>
        </div>
      }
    >
      <div className="p-1">
        <p className="text-xs text-gray-500 mb-4">
          Report an urgent issue or disagreement regarding Service #{serviceId ? String(serviceId).slice(-6) : "N/A"}. This claim will be routed immediately to XM Operations for investigation and formal resolution.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ claimType: "SERVICE_NON_COMPLIANCE" }}
        >
          <Form.Item
            label="Claim Reason / Category"
            name="claimType"
            rules={[{ required: true, message: "Please select a claim category" }]}
          >
            <Select options={CLAIM_TYPES} size="large" />
          </Form.Item>

          <Form.Item
            label="Detailed Description"
            name="description"
            rules={[{ required: true, min: 10, message: "Please describe the issue in detail (at least 10 chars)" }]}
          >
            <TextArea
              rows={4}
              placeholder="Explain the non-compliance, damage, pricing difference, or operational issue..."
            />
          </Form.Item>

          <Form.Item label="Upload Evidence Photos (Optional)">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              multiple
            >
              <button
                type="button"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <UploadOutlined /> Select Photos
              </button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 border rounded-full text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ClaimFilingModal;
