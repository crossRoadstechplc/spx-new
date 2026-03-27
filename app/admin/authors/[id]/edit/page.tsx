/* Phase 5: Edit author page */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";

export const metadata = {
  title: "Edit Author | SPX Admin",
  description: "Edit author",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAuthorPage({ params }: PageProps) {
  const { id } = await params;
  const author = await db.author.findUnique({
    where: { id },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Author</h1>
        <p className="text-muted-foreground mt-1">Update author details</p>
      </div>

      <SimpleCRUDForm
        type="author"
        itemId={id}
        item={author}
      />
    </div>
  );
}
