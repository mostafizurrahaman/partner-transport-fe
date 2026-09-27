import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Link } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import {
  useGetActiveDocumentQuery,
  useGetLegalDocumentsHistoryQuery,
  usePublishLegalDocumentMutation,
  useGetLegalConsentEvidenceQuery,
} from "../../redux/api/legalAgreementApi";
import { toast } from "sonner";
import Loading from "../../Components/Loading/Loading";
import { Input, Table, Tag } from "antd";
import {
  FileDoneOutlined,
  HistoryOutlined,
  SendOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const SAMPLE_PARTNER_PREVIEW = {
  name: "Transportes Rapidos del Norte S.A. de C.V.",
  email: "contacto@transportesnorte.com",
  phone: "+52 55 1234 5678",
  address: "Av. Insurgentes Sur 1602, Benito Juarez, CDMX",
  bank_name: "BBVA Bancomer Mexico",
  bank_account: "012180004567891234",
};

const DEFAULT_CONTRACT_TEMPLATE = `<h2>PARTNER TRANSPORTATION SERVICE AGREEMENT CONTRACT</h2>
<p>This Transportation Service Agreement ("Agreement") is entered into and made effective as of the date of electronic acceptance by and between <strong>XMoveIt Platform</strong> ("Platform" or "XM") and the independent commercial partner identified below ("Partner").</p>

<h3>1. PARTNER LEGAL IDENTIFICATION</h3>
<ul>
  <li><strong>Legal / Commercial Name:</strong> {{PARTNER_NAME}}</li>
  <li><strong>Registered Email:</strong> {{PARTNER_EMAIL}}</li>
  <li><strong>Contact Phone:</strong> {{PARTNER_PHONE}}</li>
  <li><strong>Fiscal / Official Address:</strong> {{PARTNER_ADDRESS}}</li>
  <li><strong>Designated Bank:</strong> {{BANK_NAME}}</li>
  <li><strong>Bank Account / CLABE:</strong> {{BANK_ACCOUNT}}</li>
</ul>

<h3>2. PURPOSE & SCOPE OF SERVICE</h3>
<p>Partner agrees to provide high-quality freight, moving, and cargo transportation services requested by users through the platform in compliance with all municipal, state, and federal transit regulations.</p>

<h3>3. INDEPENDENT CONTRACTOR STATUS</h3>
<p>The relationship between XM and Partner is solely that of independent commercial entities. Nothing in this Agreement shall constitute an employment, agency, or partnership relationship.</p>

<h3>4. SETTLEMENT, COMMISSIONS & SURCHARGES</h3>
<p>Partner acknowledges that service payouts will be remitted to the registered bank account after deduction of applicable category-specific platform markups and service fees.</p>

<h3>5. DIGITAL SIGNATURE & EVIDENCE TRACEABILITY</h3>
<p>By electronic confirmation, Partner certifies the accuracy of legal and tax records provided and consents to immutable digital recording of this acceptance.</p>`;

const PartnerContract = () => {
  const editor = useRef(null);
  const [content, setContent] = useState(DEFAULT_CONTRACT_TEMPLATE);
  const [version, setVersion] = useState("v1.0.0");
  const [title, setTitle] = useState("Partner Transportation Service Agreement");
  const [activeTab, setActiveTab] = useState("editor");

  // Queries & Mutations
  const { data: activeDocData, isLoading: isActiveDocLoading } =
    useGetActiveDocumentQuery("PARTNER_SERVICE_CONTRACT");
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetLegalDocumentsHistoryQuery("PARTNER_SERVICE_CONTRACT");
  const { data: consentData, isLoading: isConsentLoading } =
    useGetLegalConsentEvidenceQuery({
      documentType: "PARTNER_SERVICE_CONTRACT",
      page: 1,
      limit: 20,
    });
  const [publishDocument, { isLoading: isPublishing }] =
    usePublishLegalDocumentMutation();

  useEffect(() => {
    if (activeDocData?.data) {
      setContent(activeDocData.data.content || DEFAULT_CONTRACT_TEMPLATE);
      setVersion(activeDocData.data.version || "v1.0.0");
      setTitle(activeDocData.data.title || "Partner Transportation Service Agreement");
    }
  }, [activeDocData]);

  const handlePublish = async () => {
    if (!content.trim() || !version.trim() || !title.trim()) {
      toast.error("Title, version string, and contract template content are required.");
      return;
    }

    try {
      await publishDocument({
        type: "PARTNER_SERVICE_CONTRACT",
        version: version.trim(),
        title: title.trim(),
        content,
      }).unwrap();

      toast.success(`Partner Service Contract (${version}) published successfully!`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to publish contract version");
    }
  };

  // Compile dynamic preview with sample partner data
  const compiledPreview = content
    .replace(/\{\{PARTNER_NAME\}\}/g, SAMPLE_PARTNER_PREVIEW.name)
    .replace(/\{\{PARTNER_EMAIL\}\}/g, SAMPLE_PARTNER_PREVIEW.email)
    .replace(/\{\{PARTNER_PHONE\}\}/g, SAMPLE_PARTNER_PREVIEW.phone)
    .replace(/\{\{PARTNER_ADDRESS\}\}/g, SAMPLE_PARTNER_PREVIEW.address)
    .replace(/\{\{BANK_NAME\}\}/g, SAMPLE_PARTNER_PREVIEW.bank_name)
    .replace(/\{\{BANK_ACCOUNT\}\}/g, SAMPLE_PARTNER_PREVIEW.bank_account);

  const config = {
    readonly: false,
    placeholder: "Draft master service agreement template...",
    style: { height: 500 },
    buttons: [
      "image", "fontsize", "bold", "italic", "underline", "|",
      "font", "brush", "align", "undo", "redo"
    ],
  };

  const historyColumns = [
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      render: (v) => <span className="font-mono font-bold text-xs">{v}</span>,
      width: 100,
    },
    {
      title: "Contract Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Published Date",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (
        active ? <Tag color="green">Active Version</Tag> : <Tag color="default">Archived</Tag>
      ),
      width: 120,
    },
  ];

  const consentColumns = [
    {
      title: "Accepted At",
      dataIndex: "acceptedAt",
      key: "acceptedAt",
      render: (d) => new Date(d).toLocaleString(),
      width: 170,
    },
    {
      title: "Partner Name & Email",
      key: "partner",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-xs text-gray-900">{record?.userId?.name || record?.legalTaxSnapshot?.legalName || "N/A"}</p>
          <p className="text-[11px] text-gray-500">{record?.userId?.email}</p>
        </div>
      ),
    },
    {
      title: "RFC / Tax ID",
      key: "rfc",
      render: (_, record) => (
        <span className="font-mono text-xs font-semibold text-gray-800">
          {record?.legalTaxSnapshot?.rfcOrTaxId || "N/A"}
        </span>
      ),
    },
    {
      title: "Official Address",
      key: "addr",
      render: (_, record) => (
        <span className="text-xs text-gray-600 truncate max-w-xs block">
          {record?.legalTaxSnapshot?.officialAddress || "N/A"}
        </span>
      ),
    },
    {
      title: "Bank & Account",
      key: "bank",
      render: (_, record) => (
        <div className="text-xs">
          <p className="font-medium text-gray-800">{record?.legalTaxSnapshot?.bankName || "N/A"}</p>
          <p className="font-mono text-gray-500 text-[11px]">{record?.legalTaxSnapshot?.bankAccountNumber || "N/A"}</p>
        </div>
      ),
    },
    {
      title: "Version",
      dataIndex: "documentVersion",
      key: "version",
      render: (v) => <span className="font-mono text-xs">{v}</span>,
      width: 90,
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="success">Binding Accepted</Tag>,
      width: 130,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Link to={-1} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IoArrowBackSharp size={18} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="font-bold text-xl text-gray-900">Partner Service Agreement Contract (Feature 2)</h1>
            <p className="text-xs text-gray-500">
              New partners must accept this contract before operating. The system dynamically populates legal, tax, and banking details.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeTab === "editor" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Contract Template
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md transition-all ${
              activeTab === "preview" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <EyeOutlined />
            <span>Dynamic Preview</span>
          </button>
          <button
            onClick={() => setActiveTab("acceptances")}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md transition-all ${
              activeTab === "acceptances" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileDoneOutlined />
            <span>Partner Acceptances</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md transition-all ${
              activeTab === "history" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <HistoryOutlined />
            <span>Version History</span>
          </button>
        </div>
      </div>

      {/* Dynamic Placeholder Guide */}
      <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-950 flex items-center justify-between">
        <div>
          <span className="font-bold">Dynamic Placeholders:</span> Use{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{PARTNER_NAME}}"}</code>,{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{PARTNER_EMAIL}}"}</code>,{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{PARTNER_PHONE}}"}</code>,{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{PARTNER_ADDRESS}}"}</code>,{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{BANK_NAME}}"}</code>,{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200">{"{{BANK_ACCOUNT}}"}</code>.
        </div>
        <Tag color="indigo">Auto-Injected at Signing</Tag>
      </div>

      {/* TAB 1: CONTRACT TEMPLATE EDITOR */}
      {activeTab === "editor" && (
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border rounded-lg mb-5 text-xs">
            <div>
              <span className="text-gray-500 font-medium block mb-1">Contract Title:</span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Partner Transportation Service Agreement"
                size="middle"
              />
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-1">Version Identifier:</span>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v1.0.0"
                size="middle"
              />
            </div>

            <div className="flex flex-col justify-between">
              <span className="text-gray-500 font-medium block mb-1">Active Live Version:</span>
              <div className="flex items-center gap-2 mt-1">
                <Tag color="green" className="font-mono text-xs font-semibold">
                  {activeDocData?.data?.version || "v1.0.0"}
                </Tag>
                <span className="text-gray-400 text-[11px]">
                  Published {activeDocData?.data?.publishedAt ? new Date(activeDocData.data.publishedAt).toLocaleDateString() : "Active"}
                </span>
              </div>
            </div>
          </div>

          {isActiveDocLoading ? (
            <Loading type="editor" />
          ) : (
            <div className="custom-jodit-editor border rounded-lg overflow-hidden">
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-6 border-t pt-4">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <SendOutlined />
              <span>{isPublishing ? "Publishing..." : `Publish New Contract Version (${version})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE DYNAMIC PREVIEW */}
      {activeTab === "preview" && (
        <div className="mt-5">
          <div className="p-4 bg-gray-50 border rounded-lg mb-4 text-xs flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-800">Dynamic Injected Preview:</span> Showing how Partner legal & tax variables compile into the contract text upon generation.
            </div>
            <Tag color="blue">Preview Mode</Tag>
          </div>

          <div
            className="p-8 border rounded-xl bg-white shadow-xs max-w-4xl mx-auto prose max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: compiledPreview }}
          />
        </div>
      )}

      {/* TAB 3: PARTNER ACCEPTANCES & EVIDENCE */}
      {activeTab === "acceptances" && (
        <div className="mt-5">
          {isConsentLoading ? (
            <Loading type="table" />
          ) : (
            <Table
              columns={consentColumns}
              dataSource={consentData?.data?.data || []}
              pagination={{ pageSize: 10 }}
              rowKey="_id"
            />
          )}
        </div>
      )}

      {/* TAB 4: VERSION HISTORY */}
      {activeTab === "history" && (
        <div className="mt-5">
          {isHistoryLoading ? (
            <Loading type="table" />
          ) : (
            <Table
              columns={historyColumns}
              dataSource={historyData?.data || []}
              pagination={false}
              rowKey="_id"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerContract;
