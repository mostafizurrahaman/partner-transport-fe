import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import {
  useGetActiveDocumentQuery,
  useGetLegalDocumentsHistoryQuery,
  usePublishLegalDocumentMutation,
} from '../../redux/api/legalAgreementApi';
import { useUpdatePrivacyPolicyMutation } from '../../redux/api/settingApi';
import { toast } from 'sonner';
import Loading from '../../Components/Loading/Loading';
import { Input, Table, Tag } from 'antd';
import { HistoryOutlined, SendOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [title, setTitle] = useState('Privacy Notice and Personal Data Authorization');
  const [activeTab, setActiveTab] = useState('editor');

  // Queries & Mutations
  const { data: activeDocData, isLoading: isActiveDocLoading } =
    useGetActiveDocumentQuery('PRIVACY_NOTICE');
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetLegalDocumentsHistoryQuery('PRIVACY_NOTICE');
  const [publishDocument, { isLoading: isPublishing }] =
    usePublishLegalDocumentMutation();
  const [updateLegacyPrivacy] = useUpdatePrivacyPolicyMutation();

  useEffect(() => {
    if (activeDocData?.data) {
      setContent(activeDocData.data.content || '');
      setVersion(activeDocData.data.version || 'v1.0.0');
      setTitle(activeDocData.data.title || 'Privacy Notice and Personal Data Authorization');
    }
  }, [activeDocData]);

  const handlePublish = async () => {
    if (!content.trim() || !version.trim() || !title.trim()) {
      toast.error('Title, version string, and content are required.');
      return;
    }

    try {
      // 1. Publish new version in legal agreements system
      await publishDocument({
        type: 'PRIVACY_NOTICE',
        version: version.trim(),
        title: title.trim(),
        content,
      }).unwrap();

      // 2. Also update legacy setting API for backward compatibility
      await updateLegacyPrivacy({ description: content }).unwrap();

      toast.success(`Privacy Notice (${version}) published successfully!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to publish new version');
    }
  };

  const config = {
    readonly: false,
    placeholder: 'Enter Privacy Notice and Personal Data Authorization text...',
    style: { height: 500 },
    buttons: [
      'image', 'fontsize', 'bold', 'italic', 'underline', '|',
      'font', 'brush', 'align', 'undo', 'redo'
    ]
  };

  const historyColumns = [
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: (v) => <span className='font-mono font-bold text-xs'>{v}</span>,
      width: 100,
    },
    {
      title: 'Document Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Published Date',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        active ? <Tag color="green">Active Version</Tag> : <Tag color="default">Archived</Tag>
      ),
      width: 120,
    },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b'>
        <div className='flex items-center gap-3'>
          <Link to={-1} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <IoArrowBackSharp size={18} className='text-gray-700' />
          </Link>
          <div>
            <h1 className='font-bold text-xl text-gray-900'>Privacy Notice & Data Authorization</h1>
            <p className='text-xs text-gray-500'>
              Manage Privacy Notice versions (Feature 13). Must cover personal, legal, tax, location, device, service, invoice, claims, ratings, and operational data.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className='flex bg-gray-100 p-1 rounded-lg text-xs font-semibold'>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeTab === 'editor' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Document Editor
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md transition-all ${
              activeTab === 'history' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HistoryOutlined />
            <span>Version History</span>
          </button>
        </div>
      </div>

      {/* Scope Guidance Callout (Feature 13 requirement) */}
      <div className='mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center gap-2 text-xs text-cyan-900'>
        <SafetyCertificateOutlined className='text-cyan-700 text-base flex-shrink-0' />
        <span>
          <strong>Required Scope:</strong> Ensure this policy expressly authorises processing of: personal identity, legal documents, tax info (RFC), live geolocation, device identifiers, service logs, invoice requests, dispute claims, driver ratings, and platform operational metrics.
        </span>
      </div>

      {activeTab === 'editor' ? (
        <div className='mt-5'>
          {/* Active version info bar */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border rounded-lg mb-5 text-xs'>
            <div>
              <span className='text-gray-500 font-medium block mb-1'>Document Title:</span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Privacy Notice and Personal Data Authorization"
                size="middle"
              />
            </div>

            <div>
              <span className='text-gray-500 font-medium block mb-1'>Version Identifier:</span>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v1.1.0"
                size="middle"
              />
            </div>

            <div className='flex flex-col justify-between'>
              <span className='text-gray-500 font-medium block mb-1'>Active Live Version:</span>
              <div className='flex items-center gap-2 mt-1'>
                <Tag color="green" className='font-mono text-xs font-semibold'>
                  {activeDocData?.data?.version || 'v1.0.0'}
                </Tag>
                <span className='text-gray-400 text-[11px]'>
                  Published {activeDocData?.data?.publishedAt ? new Date(activeDocData.data.publishedAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Jodit Editor */}
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

          {/* Save & Publish Action */}
          <div className='flex items-center justify-end gap-3 mt-6 border-t pt-4'>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className='flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors shadow-sm disabled:opacity-50'
            >
              <SendOutlined />
              <span>{isPublishing ? 'Publishing...' : `Publish New Version (${version})`}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className='mt-5'>
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

export default PrivacyPolicy;