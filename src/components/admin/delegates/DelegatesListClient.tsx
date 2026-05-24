"use client";

import { useState, useMemo } from "react";
import { Search, Download, MoreHorizontal, FileText, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { Delegate } from "@prisma/client";
import { normalizeUniversity } from "@/lib/universityMapping";
import { pdf } from "@react-pdf/renderer";
import DelegatePdfDocument from "./DelegatePdfDocument";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DelegatesListClientProps {
  initialDelegates: Delegate[];
  status: string;
  type: string;
}

export default function DelegatesListClient({ initialDelegates, status, type }: DelegatesListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedSchool, setSelectedSchool] = useState("All");
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv"|"pdf">("csv");
  const [exportType, setExportType] = useState<"simple"|"audit">("simple");

  // Enrich delegates with canonical data
  const enrichedDelegates = useMemo(() => {
    return initialDelegates.map(d => {
      const { canonical, state } = normalizeUniversity(d.university);
      return { ...d, _canonicalSchool: canonical, _state: state };
    });
  }, [initialDelegates]);

  // Extract available states and schools dynamically from the enriched data
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    enrichedDelegates.forEach(d => {
      if (d.isStudent && d._state !== "Not Specified") states.add(d._state);
    });
    return ["All", ...Array.from(states).sort()];
  }, [enrichedDelegates]);

  const availableSchools = useMemo(() => {
    const schools = new Set<string>();
    enrichedDelegates.forEach(d => {
      if (!d.isStudent || d._canonicalSchool === "Not Specified") return;
      if (selectedState === "All" || d._state === selectedState) {
        schools.add(d._canonicalSchool);
      }
    });
    return ["All", ...Array.from(schools).sort()];
  }, [enrichedDelegates, selectedState]);

  // Handle cascading filter resets
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedSchool("All"); // Reset school when state changes
  };

  // Final filtered list
  const filteredDelegates = useMemo(() => {
    return enrichedDelegates.filter(d => {
      // 1. Text Search
      if (search) {
        const query = search.toLowerCase();
        const matchesName = `${d.firstName} ${d.lastName}`.toLowerCase().includes(query);
        const matchesEmail = d.email.toLowerCase().includes(query);
        const matchesRegId = d.regId?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesRegId) return false;
      }
      
      // 2. State & School Filter (Students only typically, or map professionals somehow? 
      // The prompt specifically mentions School/State filter)
      if (d.isStudent) {
        if (selectedState !== "All" && d._state !== selectedState) return false;
        if (selectedSchool !== "All" && d._canonicalSchool !== selectedSchool) return false;
      } else {
        // If they are professional, and a specific state/school is selected, we might hide them
        // unless they are explicitly filtered by 'Professional' type tab where state/school drops might be hidden.
        if (selectedState !== "All" || selectedSchool !== "All") return false;
      }

      return true;
    });
  }, [enrichedDelegates, search, selectedState, selectedSchool]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `Delegates_${exportType}_${dateStr}`;

      if (exportFormat === "csv") {
        let csvContent = "";
        
        if (exportType === "simple") {
          csvContent = "Name,School/Profession,Reg ID\n";
          filteredDelegates.forEach(d => {
            const affil = d.isStudent ? d._canonicalSchool : (d.profession || "N/A");
            csvContent += `"${d.firstName} ${d.lastName}","${affil}","${d.regId || ""}"\n`;
          });
        } else {
          // Audit
          csvContent = "Reg ID,First Name,Last Name,Email,Phone,Type,Affiliation,State,Payment Status,Amount,Date\n";
          filteredDelegates.forEach(d => {
            const affil = d.isStudent ? d._canonicalSchool : (d.profession || "N/A");
            const typeStr = d.isStudent ? "Student" : "Professional";
            csvContent += `"${d.regId || ""}","${d.firstName}","${d.lastName}","${d.email}","${d.phone}","${typeStr}","${affil}","${d._state || "N/A"}","${d.status}",${d.amount},"${new Date(d.createdAt).toLocaleDateString()}"\n`;
          });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      else if (exportFormat === "pdf") {
        const filtersInfo = `Status: ${status} | Type: ${type} | State: ${selectedState} | School: ${selectedSchool}`;
        const blob = await pdf(<DelegatePdfDocument delegates={filteredDelegates} isAudit={exportType === 'audit'} filtersInfo={filtersInfo} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating export.");
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-950">
            {status === 'pending' ? 'Pending Registrations' : 'Conference Delegates'}
          </h1>
          <p className="text-forest-500 text-sm">
            {status === 'pending' 
              ? `There are ${filteredDelegates.length} registrations awaiting payment confirmation.`
              : `Manage and track all ${filteredDelegates.length} verified participants.`}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-forest-200 px-4 py-2.5 rounded-xl text-forest-700 font-medium hover:bg-forest-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-forest-100 shadow-sm space-y-4">
        
        {/* Top Row: Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search delegates by name, email, or Reg ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
          </div>

          <div className="flex gap-2 bg-forest-50 p-1.5 rounded-2xl border border-forest-100 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'paid', label: 'Verified' },
              { id: 'pending', label: 'Pending' },
              { id: 'all', label: 'All' },
            ].map((t) => {
              const isActive = status === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/admin/delegates?status=${t.id}${type !== 'all' ? `&type=${type}` : ''}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-forest-900 shadow-sm border border-forest-100' 
                      : 'text-forest-400 hover:text-forest-600'
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          <div className="w-full md:w-48">
            <select 
              value={type}
              onChange={(e) => window.location.href = `/admin/delegates?status=${status}&type=${e.target.value}`}
              className="w-full px-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm font-medium"
            >
              <option value="all">All Categories</option>
              <option value="student">Students Only</option>
              <option value="professional">Professionals Only</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Smart Filters (States & Schools) */}
        {type !== 'professional' && (
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-forest-50">
            <div className="w-full md:w-1/3 flex items-center gap-2">
              <span className="text-xs font-bold text-forest-400 uppercase tracking-widest w-16">State:</span>
              <select 
                value={selectedState}
                onChange={handleStateChange}
                className="flex-1 px-4 py-2 bg-white border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm font-medium shadow-sm"
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st === "All" ? "All States" : st}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/3 flex items-center gap-2">
              <span className="text-xs font-bold text-forest-400 uppercase tracking-widest w-16">School:</span>
              <select 
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm font-medium shadow-sm"
              >
                {availableSchools.map(sch => (
                  <option key={sch} value={sch}>{sch === "All" ? "All Universities" : sch}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-forest-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest-50/50 border-b border-forest-100 text-forest-500 text-xs uppercase tracking-wider">
                <th className="p-6 font-semibold">Delegate</th>
                <th className="p-6 font-semibold">Category</th>
                <th className="p-6 font-semibold">Affiliation / State</th>
                <th className="p-6 font-semibold">Reg ID</th>
                <th className="p-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {filteredDelegates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-forest-400">
                    No delegates found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredDelegates.map((delegate) => (
                  <tr key={delegate.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-forest-900">{delegate.firstName} {delegate.lastName}</span>
                        <span className="text-xs text-forest-500">{delegate.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        delegate.isStudent ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}>
                        {delegate.isStudent ? 'Student' : 'Professional'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-forest-600 font-bold">
                          {delegate.isStudent ? delegate._canonicalSchool : delegate.profession}
                        </span>
                        {delegate.isStudent && delegate._state !== "Not Specified" && (
                          <span className="text-[10px] text-forest-400 uppercase tracking-widest">
                            {delegate._state} State
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100">
                        #{delegate.regId}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-forest-400 hover:text-forest-900 transition-colors p-2 rounded-lg hover:bg-forest-50">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm"
              onClick={() => !isExporting && setShowExportModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-forest-100"
            >
              <div className="p-6 border-b border-forest-50 flex justify-between items-center bg-forest-50/50">
                <h3 className="text-xl font-heading font-bold text-forest-900">Export Delegates</h3>
                <button 
                  onClick={() => !isExporting && setShowExportModal(false)}
                  className="p-2 text-forest-400 hover:text-forest-900 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Format Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-forest-400 uppercase tracking-widest">Export Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setExportFormat("csv")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        exportFormat === "csv" ? "border-gold-500 bg-gold-50 text-gold-700" : "border-forest-100 hover:border-forest-200 text-forest-600"
                      }`}
                    >
                      <FileSpreadsheet className={`w-8 h-8 mb-2 ${exportFormat === "csv" ? "text-gold-500" : "text-forest-400"}`} />
                      <span className="font-bold text-sm">CSV File</span>
                    </button>
                    <button
                      onClick={() => setExportFormat("pdf")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        exportFormat === "pdf" ? "border-gold-500 bg-gold-50 text-gold-700" : "border-forest-100 hover:border-forest-200 text-forest-600"
                      }`}
                    >
                      <FileText className={`w-8 h-8 mb-2 ${exportFormat === "pdf" ? "text-gold-500" : "text-forest-400"}`} />
                      <span className="font-bold text-sm">PDF Document</span>
                    </button>
                  </div>
                </div>

                {/* Type Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-forest-400 uppercase tracking-widest">Information Detail</label>
                  <div className="space-y-2">
                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      exportType === "simple" ? "border-forest-900 bg-forest-50" : "border-forest-100 hover:border-forest-200"
                    }`}>
                      <input 
                        type="radio" name="exportType" value="simple" 
                        checked={exportType === "simple"} onChange={() => setExportType("simple")}
                        className="mt-1 w-4 h-4 text-forest-900 focus:ring-forest-900 border-forest-300" 
                      />
                      <div>
                        <p className="font-bold text-forest-900 text-sm">Simple List</p>
                        <p className="text-xs text-forest-500 mt-1 leading-relaxed">Names, Schools, and Registration IDs only. Great for quick attendance checking.</p>
                      </div>
                    </label>
                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      exportType === "audit" ? "border-forest-900 bg-forest-50" : "border-forest-100 hover:border-forest-200"
                    }`}>
                      <input 
                        type="radio" name="exportType" value="audit" 
                        checked={exportType === "audit"} onChange={() => setExportType("audit")}
                        className="mt-1 w-4 h-4 text-forest-900 focus:ring-forest-900 border-forest-300" 
                      />
                      <div>
                        <p className="font-bold text-forest-900 text-sm">Audit List (Full Detail)</p>
                        <p className="text-xs text-forest-500 mt-1 leading-relaxed">Includes all collected information (Email, Phone, Payment Status, etc) for thorough review.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-forest-900 text-white py-4 rounded-xl font-bold hover:bg-forest-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating {exportFormat.toUpperCase()}...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download {filteredDelegates.length} Records
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
