import { createClient } from "@/utils/supabase/server";

export type UserRole = "admin" | "staff" | "user";

/**
 * Fetches the role of the currently authenticated user from the profiles table.
 */
export async function getUserRole(): Promise<{ role: UserRole | null; error: any }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { role: null, error: "No authenticated user" };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Auth helper: Profile fetch error:", error);
  }

  return { role: (profile?.role as UserRole) || null, error };
}

/**
 * Checks if the current user has administrative rights (admin or staff).
 */
export async function isAuthorizedAdmin(): Promise<boolean> {
  const { role } = await getUserRole();
  return (role as string) === "admin" || (role as string) === "staff";
}

/**
 * Checks if the current user is a super admin.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const { role } = await getUserRole();
  return (role as string) === "admin";
}
