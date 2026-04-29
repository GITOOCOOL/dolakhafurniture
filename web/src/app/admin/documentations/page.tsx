import React from "react";
import fs from "fs";
import path from "path";
import DocumentationTabs from "@/components/admin/DocumentationTabs";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDocumentationsPage() {
  // Read markdown files from the project root
  const rootDir = process.cwd();
  
  let storeManual = "Error: DOLAKHA_FURNITURE_MANUAL.md not found.";
  let adminManual = "Error: DOLAKHA_ADMIN_DASHBOARD_MANUAL.md not found.";

  try {
    storeManual = fs.readFileSync(path.join(rootDir, "..", "DOLAKHA_FURNITURE_MANUAL.md"), "utf-8");
  } catch (error) {
    console.error("Could not read store manual:", error);
  }

  try {
    adminManual = fs.readFileSync(path.join(rootDir, "..", "DOLAKHA_ADMIN_DASHBOARD_MANUAL.md"), "utf-8");
  } catch (error) {
    console.error("Could not read admin manual:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-soft pb-6">
        <div className="p-3 bg-action/10 rounded-2xl">
          <BookOpen size={24} className="text-action" />
        </div>
        <div>
          <h1 className="text-3xl font-serif italic text-heading">System Documentations</h1>
          <p className="text-sm font-sans text-description mt-1">
            Reference materials and operation manuals for staff.
          </p>
        </div>
      </div>

      <DocumentationTabs storeManual={storeManual} adminManual={adminManual} />
    </div>
  );
}
