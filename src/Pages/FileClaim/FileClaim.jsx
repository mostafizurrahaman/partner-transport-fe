import { Avatar, Button, DatePicker, Image, Pagination, Select, Space, Table, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import { CiEdit, CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import user2 from '../../assets/images/user2.png'
import { EyeOutlined, CheckCircleOutlined, FilterOutlined } from '@ant-design/icons'
import PenaltyModal from '../../Components/PenaltyModal'
import ComplainDetailsModal from '../../Components/ComplainDetailsModal'
import ClaimResolutionModal from '../../Components/ClaimResolutionModal'
import { CLAIM_TYPES } from '../../Components/ClaimFilingModal'
import { useGetAllFileClaimQuery, useUpdateClaimedStatusMutation } from '../../redux/api/supportApi'
import { imageUrl, getFullImageUrl } from '../../redux/api/baseApi'
import { toast } from 'sonner'
import Loading from '../../Components/Loading/Loading'

const FileClaim = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [claimTypeFilter, setClaimTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [page, setPage] = useState(1)

  // Modals state
  const [openPenaltyModal, setOpenPenaltyModal] = useState(false)
  const [openComplainModal, setOpenComplainModal] = useState(false)
  const [openResolveModal, setOpenResolveModal] = useState(false)
  const [complainDetails, setComplainDetails] = useState(null)
  const [selectedClaimForResolve, setSelectedClaimForResolve] = useState(null)
  const [serviceId, setServiceId] = useState(null)

  // API Call with filters
  const { data: getAllFileClaim, isLoading } = useGetAllFileClaimQuery({
    searchTerm,
    claimType: claimTypeFilter !== 'all' ? claimTypeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page
  });
  const [updateClaimedStatus] = useUpdateClaimedStatusMutation()

  const handleStatusChange = (value, id) => {
    const data = {
      claimId: id,
      status: value
    }
    updateClaimedStatus(data).unwrap()
      .then((payload) => toast.success(payload?.message || "Status updated successfully"))
      .catch((error) => toast.error(error?.data?.message || "Failed to update status"));
  }

  const claimTypeMap = {
    SERVICE_NON_COMPLIANCE: { label: "Non-Compliance", color: "orange" },
    DAMAGES: { label: "Damages", color: "red" },
    CANCELLATION_ISSUE: { label: "Cancellation", color: "volcano" },
    PRICE_DISCREPANCY: { label: "Price Dispute", color: "gold" },
    LOCATION_PROBLEM: { label: "Location Issue", color: "blue" },
    LACK_OF_RESPONSE: { label: "No Response", color: "purple" },
    DELIVERY_PROBLEM: { label: "Delivery Problem", color: "cyan" },
    OTHER: { label: "Other", color: "default" }
  }

  const rawClaimsList = getAllFileClaim?.data?.data || []

  // Client-side date filter if selected
  const filteredClaims = rawClaimsList.filter((item) => {
    if (!selectedDate) return true
    return item?.createdAt?.split('T')[0] === selectedDate
  })

  const formattedTableData = filteredClaims.map((file, i) => {
    const claimantName = file?.serviceId?.mainService === 'move'
      ? (file?.user?.name || file?.name)
      : (file?.serviceId?.confirmedPartner?.name || file?.name);

    const rawClaimantAvatar = file?.user?.profile_image || file?.serviceId?.user?.profile_image;
    const claimantAvatar = rawClaimantAvatar ? getFullImageUrl(rawClaimantAvatar) : null;

    const againstName = file?.serviceId?.mainService === 'move'
      ? file?.serviceId?.confirmedPartner?.name
      : file?.serviceId?.user?.name;

    const rawAgainstAvatar = file?.serviceId?.confirmedPartner?.profile_image || file?.serviceId?.user?.profile_image;
    const againstAvatar = rawAgainstAvatar ? getFullImageUrl(rawAgainstAvatar) : null;

    // Ensure evidence is always an array of string paths
    const rawEvidence = file?.fileClaimImage;
    const evidenceList = Array.isArray(rawEvidence)
      ? rawEvidence
      : rawEvidence
      ? [rawEvidence]
      : [];

    return {
      key: file?._id || i,
      rawItem: file,
      complainId: file?._id,
      orderId: file?.serviceId?._id || file?.orderId,
      date: file?.createdAt?.split('T')[0],
      claimType: file?.claimType || "OTHER",
      isDuringActiveService: file?.isDuringActiveService,
      userName: claimantName || "Unknown",
      userType: file?.userType || (file?.serviceId?.mainService === 'move' ? 'User' : 'Partner'),
      userAvatar: claimantAvatar ? <img src={claimantAvatar} alt="Avatar" /> : <img src={user2} alt="Avatar" />,
      complain: file?.description?.slice(0, 32) + (file?.description?.length > 32 ? "..." : ""),
      fullDescription: file?.description,
      complainAgainst: againstName || "N/A",
      complainAgainstAvatar: againstAvatar ? <img src={againstAvatar} alt="Against Avatar" /> : <img src={user2} alt="Avatar" />,
      status: file?.status || 'pending',
      evidence: evidenceList,
      adminNotes: file?.adminNotes || [],
      finalDecision: file?.finalDecision || null,
    };
  });

  const columns = [
    {
      title: 'Claim ID',
      dataIndex: 'complainId',
      key: 'complainId',
      render: (id) => <span className='font-mono font-medium text-xs text-gray-700'>#{id ? id.slice(-6) : 'N/A'}</span>,
      width: 100,
    },
    {
      title: 'Order / Service',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id, record) => (
        <div>
          <span className='font-mono text-xs text-blue-600 font-semibold'>#{id ? id.slice(-6) : 'N/A'}</span>
          {record.isDuringActiveService && (
            <span className='block text-[10px] text-amber-600 font-medium'>⚡ Active Service</span>
          )}
        </div>
      ),
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Claimant',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.userAvatar} size={32} />
          <div>
            <p className='font-medium text-xs text-gray-900'>{record.userName}</p>
            <Tag color={record.userType === 'Partner' ? 'purple' : 'cyan'} className='text-[10px] leading-tight px-1.5 py-0'>
              {record.userType}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Claim Reason / Type',
      dataIndex: 'claimType',
      key: 'claimType',
      render: (type) => {
        const config = claimTypeMap[type] || { label: type || "General", color: "blue" };
        return <Tag color={config.color} className='font-medium text-xs'>{config.label}</Tag>;
      },
    },
    {
      title: 'Claim Against',
      key: 'complainAgainst',
      render: (_, record) => (
        <Space>
          <Avatar src={record.complainAgainstAvatar} size={28} />
          <span className='text-xs text-gray-700'>{record.complainAgainst}</span>
        </Space>
      ),
    },
    {
      title: 'Evidence',
      dataIndex: 'evidence',
      key: 'evidence',
      render: (evidence) => {
        const evList = Array.isArray(evidence) ? evidence : evidence ? [evidence] : [];
        if (!evList.length) return <span className='text-gray-400 text-xs italic'>No photos</span>;
        return (
          <Image.PreviewGroup>
            <div className='flex items-center gap-1.5'>
              <Image
                src={getFullImageUrl(evList[0])}
                className='rounded-md object-cover border'
                width={36}
                height={36}
                alt="Evidence"
              />
              {evList.length > 1 && (
                <Tag className='text-[10px] px-1 font-semibold text-gray-600 bg-gray-100'>+{evList.length - 1}</Tag>
              )}
            </div>
          </Image.PreviewGroup>
        );
      },
      width: 110,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Select
          size="small"
          value={record.status}
          onChange={(value) => handleStatusChange(value, record.complainId)}
          style={{ width: 125 }}
          options={[
            { value: 'pending', label: '🟡 Pending' },
            { value: 'in-progress', label: '🟠 In Progress' },
            { value: 'resolved', label: '🟢 Resolved' },
            { value: 'rejected', label: '🔴 Rejected' },
          ]}
        />
      ),
      width: 135,
    },
    {
      title: 'Final Outcome',
      key: 'finalDecision',
      render: (_, record) => {
        if (record.finalDecision?.resolutionType) {
          const colors = {
            REFUND: 'green',
            PENALTY_APPLIED: 'volcano',
            NO_ACTION: 'blue',
            DISMISSED: 'gray'
          };
          return (
            <Tag color={colors[record.finalDecision.resolutionType] || 'default'} className='text-xs font-semibold'>
              {record.finalDecision.resolutionType}
            </Tag>
          );
        }
        return <span className='text-gray-400 text-xs italic'>Pending</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-1.5'>
          {/* View Details & Notes */}
          <Tooltip title="View Details & Add Internal Notes">
            <Button
              size="small"
              onClick={() => {
                setComplainDetails(record);
                setOpenComplainModal(true);
              }}
              type="primary"
              icon={<EyeOutlined />}
            />
          </Tooltip>

          {/* Record Final Decision */}
          <Tooltip title="Record Final Decision (Feature 11)">
            <Button
              size="small"
              onClick={() => {
                setSelectedClaimForResolve(record);
                setOpenResolveModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              icon={<CheckCircleOutlined />}
            />
          </Tooltip>

          {/* Penalty */}
          <Tooltip title="Apply Penalty">
            <Button
              size="small"
              onClick={() => {
                setServiceId(record);
                setOpenPenaltyModal(true);
              }}
              className='bg-red-500 hover:bg-red-600 text-white'
              icon={<CiEdit size={16} />}
            />
          </Tooltip>
        </div>
      ),
      width: 130,
    },
  ];

  return (
    <div className='p-6 bg-white rounded-lg shadow-sm'>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Link to={-1} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <FaArrowLeft size={18} className='text-gray-700' />
          </Link>
          <div>
            <h1 className='font-bold text-xl text-gray-900'>Claims Management Dashboard (Feature 11)</h1>
            <p className='text-xs text-gray-500'>Investigate service claims, track active disputes, add notes, and record final resolutions</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User, Partner, Order ID..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <CiSearch size={18} />
          </span>
        </div>
      </div>

      {/* Advanced Filter Toolbar (Feature 11) */}
      <div className='mt-4 p-4 bg-gray-50 rounded-lg border flex flex-wrap items-center gap-4 text-xs'>
        <div className='flex items-center gap-1.5 font-semibold text-gray-700'>
          <FilterOutlined />
          <span>Filters:</span>
        </div>

        {/* Claim Type Filter */}
        <div>
          <span className='text-gray-500 mr-2'>Claim Type:</span>
          <Select
            size="small"
            value={claimTypeFilter}
            onChange={(val) => setClaimTypeFilter(val)}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'All Claim Types' },
              ...CLAIM_TYPES,
            ]}
          />
        </div>

        {/* Status Filter */}
        <div>
          <span className='text-gray-500 mr-2'>Status:</span>
          <Select
            size="small"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>

        {/* Date Filter */}
        <div>
          <span className='text-gray-500 mr-2'>Date:</span>
          <DatePicker
            size="small"
            onChange={(date, dateStr) => setSelectedDate(dateStr)}
          />
        </div>

        {/* Clear Filters Button */}
        {(claimTypeFilter !== 'all' || statusFilter !== 'all' || selectedDate || searchTerm) && (
          <button
            onClick={() => {
              setClaimTypeFilter('all');
              setStatusFilter('all');
              setSelectedDate('');
              setSearchTerm('');
            }}
            className='text-blue-600 hover:underline font-medium ml-auto'
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Claims Table */}
      <div className='mt-4'>
        {isLoading ? (
          <Loading type="table" />
        ) : (
          <Table
            columns={columns}
            dataSource={formattedTableData}
            pagination={false}
            rowKey="key"
          />
        )}

        <div className='flex justify-center mt-6'>
          <Pagination
            current={page}
            onChange={(p) => setPage(p)}
            total={getAllFileClaim?.data?.meta?.total}
            pageSize={getAllFileClaim?.data?.meta?.limit || 10}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* Modals */}
      <PenaltyModal
        setOpenPenaltyModal={setOpenPenaltyModal}
        openPenaltyModal={openPenaltyModal}
        serviceId={serviceId}
      />

      <ComplainDetailsModal
        openComplainModal={openComplainModal}
        setOpenComplainModal={setOpenComplainModal}
        complainDetails={complainDetails}
        onOpenResolveModal={(c) => {
          setSelectedClaimForResolve(c);
          setOpenResolveModal(true);
        }}
      />

      <ClaimResolutionModal
        open={openResolveModal}
        onCancel={() => setOpenResolveModal(false)}
        claim={selectedClaimForResolve}
      />
    </div>
  )
}

export default FileClaim