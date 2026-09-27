import React, { useState } from "react";
import { DatePicker, Modal, Pagination, Select, Table, Tag, Tooltip } from "antd";
import {
  SafetyCertificateOutlined,
  FileTextOutlined,
  HistoryOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useGetLegalConsentEvidenceQuery,
  useGetSystemTraceabilityLogsQuery,
} from "../../redux/api/legalAgreementApi";
import { CSVLink } from "react-csv";
import Loading from "../../Components/Loading/Loading";

const DigitalEvidence = () => {
  const [activeTab, setActiveTab] = useState("consent");

  // Tab 1 (Consent Evidence) filters
  const [consentPage, setConsentPage] = useState(1);
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Tab 2 (Traceability Logs) filters
  const [tracePage, setTracePage] = useState(1);
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  const [actorRoleFilter, setActorRoleFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // RTK Queries
  const { data: evidenceData, isLoading: isEvidenceLoading } =
    useGetLegalConsentEvidenceQuery({
      page: consentPage,
      limit: 10,
      documentType: docTypeFilter,
      userRole: userRoleFilter,
    });

  const { data: traceData, isLoading: isTraceLoading } =
    useGetSystemTraceabilityLogsQuery({
      page: tracePage,
      limit: 15,
      actionType: actionTypeFilter,
      actorRole: actorRoleFilter,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

  // Action badge configuration
  const actionConfig = {
    TERMS_ACCEPTED: { label: "Terms Accepted", color: "blue" },
    PRIVACY_ACCEPTED: { label: "Privacy Notice Accepted", color: "cyan" },
    CONTRACT_ACCEPTED: { label: "Contract Accepted", color: "green" },
    CONTRACT_UPDATED: { label: "Contract Template Updated", color: "purple" },
    TAX_INFO_CHANGED: { label: "Tax Info Changed", color: "volcano" },
    INVOICE_REQUESTED: { label: "Invoice Requested", color: "orange" },
    CLAIM_SUBMITTED: { label: "Claim Submitted", color: "magenta" },
    CLAIM_RESOLVED: { label: "Claim Resolved", color: "geekblue" },
    SERVICE_CANCELLED: { label: "Service Cancelled", color: "red" },
    SERVICE_RESUMED: { label: "Service Resumed", color: "lime" },
  };

  // Tab 1 Table Columns
  const consentColumns = [
    {
      title: "Timestamp",
      dataIndex: "acceptedAt",
      key: "acceptedAt",
      render: (date) => (
        <span className="text-xs text-gray-700">
          {new Date(date).toLocaleString()}
        </span>
      ),
      width: 160,
    },
    {
      title: "User / Partner",
      key: "user",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-xs text-gray-900">
            {record?.userId?.name || "N/A"}
          </p>
          <p className="text-[11px] text-gray-500">{record?.userId?.email}</p>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "userRole",
      key: "userRole",
      render: (role) => (
        <Tag color={role === "Partner" ? "purple" : "blue"} className="text-xs">
          {role}
        </Tag>
      ),
      width: 90,
    },
    {
      title: "Document",
      dataIndex: "documentType",
      key: "documentType",
      render: (type) => {
        if (type === "TERMS_AND_CONDITIONS")
          return <Tag color="blue">Terms & Conditions</Tag>;
        if (type === "PRIVACY_NOTICE")
          return <Tag color="cyan">Privacy Notice</Tag>;
        if (type === "PARTNER_SERVICE_CONTRACT")
          return <Tag color="green">Service Agreement Contract</Tag>;
        return <Tag>{type}</Tag>;
      },
    },
    {
      title: "Version",
      dataIndex: "documentVersion",
      key: "documentVersion",
      render: (v) => <span className="font-mono text-xs font-semibold">{v}</span>,
      width: 90,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip) => <span className="font-mono text-xs text-gray-600">{ip}</span>,
    },
    {
      title: "Status",
      dataIndex: "accepted",
      key: "accepted",
      render: () => (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Verified
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Evidence Certificate",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => {
            setSelectedEvidence(record);
            setEvidenceModalOpen(true);
          }}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
        >
          <EyeOutlined />
          <span>View Audit Certificate</span>
        </button>
      ),
      width: 160,
    },
  ];

  // Tab 2 Table Columns
  const traceColumns = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-xs text-gray-700">
          {new Date(date).toLocaleString()}
        </span>
      ),
      width: 160,
    },
    {
      title: "Actor",
      key: "actor",
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Tag color={record.actorRole === "Admin" ? "red" : record.actorRole === "PARTNER" ? "purple" : "blue"} className="text-[10px] px-1 py-0">
              {record.actorRole}
            </Tag>
            <span className="text-xs font-medium text-gray-800">{record.actorEmail || "System"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Action / Event Type",
      dataIndex: "actionType",
      key: "actionType",
      render: (act) => {
        const conf = actionConfig[act] || { label: act, color: "default" };
        return <Tag color={conf.color} className="font-semibold text-xs">{conf.label}</Tag>;
      },
    },
    {
      title: "Target Entity",
      key: "target",
      render: (_, record) => (
        <span className="font-mono text-xs text-gray-600">
          {record.targetEntity ? `${record.targetEntity} (#${String(record.targetId || "").slice(-6)})` : "N/A"}
        </span>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip) => <span className="font-mono text-xs text-gray-500">{ip || "0.0.0.0"}</span>,
      width: 110,
    },
    {
      title: "Metadata / Payload",
      key: "meta",
      render: (_, record) => (
        <Tooltip title={JSON.stringify(record.metaData || {})}>
          <span className="font-mono text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded cursor-pointer max-w-[200px] truncate inline-block">
            {JSON.stringify(record.metaData || {})}
          </span>
        </Tooltip>
      ),
    },
  ];

  // CSV Preparation
  const csvTraceData = (traceData?.data || []).map((t) => ({
    Timestamp: new Date(t.createdAt).toISOString(),
    ActorEmail: t.actorEmail,
    ActorRole: t.actorRole,
    ActionType: t.actionType,
    TargetEntity: t.targetEntity,
    TargetId: t.targetId,
    IPAddress: t.ipAddress,
    Metadata: JSON.stringify(t.metaData || {}),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <SafetyCertificateOutlined className="text-blue-600" />
            <span>Digital Evidence & System Traceability (Feature 12)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Maintain immutable legal records, Terms/Contract acceptances, and audit trails for compliance, tax, and operational activities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("consent")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "consent"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Digital Consent Evidence
          </button>
          <button
            onClick={() => setActiveTab("traceability")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "traceability"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            System Traceability Audit Trail
          </button>
        </div>
      </div>

      {/* TAB 1: DIGITAL CONSENT EVIDENCE */}
      {activeTab === "consent" && (
        <div className="mt-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border mb-4 text-xs">
            <div>
              <span className="text-gray-500 mr-2 font-medium">Document Type:</span>
              <Select
                size="small"
                value={docTypeFilter}
                onChange={(val) => setDocTypeFilter(val)}
                style={{ width: 220 }}
                options={[
                  { value: "all", label: "All Legal Documents" },
                  { value: "TERMS_AND_CONDITIONS", label: "Terms and Conditions" },
                  { value: "PRIVACY_NOTICE", label: "Privacy Notice" },
                  { value: "PARTNER_SERVICE_CONTRACT", label: "Partner Service Contract" },
                ]}
              />
            </div>

            <div>
              <span className="text-gray-500 mr-2 font-medium">User Role:</span>
              <Select
                size="small"
                value={userRoleFilter}
                onChange={(val) => setUserRoleFilter(val)}
                style={{ width: 140 }}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "User", label: "Users" },
                  { value: "Partner", label: "Partners" },
                ]}
              />
            </div>

            <div className="ml-auto text-gray-500 font-medium">
              Total Evidence Records: <strong>{evidenceData?.data?.meta?.total || 0}</strong>
            </div>
          </div>

          {/* Evidence Table */}
          {isEvidenceLoading ? (
            <Loading type="table" />
          ) : (
            <Table
              columns={consentColumns}
              dataSource={evidenceData?.data?.data || []}
              pagination={false}
              rowKey="_id"
            />
          )}

          <div className="flex justify-center mt-6">
            <Pagination
              current={consentPage}
              onChange={(p) => setConsentPage(p)}
              total={evidenceData?.data?.meta?.total || 0}
              pageSize={evidenceData?.data?.meta?.limit || 10}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM TRACEABILITY AUDIT TRAIL */}
      {activeTab === "traceability" && (
        <div className="mt-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border mb-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-gray-500 mr-2 font-medium">Action Type:</span>
                <Select
                  size="small"
                  value={actionTypeFilter}
                  onChange={(val) => setActionTypeFilter(val)}
                  style={{ width: 220 }}
                  options={[
                    { value: "all", label: "All Activities" },
                    { value: "TERMS_ACCEPTED", label: "Terms Acceptance" },
                    { value: "PRIVACY_ACCEPTED", label: "Privacy Acceptance" },
                    { value: "CONTRACT_ACCEPTED", label: "Contract Acceptance" },
                    { value: "CONTRACT_UPDATED", label: "Contract Version Update" },
                    { value: "TAX_INFO_CHANGED", label: "Tax Info Modification" },
                    { value: "INVOICE_REQUESTED", label: "Invoice Request" },
                    { value: "CLAIM_SUBMITTED", label: "Claim Submission" },
                    { value: "CLAIM_RESOLVED", label: "Claim Resolution" },
                    { value: "SERVICE_CANCELLED", label: "Service Cancellation" },
                    { value: "SERVICE_RESUMED", label: "Service Resumption" },
                  ]}
                />
              </div>

              <div>
                <span className="text-gray-500 mr-2 font-medium">Actor Role:</span>
                <Select
                  size="small"
                  value={actorRoleFilter}
                  onChange={(val) => setActorRoleFilter(val)}
                  style={{ width: 130 }}
                  options={[
                    { value: "all", label: "All Roles" },
                    { value: "Admin", label: "Admin" },
                    { value: "PARTNER", label: "Partner" },
                    { value: "USER", label: "User" },
                  ]}
                />
              </div>
            </div>

            {/* CSV Export */}
            <div>
              {csvTraceData.length > 0 && (
                <CSVLink
                  data={csvTraceData}
                  filename={`traceability-audit-${new Date().toISOString().split("T")[0]}.csv`}
                  className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
                >
                  <DownloadOutlined />
                  <span>Export Audit Log</span>
                </CSVLink>
              )}
            </div>
          </div>

          {/* Traceability Table */}
          {isTraceLoading ? (
            <Loading type="table" />
          ) : (
            <Table
              columns={traceColumns}
              dataSource={traceData?.data?.data || []}
              pagination={false}
              rowKey="_id"
            />
          )}

          <div className="flex justify-center mt-6">
            <Pagination
              current={tracePage}
              onChange={(p) => setTracePage(p)}
              total={traceData?.data?.meta?.total || 0}
              pageSize={traceData?.data?.meta?.limit || 15}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {/* Evidence Certificate Modal */}
      <Modal
        open={evidenceModalOpen}
        onCancel={() => setEvidenceModalOpen(false)}
        footer={null}
        centered
        width={600}
        title={
          <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
            <SafetyCertificateOutlined />
            <span>Digital Evidence Audit Certificate</span>
          </div>
        }
      >
        {selectedEvidence && (
          <div className="p-2 space-y-4 text-sm">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 uppercase font-semibold">Consent Status</span>
                <Tag color="success">Legally Binding Acceptance</Tag>
              </div>
              <p className="font-semibold text-gray-900 text-base">{selectedEvidence.documentType.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-500 mt-0.5">Version Accepted: <strong>{selectedEvidence.documentVersion}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-lg border">
              <div>
                <span className="text-gray-500 font-medium">Party Name:</span>
                <p className="font-semibold text-gray-900 mt-0.5">{selectedEvidence?.userId?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Party Email:</span>
                <p className="font-semibold text-gray-900 mt-0.5">{selectedEvidence?.userId?.email || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Recorded Timestamp:</span>
                <p className="text-gray-800 mt-0.5">{new Date(selectedEvidence.acceptedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Client IP Address:</span>
                <p className="font-mono text-gray-800 mt-0.5">{selectedEvidence.ipAddress}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-medium">Client User Agent:</span>
                <p className="font-mono text-[11px] text-gray-700 mt-0.5 bg-white p-2 rounded border break-all">
                  {selectedEvidence.userAgent}
                </p>
              </div>
            </div>

            {/* Partner Legal & Tax Snapshot (Feature 2 & 12) */}
            {selectedEvidence.legalTaxSnapshot && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-900 uppercase">Partner Tax & Banking Snapshot (Contract Binding)</span>
                  <Tag color="green">Verified Tax Info</Tag>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-gray-500">Legal Entity Name:</span>
                    <p className="font-semibold text-gray-900">{selectedEvidence.legalTaxSnapshot.legalName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">RFC / Tax ID:</span>
                    <p className="font-semibold text-gray-900 font-mono">{selectedEvidence.legalTaxSnapshot.rfcOrTaxId || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Official Registered Tax Address:</span>
                    <p className="font-medium text-gray-800">{selectedEvidence.legalTaxSnapshot.officialAddress || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bank Name:</span>
                    <p className="font-semibold text-gray-900">{selectedEvidence.legalTaxSnapshot.bankName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bank Account Number:</span>
                    <p className="font-mono font-semibold text-gray-900">{selectedEvidence.legalTaxSnapshot.bankAccountNumber || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setEvidenceModalOpen(false)}
                className="px-5 py-1.5 border rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DigitalEvidence;
