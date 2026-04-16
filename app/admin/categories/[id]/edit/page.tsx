/* Phase 5: Edit category page */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";

export const metadata = {
  title: "Edit Category",
  description: "Edit category",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await db.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground mt-1">Update category details</p>
      </div>

      <SimpleCRUDForm
        type="category"
        itemId={id}
        item={category}
      />
    </div>
  );
}
