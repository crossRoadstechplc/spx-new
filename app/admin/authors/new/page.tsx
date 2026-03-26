/* Phase 5: New author page */
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";
import { createAuthorAction, generateAuthorSlugAction } from "../actions";

export const metadata = {
  title: "New Author | SPX Admin",
  description: "Create a new author",
};

export default function NewAuthorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Author</h1>
        <p className="text-muted-foreground mt-1">Create a new author profile</p>
      </div>

      <SimpleCRUDForm
        type="author"
        onSubmit={createAuthorAction}
        generateSlug={generateAuthorSlugAction}
      />
    </div>
  );
}
