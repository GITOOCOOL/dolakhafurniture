"use client";

import { useState } from "react";
import { Users, Mail, Shield, ShieldAlert, ShieldCheck, ChevronDown, UserCircle2, UserPlus, X, Key, Copy, Check, ShieldPlus, Trash2 } from "lucide-react";
import { addStaffMember, deleteStaffMember } from "@/app/actions/adminUsers";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
}

export default function AdminUsersClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Recruitment State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{email: string; pass: string} | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "staff"
  });

  const updateRole = async (targetUserId: string, newRole: string) => {
    setUpdatingId(targetUserId);
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, newRole }),
      });
      if (res.ok) {
        setProfiles(profiles.map(p => p.id === targetUserId ? { ...p, role: newRole } : p));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await addStaffMember(formData);
      if (result.success) {
        setSuccessData({ email: result.email!, pass: result.tempPassword! });
        // We don't refresh immediately because they need to see the password
        setFormData({ email: "", fullName: "", role: "staff" });
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("An error occurred while adding staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.pass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === "thakurisuraj38@gmail.com") return;
    
    if (!confirm(`Are you sure you want to purge ${email}? This action is irreversible and will recycle the email for new recruitment.`)) {
      return;
    }

    setUpdatingId(userId);
    try {
      const result = await deleteStaffMember(userId);
      if (result.success) {
        setProfiles(profiles.filter(p => p.id !== userId));
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to purge user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const roleConfigs: Record<string, { color: string; icon: any }> = {
    admin: { color: "bg-red-500/10 text-red-600", icon: ShieldAlert },
    staff: { color: "bg-action/10 text-action", icon: ShieldCheck },
    user: { color: "bg-soft text-label", icon: Shield },
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-end gap-6">
        {/* ONBOARDING HELP */}
        <div className="bg-action/5 border border-action/20 rounded-[2.5rem] p-8 flex items-start gap-6 flex-1">
           <div className="w-12 h-12 bg-action text-white rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <Users size={20} />
           </div>
           <div>
              <h3 className="text-sm font-bold text-heading mb-1 uppercase tracking-widest">Team Management</h3>
              <p className="text-xs text-label leading-relaxed font-serif italic max-w-2xl">
                To onboard new staff, you can either wait for their signup or directly recruit them using the 
                <span className="text-action font-bold mx-1">Artisan Direct</span> tool.
              </p>
           </div>
        </div>

        <button 
          onClick={() => {
            setSuccessData(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-3 px-10 py-5 bg-heading text-app rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-action transition-all shadow-2xl shadow-heading/20 group"
        >
           <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
           Add New Artisan
        </button>
      </div>

      <div className="bg-app border border-soft rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-soft border-dotted">
                <th className="px-10 py-8 text-[9px] font-sans font-bold uppercase tracking-widest text-label">Member</th>
                <th className="px-10 py-8 text-[9px] font-sans font-bold uppercase tracking-widest text-label font-serif italic text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft divide-dotted">
              {profiles.map((profile) => {
                const Config = roleConfigs[profile.role.toLowerCase()] || roleConfigs.user;
                return (
                  <tr key={profile.id} className="group hover:bg-soft/20 transition-colors">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-soft border border-divider flex items-center justify-center overflow-hidden flex-shrink-0">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle2 className="text-label opacity-30" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-heading mb-1">{profile.full_name || "New Artisan"}</p>
                          <div className="flex items-center gap-2 text-label">
                            <Mail size={12} className="opacity-40" />
                            <span className="text-[10px] font-medium tracking-widest">{profile.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <div className="inline-flex items-center gap-4">
                        <div className="relative">
                          <select 
                            value={profile.role.toLowerCase()}
                            disabled={updatingId === profile.id}
                            onChange={(e) => updateRole(profile.id, e.target.value)}
                            className={`
                              appearance-none pl-6 pr-10 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest 
                              transition-all outline-none cursor-pointer border border-transparent hover:border-action/20
                              ${Config.color}
                              ${updatingId === profile.id ? "opacity-50" : ""}
                            `}
                          >
                            <option value="user">User</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                        </div>
                        <div className={`p-2.5 rounded-xl ${Config.color}`}>
                          <Config.icon size={16} strokeWidth={2} />
                        </div>
                        
                        {profile.email !== "thakurisuraj38@gmail.com" && (
                          <button 
                            onClick={() => handleDeleteUser(profile.id, profile.email)}
                            disabled={updatingId === profile.id}
                            className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm ml-2"
                            title="Purge Artisan"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {profiles.length === 0 && (
        <div className="text-center py-24 italic font-serif text-label opacity-40 uppercase tracking-widest text-[10px]">
          Waiting for users to explore the atelier...
        </div>
      )}

      {/* RECRUITMENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Artisan Direct Recruitment"
        noPadding
      >
        {!successData ? (
          <form onSubmit={handleAddStaff} className="p-10 space-y-8">
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4">Full Legal Name</label>
                   <input 
                     required
                     type="text" 
                     placeholder="e.g., Sangita Kafle" 
                     className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-action transition-all"
                     value={formData.fullName}
                     onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4">Auth Email Address</label>
                   <input 
                     required
                     type="email" 
                     placeholder="staff@dolakhafurniture.com" 
                     className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-action transition-all"
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4">Access Level</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, role: 'staff'})}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${formData.role === 'staff' ? 'bg-action/5 border-action text-action' : 'bg-surface border-soft text-label'}`}
                      >
                         <ShieldCheck size={20} />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Staff Member</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, role: 'admin'})}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${formData.role === 'admin' ? 'bg-red-500/5 border-red-500/30 text-red-600' : 'bg-surface border-soft text-label'}`}
                      >
                         <ShieldAlert size={20} />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Full Admin</span>
                      </button>
                   </div>
                </div>
             </div>

             <div className="pt-6">
                <Button fullWidth type="submit" isLoading={isSubmitting}>
                   Confirm Recruitment
                </Button>
                <p className="text-[9px] text-center mt-6 text-label font-serif italic opacity-60">
                   A temporary password will be generated for the new artisan.
                </p>
             </div>
          </form>
        ) : (
          <div className="p-10 space-y-10 animate-in zoom-in duration-500">
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                   <ShieldPlus size={40} />
                </div>
                <div>
                   <h3 className="type-section text-xl">Recruitment Successful</h3>
                   <p className="type-label text-label normal-case italic font-serif mt-2">
                     Account created for {successData.email}
                   </p>
                </div>
             </div>

             <div className="bg-surface border border-soft rounded-[2.5rem] p-8 space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label text-center">Temporary Access Key</p>
                <div className="relative group">
                   <input 
                     readOnly
                     type="text" 
                     value={successData.pass}
                     className="w-full bg-app border border-soft rounded-2xl px-6 py-6 text-xl font-mono font-bold text-heading text-center tracking-widest cursor-default focus:outline-none"
                   />
                   <button 
                     onClick={copyPassword}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-heading text-app rounded-xl hover:bg-action transition-all shadow-lg active:scale-90"
                   >
                     {copied ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                </div>
                <p className="text-[9px] text-center text-action font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                   <Key size={12} /> Share this key with the new staff member
                </p>
             </div>

             <Button fullWidth variant="ghost" onClick={() => {
               setIsAddModalOpen(false);
               window.location.reload(); // Refresh to show new user
             }}>
                Return to Directory
             </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
