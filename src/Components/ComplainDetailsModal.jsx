import { Image, Modal, Tag } from 'antd'
import React, { useState } from 'react'
import { imageUrl, getFullImageUrl } from '../redux/api/baseApi'
import { useAddClaimAdminNoteMutation } from '../redux/api/supportApi'
import { toast } from 'sonner'
import { CheckCircleOutlined, MessageOutlined } from '@ant-design/icons'

const ComplainDetailsModal = ({
  openComplainModal,
  setOpenComplainModal,
  complainDetails,
  onOpenResolveModal
}) => {
  const [newNote, setNewNote] = useState('')
  const [addNote, { isLoading: isAddingNote }] = useAddClaimAdminNoteMutation()

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) {
      toast.error("Please enter a note")
      return
    }

    try {
      await addNote({
        claimId: complainDetails?.complainId,
        note: newNote.trim()
      }).unwrap()

      toast.success("Admin note added successfully")
      setNewNote('')
      // Close modal or update local note list
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add note")
    }
  }

  const claimTypeMap = {
    SERVICE_NON_COMPLIANCE: { label: "Service Non-Compliance", color: "orange" },
    DAMAGES: { label: "Damages to Goods", color: "red" },
    CANCELLATION_ISSUE: { label: "Cancellation Dispute", color: "volcano" },
    PRICE_DISCREPANCY: { label: "Price Difference", color: "gold" },
    LOCATION_PROBLEM: { label: "Location Issue", color: "blue" },
    LACK_OF_RESPONSE: { label: "Lack of Response", color: "purple" },
    DELIVERY_PROBLEM: { label: "Delivery Problem", color: "cyan" },
    OTHER: { label: "Other / General", color: "default" }
  }

  const typeConfig = claimTypeMap[complainDetails?.claimType] || {
    label: complainDetails?.claimType || "General",
    color: "blue"
  }

  return (
    <Modal
      centered
      footer={false}
      open={openComplainModal}
      onCancel={() => setOpenComplainModal(false)}
      width={680}
    >
      <div className='p-2 max-h-[82vh] overflow-y-auto'>
        <div className='border-b pb-3 mb-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold text-gray-900'>Claim Review & Resolution</h1>
            <Tag color={typeConfig.color} className='font-semibold px-2.5 py-0.5 text-xs'>
              {typeConfig.label}
            </Tag>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            Order ID: #{complainDetails?.orderId || 'N/A'} • Claim ID: #{complainDetails?.complainId || 'N/A'}
          </p>
        </div>

        {/* Claim Header Details */}
        <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border text-sm mb-4'>
          <div>
            <p className='text-xs text-gray-500 uppercase font-medium'>Claimant ({complainDetails?.userType || 'User'})</p>
            <p className='font-semibold text-gray-900 mt-0.5'>{complainDetails?.userName || "N/A"}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 uppercase font-medium'>Claim Against</p>
            <p className='font-semibold text-gray-900 mt-0.5'>{complainDetails?.complainAgainst || "N/A"}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 uppercase font-medium'>Date Submitted</p>
            <p className='font-medium text-gray-800 mt-0.5'>{complainDetails?.date}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 uppercase font-medium'>Current Status</p>
            <Tag color={
              complainDetails?.status === 'resolved' ? 'green' :
              complainDetails?.status === 'rejected' ? 'red' :
              complainDetails?.status === 'in-progress' ? 'orange' : 'blue'
            } className='mt-0.5 capitalize font-semibold'>
              {complainDetails?.status}
            </Tag>
          </div>
        </div>

        {/* Description */}
        <div className='mb-4'>
          <p className='font-semibold text-sm text-gray-800 mb-1.5'>Claim Description:</p>
          <div className='p-3 bg-gray-50 border rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
            {complainDetails?.fullDescription || complainDetails?.complain || "No description provided."}
          </div>
        </div>

        {/* Evidence Photos */}
        {(() => {
          const evidenceList = Array.isArray(complainDetails?.evidence)
            ? complainDetails.evidence
            : complainDetails?.evidence
            ? [complainDetails.evidence]
            : [];

          if (evidenceList.length === 0) return null;

          return (
            <div className='mb-6'>
              <p className='font-semibold text-sm text-gray-800 mb-2'>
                Photographic Evidence ({evidenceList.length})
              </p>
              <Image.PreviewGroup>
                <div className='grid grid-cols-3 gap-3'>
                  {evidenceList.map((evi, i) => (
                    <div key={i} className='border rounded-lg p-1 bg-gray-50 flex items-center justify-center overflow-hidden'>
                      <Image
                        src={getFullImageUrl(evi)}
                        className='rounded-md object-cover w-full'
                        height={120}
                        alt={`Claim Evidence ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          );
        })()}

        {/* Final Decision Section (if already resolved) */}
        {complainDetails?.finalDecision?.resolutionType && (
          <div className='mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl'>
            <div className='flex items-center gap-2 text-emerald-800 font-bold text-sm'>
              <CheckCircleOutlined />
              <span>Final Administrative Decision: {complainDetails.finalDecision.resolutionType}</span>
            </div>
            {complainDetails.finalDecision.penaltyOrRefundAmount > 0 && (
              <p className='text-sm text-emerald-700 mt-1 font-semibold'>
                Financial Amount: ${complainDetails.finalDecision.penaltyOrRefundAmount}
              </p>
            )}
            <p className='text-xs text-emerald-700 mt-2 bg-white/70 p-2.5 rounded border border-emerald-100'>
              "{complainDetails.finalDecision.decisionNotes}"
            </p>
          </div>
        )}

        {/* Admin Review Notes Section (Feature 11) */}
        <div className='border-t pt-4 mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-bold text-sm text-gray-900 flex items-center gap-2'>
              <MessageOutlined />
              <span>Internal Admin Notes & Comments</span>
            </h3>
            {complainDetails?.adminNotes?.length > 0 && (
              <span className='text-xs text-gray-500'>{complainDetails.adminNotes.length} notes</span>
            )}
          </div>

          {/* List of existing notes */}
          {complainDetails?.adminNotes?.length > 0 ? (
            <div className='space-y-2 mb-3 max-h-48 overflow-y-auto'>
              {complainDetails.adminNotes.map((n, i) => (
                <div key={i} className='p-2.5 bg-gray-50 border rounded-lg text-xs'>
                  <div className='flex justify-between items-center text-gray-500 mb-1'>
                    <span className='font-semibold text-gray-800'>{n.adminId?.name || "Admin"}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className='text-gray-700 leading-normal'>{n.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-xs text-gray-400 italic mb-3'>No internal review notes added yet.</p>
          )}

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className='flex gap-2'>
            <input
              type='text'
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder='Add internal investigation note...'
              className='flex-1 border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
            />
            <button
              type='submit'
              disabled={isAddingNote}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50'
            >
              {isAddingNote ? 'Saving...' : 'Add Note'}
            </button>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className='flex justify-between items-center border-t pt-4'>
          <button
            type='button'
            onClick={() => setOpenComplainModal(false)}
            className='px-4 py-1.5 border rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors'
          >
            Close
          </button>

          {onOpenResolveModal && (
            <button
              type='button'
              onClick={() => {
                setOpenComplainModal(false)
                onOpenResolveModal(complainDetails)
              }}
              className='flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-xs font-semibold transition-colors shadow-sm'
            >
              <CheckCircleOutlined />
              <span>Record Final Decision (Feature 11)</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ComplainDetailsModal