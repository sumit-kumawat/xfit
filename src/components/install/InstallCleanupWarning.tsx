import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Trash2,
  Terminal,
  CheckCircle,
  Copy,
  AlertTriangle,
  FolderX,
} from 'lucide-react';

export const InstallCleanupWarning: React.FC = () => {
  const { deleteInstallFolder, showToast, installation } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const sshCommand = 'rm -rf ./install && touch ./storage/installed.lock';

  const handleCopy = () => {
    navigator.clipboard.writeText(sshCommand);
    setCopiedCmd(true);
    showToast('Command Copied', 'Lock command copied to clipboard.', 'info');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleExecuteDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      deleteInstallFolder();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased">
      <div className="w-full max-w-2xl bg-white rounded-[10px] border border-rose-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Header */}
        <div className="bg-[#a73827] text-white p-6 flex items-center gap-4">
          <div className="p-2.5 bg-white/20 rounded-[10px] shrink-0">
            <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px] bg-white text-[#a73827]">
              SECURITY LOCKOUT REQUIRED
            </span>
            <h1 className="text-xl font-bold mt-1">Delete /install Folder to Finalize Deployment</h1>
            <p className="text-xs text-rose-100 mt-0.5">
              Normal application operation is locked until the installer folder is permanently purged.
            </p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="p-6 space-y-6">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-[10px] flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Security Requirement</p>
              <p className="mt-0.5 text-rose-800 leading-relaxed">
                Leaving the setup directory open exposes configuration routines to unauthorized access. Engaging the lock ensures production security.
              </p>
            </div>
          </div>

          {/* Secure Removal Action */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recommended: One-Click Direct Purge & Lock
            </h3>
            <p className="text-xs text-slate-600">
              Click below to delete the install directory and generate the production lock barrier.
            </p>

            <button
              onClick={handleExecuteDelete}
              disabled={isDeleting}
              className="w-full py-3 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Trash2 className="w-4 h-4 animate-bounce" />
                  <span>Purging /install directory & engaging lock...</span>
                </>
              ) : (
                <>
                  <FolderX className="w-4 h-4" />
                  <span>Delete /install Directory & Proceed to Admin Login</span>
                </>
              )}
            </button>
          </div>

          {/* Manual Command */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>Alternative: Terminal / Docker Execution</span>
            </h3>

            <div className="p-3 bg-slate-900 rounded-[10px] flex items-center justify-between font-mono text-xs text-emerald-400">
              <span className="truncate pr-2">{sshCommand}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/10 rounded-[6px] text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Copy Command"
              >
                {copiedCmd ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500 font-mono">
              Configured Administrator: <span className="font-bold text-slate-800">{installation.superAdmin.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
