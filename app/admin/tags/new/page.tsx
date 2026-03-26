/* Phase 5: New tag page */
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";
import { createTagAction, generateTagSlugAction } from "../actions";

export const metadata = {
  title: "New Tag | SPX Admin",
  description: "Create a new tag",
};

export default function NewTagPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Tag</h1>
        <p className="text-muted-foreground mt-1">Create a new content tag</p>
      </div>

      <SimpleCRUDForm
        type="tag"
        onSubmit={createTagAction}
        generateSlug={generateTagSlugAction}
      />
    </div>
  );
}
