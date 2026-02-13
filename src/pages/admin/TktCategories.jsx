import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CategoryExplorer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Navigation state
  const [view, setView] = useState("list"); // list, create, edit, families, subfamilies
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    families: [{ name: "", subFamilies: [{ name: "" }] }],
  });

  const [editForm, setEditForm] = useState({
    name: "",
    families: [{ name: "", subFamilies: [{ name: "" }] }],
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories/list");
      setCategories(res.data.data || res.data || []);
    } catch (error) {
      console.error("Category fetch error:", error);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Create Form handlers
  const handleCreateChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateFamilyChange = (index, value) => {
    const families = [...createForm.families];
    families[index].name = value;
    setCreateForm((prev) => ({ ...prev, families }));
  };

  const handleCreateSubFamilyChange = (famIndex, subIndex, value) => {
    const families = [...createForm.families];
    families[famIndex].subFamilies[subIndex].name = value;
    setCreateForm((prev) => ({ ...prev, families }));
  };

  const addCreateFamily = () => {
    setCreateForm((prev) => ({
      ...prev,
      families: [...prev.families, { name: "", subFamilies: [{ name: "" }] }],
    }));
  };

  const addCreateSubFamily = (famIndex) => {
    const families = [...createForm.families];
    families[famIndex].subFamilies.push({ name: "" });
    setCreateForm((prev) => ({ ...prev, families }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/categories/create", createForm);

      alert("Category created!");

      setCreateForm({
        name: "",
        families: [{ name: "", subFamilies: [{ name: "" }] }],
      });

      fetchCategories();
      setView("list");

    } catch (error) {
      console.error("Create category error:", error);
      alert(error.response?.data?.message || "Creation failed");
    }
  };

  // Edit handlers (similar to create)
  const startEditing = (cat) => {
    setEditingCategoryId(cat._id);
    setEditForm({
      name: cat.name,
      families: cat.families.length
        ? cat.families.map((fam) => ({
          name: fam.name,
          subFamilies: fam.subFamilies.length
            ? fam.subFamilies.map((sub) => ({ name: sub.name }))
            : [{ name: "" }],
        }))
        : [{ name: "", subFamilies: [{ name: "" }] }],
    });
    setView("edit");
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditFamilyChange = (index, value) => {
    const families = [...editForm.families];
    families[index].name = value;
    setEditForm((prev) => ({ ...prev, families }));
  };

  const handleEditSubFamilyChange = (famIndex, subIndex, value) => {
    const families = [...editForm.families];
    families[famIndex].subFamilies[subIndex].name = value;
    setEditForm((prev) => ({ ...prev, families }));
  };

  const addEditFamily = () => {
    setEditForm((prev) => ({
      ...prev,
      families: [...prev.families, { name: "", subFamilies: [{ name: "" }] }],
    }));
  };

  const addEditSubFamily = (famIndex) => {
    const families = [...editForm.families];
    families[famIndex].subFamilies.push({ name: "" });
    setEditForm((prev) => ({ ...prev, families }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/categories/update/${editingCategoryId}`,
        editForm
      );

      alert("Category updated!");

      fetchCategories();
      setView("list");
      setEditingCategoryId(null);

    } catch (error) {
      console.error("Update category error:", error);
      alert(error.response?.data?.message || "Update failed");
    }
  };


  // Navigation helpers
  const openFamilies = (cat) => {
    setSelectedCategory(cat);
    setSelectedFamily(null);
    setView("families");
  };

  const openSubFamilies = (fam) => {
    setSelectedFamily(fam);
    setView("subfamilies");
  };

  const goBack = () => {
    if (view === "subfamilies") setView("families");
    else if (view === "families") setView("list");
    else if (view === "edit") setView("list");
  };

  // UI Views
  // 1. Categories List
  const CategoriesView = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => setView("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Category
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white shadow rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h3
                  className="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => openFamilies(cat)}
                >
                  {cat.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${cat.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <p className="mt-2 text-gray-600 text-sm">
                  {cat.families.length} families
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => startEditing(cat)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // 2. Create Category View
  const CreateCategoryView = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Create New Category
      </h2>
      <form onSubmit={submitCreate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={createForm.name}
            onChange={(e) => handleCreateChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Category name"
            required
          />
        </div>

        {createForm.families.map((fam, fIndex) => (
          <div key={fIndex} className="border p-4 rounded bg-gray-50 space-y-4">
            <label className="block text-sm font-medium mb-1">
              Family Name
            </label>
            <input
              type="text"
              value={fam.name}
              onChange={(e) => handleCreateFamilyChange(fIndex, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Family name"
              required
            />

            {fam.subFamilies.map((sub, sIndex) => (
              <div key={sIndex} className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Sub-Family Name
                </label>
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) =>
                    handleCreateSubFamilyChange(fIndex, sIndex, e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Sub-Family name"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addCreateSubFamily(fIndex)}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Sub-Family
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCreateFamily}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Family
        </button>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // 3. Edit Category View
  const EditCategoryView = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Category
      </h2>
      <form onSubmit={submitEdit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => handleEditChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {editForm.families.map((fam, fIndex) => (
          <div key={fIndex} className="border p-4 rounded bg-gray-50 space-y-4">
            <label className="block text-sm font-medium mb-1">
              Family Name
            </label>
            <input
              type="text"
              value={fam.name}
              onChange={(e) => handleEditFamilyChange(fIndex, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />

            {fam.subFamilies.map((sub, sIndex) => (
              <div key={sIndex} className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Sub-Family Name
                </label>
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) =>
                    handleEditSubFamilyChange(fIndex, sIndex, e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEditSubFamily(fIndex)}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Sub-Family
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEditFamily}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Family
        </button>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              setView("list");
              setEditingCategoryId(null);
            }}
            className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // 4. Families View
  const FamiliesView = () => (
    <div>
      <button
        onClick={goBack}
        className="mb-6 text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Categories
      </button>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Families of {selectedCategory.name}
      </h2>
      {selectedCategory.families.length === 0 ? (
        <p className="text-gray-500">No families available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {selectedCategory.families.map((fam, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-xl transition"
              onClick={() => openSubFamilies(fam)}
            >
              <h3 className="text-xl font-semibold mb-2">{fam.name}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                Active
              </span>
              <p className="mt-2 text-gray-600 text-sm">
                {fam.subFamilies.length} sub-families
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 5. Sub-Families View
  const SubFamiliesView = () => (
    <div>
      <button
        onClick={goBack}
        className="mb-6 text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Families
      </button>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Sub-Families of {selectedFamily.name}
      </h2>
      {selectedFamily.subFamilies.length === 0 ? (
        <p className="text-gray-500">No sub-families available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {selectedFamily.subFamilies.map((sub, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{sub.name}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-7xl mx-auto">
      {view === "list" && <CategoriesView />}
      {view === "create" && <CreateCategoryView />}
      {view === "edit" && <EditCategoryView />}
      {view === "families" && <FamiliesView />}
      {view === "subfamilies" && <SubFamiliesView />}
    </div>
  );
}
