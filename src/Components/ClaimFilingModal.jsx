import React, { useState } from "react";
import { Form, Input, Modal, Select, Upload, message } from "antd";
import { UploadOutlined, WarningOutlined } from "@ant-design/icons";
import { useCreateFileClaimMutation } from "../redux/api/supportApi";
import { toast } from "sonner";

const { TextArea } = Input;

export const CLAIM_TYPES = [
  { value: "SERVICE_NON_COMPLIANCE", label: "Incumplimiento del Servicio" },
  { value: "DAMAGES", label: "Daños a la Propiedad o Bienes" },
  { value: "CANCELLATION_ISSUE", label: "Problema de Cancelación" },
  { value: "PRICE_DISCREPANCY", label: "Discrepancia de Precio o Cobro" },
  { value: "LOCATION_PROBLEM", label: "Problema de Ubicación de Recogida / Entrega" },
  { value: "LACK_OF_RESPONSE", label: "Falta de Respuesta" },
  { value: "DELIVERY_PROBLEM", label: "Problema en la Entrega o Descarga" },
  { value: "OTHER", label: "Otro Desacuerdo" },
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
      toast.success("Reclamación enviada exitosamente para revisión administrativa.");
      form.resetFields();
      setFileList([]);
      onCancel();
    } catch (err) {
      toast.error(err?.data?.message || "Error al enviar la reclamación");
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
          <span>Presentar Reclamación de Servicio Activo</span>
        </div>
      }
    >
      <div className="p-1">
        <p className="text-xs text-gray-500 mb-4">
          Reporte un problema urgente o desacuerdo con respecto al Servicio #{serviceId ? String(serviceId).slice(-6) : "N/A"}. Esta reclamación será enviada de inmediato a Operaciones para su investigación y resolución.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ claimType: "SERVICE_NON_COMPLIANCE" }}
        >
          <Form.Item
            label="Categoría / Motivo de la Reclamación"
            name="claimType"
            rules={[{ required: true, message: "Por favor seleccione una categoría de reclamo" }]}
          >
            <Select options={CLAIM_TYPES} size="large" />
          </Form.Item>

          <Form.Item
            label="Descripción Detallada"
            name="description"
            rules={[{ required: true, min: 10, message: "Por favor describa el problema en detalle (mínimo 10 caracteres)" }]}
          >
            <TextArea
              rows={4}
              placeholder="Explique el incumplimiento, daño, diferencia de precio o problema operativo..."
            />
          </Form.Item>

          <Form.Item label="Subir Fotos de Evidencia (Opcional)">
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
                <UploadOutlined /> Seleccionar Fotos
              </button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 border rounded-full text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Enviar Reclamación"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ClaimFilingModal;
