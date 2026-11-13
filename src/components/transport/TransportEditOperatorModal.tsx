'use client';

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Truck, 
  Bus, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Building2, 
  Plus, 
  Trash2,
  Check
} from 'lucide-react';
import { TransportRecord, BranchOffice, TransportCategoryType } from '@/types/transport';

interface TransportEditOperatorModalProps {
  operator: TransportRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: TransportRecord) => void;
}

const CATEGORIES: TransportCategoryType[] = [
  'Omni Bus (Intercity Sleeper / AC)',
  'Tourist Coach & Contract Carriage',
  'Staff & Educational Bus',
  'Heavy Commercial Lorry (Multi-Axle)',
  'Bulk LPG & Petroleum Tanker',
  'Container & Port Logistics',
  'ODC & Heavy Trailer Haulage',
  'Parcel, Express Cargo & FTL',
  'Mini Truck & Light Commercial'
];

export const TransportEditOperatorModal: React.FC<TransportEditOperatorModalProps> = ({
  operator,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<TransportRecord | null>(operator);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'main' | 'branches'>('main');

  // New branch form state
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchWhatsApp, setNewBranchWhatsApp] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');

  React.useEffect(() => {
    setFormData(operator);
  }, [operator]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof TransportRecord, value: any) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleAddBranch = () => {
    if (!newBranchCity || !newBranchName) {
      alert('Please enter branch city and name');
      return;
    }

    const newBranch: BranchOffice = {
      id: `BR-${Date.now().toString().slice(-6)}`,
      branch_name: newBranchName,
      city: newBranchCity,
      district: newBranchCity,
      manager_name: newBranchManager || 'Branch In-charge',
      phone: newBranchPhone || formData.contact_number,
      whatsapp: newBranchWhatsApp || formData.whatsapp_number,
      address: newBranchAddress || `${newBranchCity} Central Transshipment Yard`,
      pincode: '600001',
      facility_type: 'Booking & Passenger Terminal',
      is_headquarters: false
    };

    const updatedBranches = [...(formData.branches || []), newBranch];
    setFormData(prev => prev ? ({ ...prev, branches: updatedBranches }) : null);

    setNewBranchCity('');
    setNewBranchName('');
    setNewBranchPhone('');
    setNewBranchWhatsApp('');
    setNewBranchManager('');
    setNewBranchAddress('');
  };

  const handleRemoveBranch = (branchId: string) => {
    const updatedBranches = (formData.branches || []).filter(b => b.id !== branchId);
    setFormData(prev => prev ? ({ ...prev, branches: updatedBranches }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    try {
      const res = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit_operator', operator: formData })
      });
      const data = await res.json();
      if (data.success) {
        onSave(formData);
        onClose();
      } else {
        alert(data.error || 'Failed to save changes');
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              {formData.service_type === 'bus' ? <Bus className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Edit Transport Fleet & Regional Branches
              </h2>
              <p className="text-xs text-slate-500">
                Editing: <strong className="text-slate-800">{formData.company_name}</strong> (ID: {formData.id})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveSubTab('main')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeSubTab === 'main'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Core Company & Owner Info
          </button>
          <button
            onClick={() => setActiveSubTab('branches')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'branches'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Regional Branches</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px]">
              {formData.branches?.length || 0}
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
          
          {activeSubTab === 'main' && (
            <div className="space-y-4">
              
              {/* Row 1: Company Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Company / Fleet Name:</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Owner Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Owner / MD Name:</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => handleChange('owner_name', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Designation:</label>
                  <input
                    type="text"
                    value={formData.owner_designation}
                    onChange={(e) => handleChange('owner_designation', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Row 3: WhatsApp Number & Primary Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">WhatsApp Number (e.g. 919842742655):</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Primary Phone Number:</label>
                  <input
                    type="text"
                    value={formData.contact_number}
                    onChange={(e) => handleChange('contact_number', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Email & City Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Email / Gmail ID:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">City Hub & District:</label>
                  <input
                    type="text"
                    value={formData.city_hub}
                    onChange={(e) => handleChange('city_hub', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Row 5: Address */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Headquarters / Main Depot Address:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                />
              </div>

              {/* Row 6: Fleet Size, Permit & GST */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Fleet Size:</label>
                  <input
                    type="text"
                    value={formData.fleet_size}
                    onChange={(e) => handleChange('fleet_size', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">GSTIN:</label>
                  <input
                    type="text"
                    value={formData.gstin || ''}
                    onChange={(e) => handleChange('gstin', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Verification Status:</label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => handleChange('verification_status', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Active">Active</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {activeSubTab === 'branches' && (
            <div className="space-y-4">
              
              {/* Existing Branches List */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Current Registered Branches ({formData.branches?.length || 0}):</label>
                
                {(!formData.branches || formData.branches.length === 0) ? (
                  <p className="text-slate-400 p-3 bg-slate-50 rounded-xl text-center">No regional branches registered yet.</p>
                ) : (
                  formData.branches.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{b.branch_name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-semibold">{b.city}</span>
                          {b.is_headquarters && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">HQ</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{b.address} • Phone: {b.phone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(b.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Branch Box */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add New Branch Office in Tamil Nadu
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    placeholder="City (e.g. Madurai, Trichy, Tirupur, Erode)"
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Branch Name (e.g. Mattuthavani Hub Depot)"
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="Branch Phone Number"
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newBranchWhatsApp}
                    onChange={(e) => setNewBranchWhatsApp(e.target.value)}
                    placeholder="Branch WhatsApp (919842...)"
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <input
                  type="text"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="Full Branch Postal Address"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />

                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Confirm & Append Branch
                </button>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
