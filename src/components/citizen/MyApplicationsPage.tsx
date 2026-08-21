import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  Search, ShieldCheck, ChevronRight, Copy, Check, ExternalLink,
  Calendar, UserCheck, X, FileCode
} from 'lucide-react';
import { Language, AppRoute, Application } from '../../types';
import { getStoredApplications } from '../../data/portalData';

interface MyApplicationsPageProps {
  language: Language;
  onNavigate: (route: AppRoute) => void;
}

export function MyApplicationsPage({
  language,
  onNavigate,
}: MyApplicationsPageProps) {
  const [applications, setApplications] = useState<Application[]>(() => getStoredApplications());
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalCount = applications.length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review').length;
  const inProgressCount = applications.filter(a => a.status === 'In Progress').length;
  const resolvedCount = applications.filter(a => a.status === 'Resolved').length;

  const filteredApplications = applications.filter(app => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = app.applicationId.toLowerCase().includes(q);
      const matchCat = app.category.toLowerCase().includes(q);
      const matchDesc = app.description.toLowerCase().includes(q);
      const matchAdv = app.advocateName.toLowerCase().includes(q);
      if (!matchId && !matchCat && !matchDesc && !matchAdv) return false;
    }
    return true;
  });

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'Grievance & Case Tracking' : 'आवेदन व वाद स्थिति'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'My Applications' : 'मेरे आवेदन व शिकायतें'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'en'
              ? 'Real-time multi-stage status, legal notices, and advocate case filings.'
              : 'आवेदन की वर्तमान स्थिति, कानूनी नोटिस ड्राफ्ट और समयरेखा देखें।'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('chat')}
          className="py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>{language === 'en' ? 'Draft New Grievance' : 'नया आवेदन तैयार करें'}</span>
          <ArrowRight className="w-4 h-4 text-sky-200" />
        </button>
      </div>

      {/* Top Metric Statistics (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Filed</span>
          <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All registered records</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-1">
          <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">Under Review</span>
          <p className="text-2xl font-extrabold text-amber-600">{underReviewCount}</p>
          <span className="text-[10px] text-slate-400">Advocate scrutinizing</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-1">
          <span className="text-[11px] text-sky-600 font-bold uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-extrabold text-sky-600">{inProgressCount}</p>
          <span className="text-[10px] text-slate-400">Notice dispatched / filed</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-1">
          <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Resolved</span>
          <p className="text-2xl font-extrabold text-emerald-600">{resolvedCount}</p>
          <span className="text-[10px] text-slate-400">Settled / Closed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Under Review', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Applications Cards Grid (Section 22) */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-sky-100 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No applications found matching criteria.</h3>
          <p className="text-xs text-slate-500">You can start a new complaint or legal consultation inquiry.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">{app.category}</span>
                  <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md">
                    #{app.applicationId}
                  </span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    Payment: {app.paymentStatus} (₹{app.fee})
                  </span>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${
                  app.status === 'Under Review' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : app.status === 'In Progress'
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Grievance Summary</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{app.description}</p>
                  
                  {app.appointmentDate && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>Consultation Slot: <strong>{app.appointmentDate} at {app.appointmentTime}</strong></span>
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Counsel</span>
                  <p className="text-xs font-bold text-slate-900">{app.advocateName}</p>
                  <p className="text-[11px] text-slate-500">Contact: {app.advocateContact}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Representation Accepted
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Last Updated: {new Date(app.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>

                <div className="flex items-center gap-2">
                  {app.draftDocument && (
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="py-1.5 px-3 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>View Notice Draft</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="py-1.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View Status Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Application Detail & Multi-Stage Timeline Modal (Section 23) */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded">
                  #{selectedApplication.applicationId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedApplication.category}</h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Multi-Stage Sequence (Section 23) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Application Status Timeline
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedApplication.timeline.map((stage, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      stage.status === 'completed'
                        ? 'bg-emerald-600 border-white text-white'
                        : stage.status === 'current'
                        ? 'bg-sky-600 border-white text-white animate-pulse'
                        : 'bg-slate-200 border-white'
                    }`}>
                      {stage.status === 'completed' && <Check className="w-2.5 h-2.5" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          stage.status === 'completed' 
                            ? 'text-slate-900' 
                            : stage.status === 'current'
                            ? 'text-sky-700 font-extrabold'
                            : 'text-slate-400'
                        }`}>
                          {stage.title}
                        </span>
                        {stage.date && (
                          <span className="text-[10px] text-slate-400">({stage.date})</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice Draft Text (if available) */}
            {selectedApplication.draftDocument && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-sky-600" />
                    <span>Generated Statutory Notice Draft</span>
                  </h4>
                  <button
                    onClick={() => handleCopyDraft(selectedApplication.draftDocument!)}
                    className="py-1 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer border border-sky-200"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                  {selectedApplication.draftDocument}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="py-2.5 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
