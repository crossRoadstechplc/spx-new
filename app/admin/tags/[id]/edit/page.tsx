/* Phase 5: Edit tag page */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";
import { updateTagAction, deleteTagAction, generateTagSlugAction } from "../../actions";

export const metadata = {
  title: "Edit Tag | SPX Admin",
  description: "Edit tag",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;
  const tag = await db.tag.findUnique({
    where: { id },
  });

  if (!tag) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Tag</h1>
        <p className="text-muted-foreground mt-1">Update tag details</p>
      </div>

      <SimpleCRUDForm
        type="tag"
        item={tag}
        onSubmit={(formData) => updateTagAction(id, formData)}
        onDelete={() => deleteTagAction(id)}
        generateSlug={generateTagSlugAction}
      />
    </div>
  );
}
