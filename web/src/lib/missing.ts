// Fallback when a business field is empty in Sanity (or Sanity is unreachable).
// While developing it is loud, so a missing Studio field is noticed; on the live site it is
// empty, so customers never see placeholder text. getBusinessMetaData() logs missing fields.
const isProd = process.env.NODE_ENV === "production";

export const MISSING = isProd ? "" : "undefined_setmetadata_in_studio";
export const MISSING_URL = isProd ? "" : "https://undefined_setmetadata_in_studio.com";
