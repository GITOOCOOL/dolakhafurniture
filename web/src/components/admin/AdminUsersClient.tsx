"use client";

import { useState } from "react";
import { Users, Mail, Shield, ShieldAlert, ShieldCheck, ChevronDown, UserCircle2 } from "lucide-react";

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

  const roleConfigs: Record<string, { color: string; icon: any }> = {
    admin: { color: "bg-red-500/10 text-red-600", icon: ShieldAlert },
    staff: { color: "bg-action/10 text-action", icon: ShieldCheck },
    user: { color: "bg-soft text-label", icon: Shield },
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="type-hero font-medium text-heading mb-2">User Access<span className="text-action">.</span></h1>
        <p className="type-label text-label uppercase tracking-widest text-[9px]">Managing Permissions for {profiles.length} Accounts</p>
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
    </div>
  );
}
