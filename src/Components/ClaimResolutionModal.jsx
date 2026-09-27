import React, { useState } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useResolveAdminClaimMutation } from "../redux/api/supportApi";
import { toast } from "sonner";
import { CheckCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ClaimResolutionModal = ({ open, onCancel, claim }) => {
  const [form] = Form.useForm();
  const [resolveClaim, { isLoading }] = useResolveAdminClaimMutation();

  const handleFinish = async (values) => {
    try {
      await resolveClaim({
        claimId: claim?.complainId || claim?._id,
        resolutionType: values.resolutionType,
        decisionNotes: values.decisionNotes,
        penaltyOrRefundAmount: Number(values.penaltyOrRefundAmount || 0),
      }).unwrap();

      toast.success("Final decision recorded and claim resolved successfully!");
      form.resetFields();
      onCancel();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resolve claim");
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
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
          <CheckCircleOutlined />
          <span>Record Final Claim Decision (Feature 11)</span>
        </div>
      }
    >
      <div className="p-1">
        <p className="text-xs text-gray-500 mb-4">
          Record formal administrative resolution and rationale for Claim #{claim?.complainId?.slice(-6) || "N/A"} regarding Order #{claim?.orderId?.slice(-6) || "N/A"}. This will update status, trigger user notifications, and log traceability evidence.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ resolutionType: "REFUND", penaltyOrRefundAmount: 0 }}
        >
          <Form.Item
            label="Resolution Outcome"
            name="resolutionType"
            rules={[{ required: true, message: "Please select resolution type!" }]}
          >
            <Select
              size="large"
              options={[
                { value: "REFUND", label: "REFUND — Issue user compensation / refund" },
                { value: "PENALTY_APPLIED", label: "PENALTY APPLIED — Deduct penalty from partner wallet" },
                { value: "NO_ACTION", label: "NO ACTION — Mutual agreement reached / closed without action" },
                { value: "DISMISSED", label: "DISMISSED — Claim rejected as unsubstantiated" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Financial Amount (Refund / Penalty $)"
            name="penaltyOrRefundAmount"
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              addonBefore="$"
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            label="Decision Notes & Justification"
            name="decisionNotes"
            rules={[{ required: true, min: 5, message: "Please enter decision notes" }]}
          >
            <TextArea
              rows={4}
              placeholder="Explain the investigation outcome, legal/operational grounds, and instructions for customer support..."
            />
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
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Saving Decision..." : "Record & Finalize Decision"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ClaimResolutionModal;
