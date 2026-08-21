import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  X,
  Award,
  Download,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MessageAttachment } from '../../types';

export const CustomerChatView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    activeCustomer,
    activeTrainer,
    chatMessages,
    sendMessage,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showBookSessionModal, setShowBookSessionModal] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionForm, setSessionForm] = useState({
    date: '2026-08-25',
    time: '11:00 AM',
    type: '1-on-1 Form Check & Technique Review',
    notes: 'Please review bench press bar path and squat depth.',
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && pendingAttachments.length === 0) return;

    sendMessage(
      activeTrainer.userId || 'user-trainer-sarah',
      inputMessage.trim(),
      undefined,
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );
    setInputMessage('');
    setPendingAttachments([]);
  };

  const handleSimulateAttach = (fileType: 'image' | 'pdf') => {
    if (fileType === 'image') {
      const sampleImg: MessageAttachment = {
        id: `att-${Date.now()}`,
        name: 'squat_depth_formcheck.jpg',
        url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
        fileType: 'image',
        fileSizeBytes: 245000,
      };
      setPendingAttachments((prev) => [...prev, sampleImg]);
      showToast('Image Attached', 'Ready to send form check photo.', 'info');
    } else {
      const samplePdf: MessageAttachment = {
        id: `att-${Date.now()}`,
        name: 'bloodwork_lipid_panel.pdf',
        url: '#',
        fileType: 'pdf',
        fileSizeBytes: 1048576,
      };
      setPendingAttachments((prev) => [...prev, samplePdf]);
      showToast('Document Attached', 'Ready to send lipid panel PDF.', 'info');
    }
  };

  const handleBookSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookSessionModal(false);
    sendMessage(
      activeTrainer.userId || 'user-trainer-sarah',
      `[Session Booking Request] Scheduled ${sessionForm.type} on ${sessionForm.date} at ${sessionForm.time}. Notes: ${sessionForm.notes}`
    );
    showToast(
      'Session Booked',
      `Booked ${sessionForm.type} with ${activeTrainer.fullName} on ${sessionForm.date} at ${sessionForm.time}.`,
      'success'
    );
  };

  // Filter messages between current user and trainer
  const conversation = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeTrainer.userId) ||
      (m.senderId === activeTrainer.userId && m.receiverId === currentUser.id) ||
      (m.senderId === 'user-trainer-sarah' && m.receiverId === 'user-cust-alex') ||
      (m.senderId === 'user-cust-alex' && m.receiverId === 'user-trainer-sarah')
  );

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[580px] flex flex-col bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden animate-in fade-in duration-200">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeTrainer.avatarUrl}
              alt={activeTrainer.fullName}
              className="w-10 h-10 rounded-[8px] object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{activeTrainer.fullName}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline">
                Assigned Head Coach
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online • Real-Time Client Portal
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowBookSessionModal(true)}
            className="px-3 py-1.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book 1-on-1 Session</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40">
        {conversation.map((msg) => {
          const isMe = msg.senderId === currentUser.id || msg.senderId === 'user-cust-alex';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={activeTrainer.avatarUrl}
                  alt={activeTrainer.fullName}
                  className="w-7 h-7 rounded-[6px] object-cover border border-slate-200 shrink-0 mb-1"
                />
              )}

              <div className={`max-w-md space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-[10px] text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#a73827] text-white shadow-2xs rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Legacy mediaUrl or new attachments array */}
                  {msg.mediaUrl && (
                    <div className="mt-2 rounded-[8px] overflow-hidden border border-white/20">
                      <img
                        src={msg.mediaUrl}
                        alt="Shared attachment"
                        className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedPreviewImage(msg.mediaUrl || null)}
                      />
                    </div>
                  )}

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`p-2 rounded-[6px] flex items-center justify-between gap-2 text-[11px] ${
                            isMe ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {att.fileType === 'image' ? (
                              <ImageIcon className="w-4 h-4 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 shrink-0" />
                            )}
                            <span className="truncate font-semibold">{att.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {att.fileType === 'image' ? (
                              <button
                                onClick={() => setSelectedPreviewImage(att.url)}
                                className="p-1 hover:bg-white/20 rounded cursor-pointer"
                                title="View Image"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => showToast('Document Opened', `Viewing ${att.name}`, 'info')}
                                className="p-1 hover:bg-white/20 rounded cursor-pointer"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-1 text-[10px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Attachments Bar */}
      {pendingAttachments.length > 0 && (
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Attached:</span>
          {pendingAttachments.map((att, idx) => (
            <div
              key={att.id || idx}
              className="px-2 py-1 bg-white border border-slate-200 rounded-[6px] text-xs flex items-center gap-2 shadow-2xs"
            >
              {att.fileType === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-[#a73827]" /> : <FileText className="w-3.5 h-3.5 text-blue-600" />}
              <span className="truncate max-w-[120px] font-medium">{att.name}</span>
              <button
                onClick={() => setPendingAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSimulateAttach('image')}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Attach Form Check Photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSimulateAttach('pdf')}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Attach Bloodwork / Lab PDF"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message Coach ${activeTrainer.fullName}...`}
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() && pendingAttachments.length === 0}
          className="p-2 bg-[#a73827] hover:bg-[#8f2f20] disabled:bg-slate-200 text-white rounded-[8px] transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookSessionModal}
        onClose={() => setShowBookSessionModal(false)}
        title="Schedule 1-on-1 Coaching Session"
      >
        <form onSubmit={handleBookSessionSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={sessionForm.time}
                onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Session Format</label>
            <select
              value={sessionForm.type}
              onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
            >
              <option value="1-on-1 In-Person Form Check">1-on-1 In-Person Form Check</option>
              <option value="Virtual Technique Video Consultation">Virtual Technique Video Consultation</option>
              <option value="Nutrition & Biometrics Calibration">Nutrition & Biometrics Calibration</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specific Goals / Discussion Points</label>
            <textarea
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowBookSessionModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#a73827] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* Image Preview Lightbox */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-[10px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">Attachment Preview</span>
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={selectedPreviewImage} alt="Preview" className="w-full max-h-[70vh] object-contain bg-slate-950" />
          </div>
        </div>
      )}
    </div>
  );
};
