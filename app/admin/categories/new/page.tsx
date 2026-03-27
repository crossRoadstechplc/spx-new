/* Phase 5: New category page */
import { SimpleCRUDForm } from "@/components/admin/simple-crud-form";

export const metadata = {
  title: "New Category | SPX Admin",
  description: "Create a new category",
};

export default function NewCategoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-muted-foreground mt-1">Create a new content category</p>
      </div>

      <SimpleCRUDForm
        type="category"
      />
    </div>
  );
}
