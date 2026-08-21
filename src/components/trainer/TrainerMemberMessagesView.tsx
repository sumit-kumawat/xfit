import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  Search,
  Dumbbell,
  Apple,
  TrendingUp,
  ChevronRight,
  Scale,
  User,
  X,
  Eye,
  Download,
  FileText,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MessageAttachment } from '../../types';

export const TrainerMemberMessagesView: React.FC = () => {
  const {
    activeTrainer,
    customers,
    chatMessages,
    sendMessage,
    selectedMemberId,
    setSelectedMemberId,
    setActiveView,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const trainerCustomers = customers.filter(
    (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
  );

  const activeCustomer =
    trainerCustomers.find((c) => c.id === selectedMemberId) ||
    trainerCustomers[0] ||
    customers[0];

  // Messages between this trainer and the selected member
  const threadMessages = chatMessages.filter(
    (m) =>
      (m.senderId === activeTrainer.userId && m.receiverId === activeCustomer?.userId) ||
      (m.senderId === activeCustomer?.userId && m.receiverId === activeTrainer.userId) ||
      (m.senderId === activeCustomer?.userId && m.receiverId === 'user-trainer-sarah') ||
      (m.senderId === 'user-trainer-sarah' && m.receiverId === activeCustomer?.userId)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && pendingAttachments.length === 0) return;
    if (!activeCustomer) return;

    sendMessage(
      activeCustomer.userId,
      inputText.trim(),
      undefined,
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );
    setInputText('');
    setPendingAttachments([]);
  };

  const handleSimulateAttach = (fileType: 'image' | 'pdf') => {
    if (fileType === 'image') {
      const sampleImg: MessageAttachment = {
        id: `att-${Date.now()}`,
        name: 'bench_press_setup_guide.jpg',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
        fileType: 'image',
        fileSizeBytes: 320000,
      };
      setPendingAttachments((prev) => [...prev, sampleImg]);
      showToast('Image Attached', 'Ready to send coaching infographic.', 'info');
    } else {
      const samplePdf: MessageAttachment = {
        id: `att-${Date.now()}`,
        name: 'weekly_metabolic_target_sheet.pdf',
        url: '#',
        fileType: 'pdf',
        fileSizeBytes: 540000,
      };
      setPendingAttachments((prev) => [...prev, samplePdf]);
      showToast('Document Attached', 'Ready to send target sheet PDF.', 'info');
    }
  };

  const filteredMembers = trainerCustomers.filter((c) =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[600px] max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Left Sidebar: Client List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50">
        <div className="p-3.5 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
            />
          </div>
        </div>

        {/* Clients list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredMembers.map((member) => {
            const isSelected = member.id === activeCustomer?.id;
            return (
              <div
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-white border-l-4 border-[#a73827]' : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-[8px] object-cover border border-slate-200"
                  />
                  {member.status === 'active' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{member.fullName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{member.currentWeightLbs} lbs</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{member.tier} Coaching</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat Conversation Thread */}
      {activeCustomer ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Thread Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <img
                src={activeCustomer.avatarUrl}
                alt={activeCustomer.fullName}
                className="w-9 h-9 rounded-[8px] object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900">{activeCustomer.fullName}</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {activeCustomer.currentWeightLbs} lbs • Goal: {activeCustomer.goalWeightLbs} lbs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('member_progress')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-[6px] text-xs font-bold transition-colors cursor-pointer"
              >
                View Dossier
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
            {threadMessages.map((msg) => {
              const isMe = msg.senderId === activeTrainer.userId || msg.senderId === 'user-trainer-sarah';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={activeCustomer.avatarUrl}
                      alt={activeCustomer.fullName}
                      className="w-7 h-7 rounded-[6px] object-cover border border-slate-200 shrink-0 mb-1"
                    />
                  )}

                  <div className={`max-w-md space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-[10px] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#a73827] text-white shadow-2xs rounded-br-xs'
                          : 'bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.mediaUrl && (
                        <div className="mt-2 rounded-[6px] overflow-hidden border border-white/20">
                          <img
                            src={msg.mediaUrl}
                            alt="Attachment"
                            className="w-full h-36 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedPreviewImage(msg.mediaUrl || null)}
                          />
                        </div>
                      )}

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              className={`p-2 rounded-[6px] flex items-center justify-between gap-2 text-[11px] ${
                                isMe ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {att.fileType === 'image' ? (
                                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <FileText className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span className="truncate font-semibold">{att.name}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {att.fileType === 'image' ? (
                                  <button
                                    onClick={() => setSelectedPreviewImage(att.url)}
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => showToast('Document Download', `Viewing ${att.name}`, 'info')}
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer"
                                  >
                                    <Download className="w-3 h-3" />
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
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Attachments */}
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
                title="Attach Coaching Infographic"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSimulateAttach('pdf')}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Attach Target Sheet PDF"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeCustomer.fullName}...`}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && pendingAttachments.length === 0}
              className="p-2 bg-[#a73827] hover:bg-[#8f2f20] disabled:bg-slate-200 text-white rounded-[8px] transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
          Select a client from the left roster to view message history.
        </div>
      )}

      {/* Lightbox Modal */}
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
