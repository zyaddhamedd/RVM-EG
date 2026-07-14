'use client';

import { useState, useMemo, useTransition } from 'react';
import { Search, Filter, X, CheckCircle, XCircle, Clock, LogOut, ChevronRight } from 'lucide-react';
import { logout, updateApplicationStatus, updateApplicationNotes } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';

export function AdminDashboard({ initialCreators }: { initialCreators: Record<string, any>[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState<Record<string, any> | null>(null);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const filteredCreators = useMemo(() => {
    return initialCreators.filter(c => {
      const matchesSearch = search === '' || 
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.instagram.toLowerCase().includes(search.toLowerCase()) ||
        c.tiktok.toLowerCase().includes(search.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [initialCreators, search, statusFilter]);

  const handleStatusChange = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    startTransition(async () => {
      await updateApplicationStatus(id, status);
      if (selectedCreator?.id === id) {
        setSelectedCreator({ ...selectedCreator, status });
      }
    });
  };

  const handleNotesSave = () => {
    if (!selectedCreator) return;
    startTransition(async () => {
      await updateApplicationNotes(selectedCreator.id, notes);
      setSelectedCreator({ ...selectedCreator, notes });
    });
  };

  const openCreator = (c: Record<string, any>) => {
    setSelectedCreator(c);
    setNotes(c.notes || '');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="border-b border-neutral-900 bg-neutral-950 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium tracking-tight">RVM Applications</h1>
          <span className="text-neutral-500 text-sm bg-neutral-900 px-2 py-1 rounded-full">{filteredCreators.length} total</span>
        </div>
        <button onClick={handleLogout} className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Table Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-neutral-900 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search name, email, phone, social..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#CCFF00]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-900 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-medium text-neutral-400">Creator</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">City</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Social</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Status</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Applied</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredCreators.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => openCreator(c)}
                    className={`hover:bg-neutral-900/50 cursor-pointer transition-colors ${selectedCreator?.id === c.id ? 'bg-neutral-900' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.full_name}</div>
                      <div className="text-neutral-500 text-xs mt-1">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">{c.city}</td>
                    <td className="px-6 py-4">
                      <a href={c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-[#CCFF00] hover:underline block" onClick={e => e.stopPropagation()}>IG</a>
                      <a href={c.tiktok.startsWith('http') ? c.tiktok : `https://tiktok.com/${c.tiktok}`} target="_blank" rel="noreferrer" className="text-[#CCFF00] hover:underline block mt-1" onClick={e => e.stopPropagation()}>TT</a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'approved' ? 'bg-green-900/30 text-green-400' : c.status === 'rejected' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-500">
                      <ChevronRight className="w-4 h-4 inline-block" />
                    </td>
                  </tr>
                ))}
                {filteredCreators.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Drawer */}
        {selectedCreator && (
          <div className="w-96 border-l border-neutral-900 bg-neutral-950 flex flex-col flex-shrink-0 overflow-y-auto shadow-2xl z-20">
            <div className="p-6 border-b border-neutral-900 flex justify-between items-center sticky top-0 bg-neutral-950">
              <h2 className="text-lg font-medium">Application Details</h2>
              <button onClick={() => setSelectedCreator(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8 flex-1">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusChange(selectedCreator.id, 'approved')}
                  disabled={isPending}
                  className={`flex-1 py-2 rounded font-medium text-sm border transition-colors ${selectedCreator.status === 'approved' ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-500 hover:bg-green-900/20'}`}
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedCreator.id, 'rejected')}
                  disabled={isPending}
                  className={`flex-1 py-2 rounded font-medium text-sm border transition-colors ${selectedCreator.status === 'rejected' ? 'bg-red-500 text-black border-red-500' : 'border-red-900 text-red-500 hover:bg-red-900/20'}`}
                >
                  <XCircle className="w-4 h-4 inline mr-1" /> Reject
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedCreator.id, 'pending')}
                  disabled={isPending}
                  className={`flex-1 py-2 rounded font-medium text-sm border transition-colors ${selectedCreator.status === 'pending' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-yellow-900 text-yellow-500 hover:bg-yellow-900/20'}`}
                >
                  <Clock className="w-4 h-4 inline mr-1" /> Pend
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Basic Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">Name</span> <span>{selectedCreator.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Age</span> <span>{selectedCreator.age}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Gender</span> <span className="capitalize">{selectedCreator.gender}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">City</span> <span>{selectedCreator.city}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Phone</span> <span>{selectedCreator.phone}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Email</span> <span>{selectedCreator.email}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Social Links</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Instagram</span> 
                    <a href={selectedCreator.instagram.startsWith('http') ? selectedCreator.instagram : `https://instagram.com/${selectedCreator.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-[#CCFF00] hover:underline truncate ml-4 max-w-[200px]">{selectedCreator.instagram}</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">TikTok</span> 
                    <a href={selectedCreator.tiktok.startsWith('http') ? selectedCreator.tiktok : `https://tiktok.com/${selectedCreator.tiktok}`} target="_blank" rel="noreferrer" className="text-[#CCFF00] hover:underline truncate ml-4 max-w-[200px]">{selectedCreator.tiktok}</a>
                  </div>
                  {selectedCreator.facebook && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Facebook</span> 
                      <span className="truncate ml-4">{selectedCreator.facebook}</span>
                    </div>
                  )}
                  {selectedCreator.portfolio_url && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Portfolio</span> 
                      <a href={selectedCreator.portfolio_url} target="_blank" rel="noreferrer" className="text-[#CCFF00] hover:underline truncate ml-4 max-w-[200px]">Link</a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Details</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-neutral-400 block mb-1">Has UGC Experience?</span>
                    <span>{selectedCreator.has_ugc_experience ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Preferred Niches</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCreator.preferred_niches?.map((n: string) => <span key={n} className="bg-neutral-800 px-2 py-1 rounded text-xs">{n}</span>)}
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Languages</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCreator.languages?.map((l: string) => <span key={l} className="bg-neutral-800 px-2 py-1 rounded text-xs">{l}</span>)}
                    </div>
                  </div>
                  {selectedCreator.equipment && (
                    <div>
                      <span className="text-neutral-400 block mb-1">Equipment</span>
                      <span className="text-neutral-300 leading-relaxed">{selectedCreator.equipment}</span>
                    </div>
                  )}
                  {selectedCreator.availability && (
                    <div>
                      <span className="text-neutral-400 block mb-1">Availability</span>
                      <span className="text-neutral-300 leading-relaxed">{selectedCreator.availability}</span>
                    </div>
                  )}
                  {selectedCreator.why_join && (
                    <div>
                      <span className="text-neutral-400 block mb-1">Why Join RVM?</span>
                      <p className="bg-neutral-900 p-3 rounded text-neutral-300 leading-relaxed text-xs">
                        {selectedCreator.why_join}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Internal Notes</h3>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add private notes here..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm min-h-[100px] focus:outline-none focus:border-[#CCFF00]"
                />
                <button 
                  onClick={handleNotesSave}
                  disabled={isPending || notes === selectedCreator.notes}
                  className="mt-2 w-full bg-white text-black py-2 rounded text-sm font-medium disabled:opacity-50 hover:bg-neutral-200 transition-colors"
                >
                  {isPending ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
