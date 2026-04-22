"use server";

import { sanityAdminClient } from "@/lib/sanity.admin";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function createArtisanProduct(formData: any) {
  try {
    const { role } = await getUserRole();
    if (role !== "admin" && role !== "staff") {
      throw new Error("Unauthorized access to the Artisan Forge.");
    }

    const { title, price, stock, categoryId, length, breadth, height, description, imageAssetId } = formData;

    if (!title || !price || !categoryId) {
      throw new Error("Title, Price, and Category are mandatory for a new creation.");
    }

    const slug = slugify(title);

    const doc: any = {
      _type: "product",
      title,
      slug: { _type: "slug", current: slug },
      price: Number(price),
      stock: Number(stock) || 0,
      category: { _type: "reference", _ref: categoryId },
      length: length ? Number(length) : undefined,
      breadth: breadth ? Number(breadth) : undefined,
      height: height ? Number(height) : undefined,
      description,
      isActive: true,
      syncToFacebook: true,
      isFeatured: false,
    };

    if (imageAssetId) {
      doc.mainImage = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAssetId }
      };
    }

    const result = await sanityAdminClient.create(doc);
    revalidatePath("/admin/inventory");
    return { success: true, productId: result._id };
  } catch (error: any) {
    console.error("Forge Creation Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateArtisanProduct(productId: string, formData: any) {
  try {
    const { role } = await getUserRole();
    if (role !== "admin" && role !== "staff") {
      throw new Error("Unauthorized access to the Artisan Forge.");
    }

    const updates: any = {
      title: formData.title,
      price: formData.price ? Number(formData.price) : undefined,
      stock: formData.stock !== undefined ? Number(formData.stock) : undefined,
      description: formData.description,
      length: formData.length ? Number(formData.length) : undefined,
      breadth: formData.breadth ? Number(formData.breadth) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
    };

    if (formData.categoryId) {
      updates.category = { _type: "reference", _ref: formData.categoryId };
    }

    if (formData.imageAssetId) {
      updates.mainImage = {
        _type: "image",
        asset: { _type: "reference", _ref: formData.imageAssetId }
      };
    }

    // Clean undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    await sanityAdminClient.patch(productId).set(updates).commit();
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Forge Update Error:", error);
    return { success: false, error: error.message };
  }
}
