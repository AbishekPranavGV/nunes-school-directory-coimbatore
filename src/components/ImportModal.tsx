'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, ArrowRight, Play } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError('');
      setResultMessage('');
      await runPreview(selectedFile);
    }
  };

  const runPreview = async (targetFile: File) => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', targetFile);
      fd.append('mode', 'preview');

      const res = await fetch('/api/import', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Preview failed');
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('mode', 'execute');

      const res = await fetch('/api/import', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setResultMessage(data.message);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample23 = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/export?type=sample23&format=csv');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'sample_23_schools.csv', { type: 'text/csv' });
      setFile(sampleFile);
      await runPreview(sampleFile);
    } catch (err: any) {
      setError('Could not load sample fixture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Import School Register</h3>
              <p className="text-xs text-slate-500">Accepts CSV, XLSX, or PDF registers with automated dedupe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resultMessage && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{resultMessage}</span>
            </div>
          )}

          {/* Quick 23-School Acceptance Fixture */}
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-sky-900">Acceptance Test Fixture</p>
              <p className="text-[11px] text-sky-700 mt-0.5">23-school CSV with edge cases (duplicates, blanks, principal offices)</p>
            </div>
            <button
              onClick={handleLoadSample23}
              disabled={loading}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
            >
              <Play className="w-3 h-3" />
              <span>Load 23-School CSV</span>
            </button>
          </div>

          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-sky-50/30 relative">
            <input
              type="file"
              accept=".csv,.xlsx,.pdf,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {file ? file.name : 'Choose a file or drag it here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports UTF-8 CSV, Excel (.xlsx), or PDF registers</p>
            </div>
          </div>

          {/* Preview Details */}
          {previewData && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between font-bold text-slate-800 border-b pb-2">
                <span>File Analysis: {previewData.filename}</span>
                <span className="text-sky-700">{previewData.total_rows} Total Rows</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-lg border">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Valid Schools</p>
                  <p className="text-base font-bold text-slate-800">{previewData.valid_rows}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Duplicates Reconciled</p>
                  <p className="text-base font-bold text-amber-600">{previewData.duplicate_count}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Missing Contacts</p>
                  <p className="text-base font-bold text-rose-600">{previewData.missing_contacts_count}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteImport}
            disabled={!file || loading || Boolean(resultMessage)}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>{loading ? 'Processing...' : 'Execute Import & Deduplicate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
