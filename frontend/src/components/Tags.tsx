import React, { useState, useEffect, useCallback } from "react";
import { api, ValidationError } from "../utils/api";

interface Tag {
  id: number;
  name: string;
  description?: string;
  color: string;
}

interface FormData {
  name: string;
  description: string;
  color: string;
}

const DEFAULT_TAG_COLOR = "#3B82F6";
const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

interface TagFormProps {
  form: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  isEdit?: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  getTextColor: (bgColor: string) => string;
}

const TagForm: React.FC<TagFormProps> = ({
  form,
  onChange,
  isEdit = false,
  onSubmit,
  isSubmitting,
  getTextColor,
}) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Name *
      </label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter tag name..."
        maxLength={MAX_NAME_LENGTH}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !isSubmitting) {
            onSubmit();
          }
        }}
      />
      <div className="mt-1 text-xs text-gray-500">
        {form.name.length}/{MAX_NAME_LENGTH} characters
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Optional description..."
        maxLength={MAX_DESCRIPTION_LENGTH}
        rows={3}
      />
      <div className="mt-1 text-xs text-gray-500">
        {form.description.length}/{MAX_DESCRIPTION_LENGTH} characters
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Color
      </label>
      <div className="flex gap-3">
        <input
          type="color"
          value={form.color}
          onChange={(e) => onChange("color", e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={form.color}
          onChange={(e) => onChange("color", e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          pattern="^#[0-9A-Fa-f]{6}$"
          placeholder="#3B82F6"
        />
      </div>
    </div>

    <button
      onClick={onSubmit}
      disabled={!form.name.trim() || isSubmitting}
      className={`w-full py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isEdit
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isSubmitting
        ? isEdit
          ? "Updating..."
          : "Adding..."
        : isEdit
        ? "Update Tag"
        : "Add Tag"}
    </button>

    {/* Preview */}
    {(isEdit || form.name.trim()) && (
      <div className={isEdit ? "pt-6" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview
        </label>
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: form.color,
            color: getTextColor(form.color),
          }}
        >
          {form.name.trim() || "Tag Name"}
        </div>
        {isEdit && form.description.trim() && (
          <p className="mt-2 text-sm text-gray-600">
            {form.description.trim()}
          </p>
        )}
      </div>
    )}
  </>
);

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newForm, setNewForm] = useState<FormData>({
    name: "",
    description: "",
    color: DEFAULT_TAG_COLOR,
  });
  const [editForm, setEditForm] = useState<FormData>({
    name: "",
    description: "",
    color: DEFAULT_TAG_COLOR,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const selectedTag = tags.find((tag) => tag.id === selectedTagId) || null;

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setEditForm({
        name: selectedTag.name,
        description: selectedTag.description || "",
        color: selectedTag.color,
      });
    }
  }, [selectedTag]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await api.get<Tag[]>("/tags");
      setTags(data);
      setErrors([]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTags = async () => {
    try {
      const data = await api.get<Tag[]>("/tags");
      setTags(data);
    } catch (error) {
      console.error("Error refreshing tags:", error);
    }
  };

  // Error handling
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof ValidationError) {
      return error.errors.join(", ");
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  const handleError = (error: unknown) => {
    if (error instanceof ValidationError) {
      setErrors(error.errors);
    } else {
      setErrors([getErrorMessage(error)]);
    }
  };

  // Validation
  const validateTagName = useCallback(
    (name: string, excludeId?: number): string | null => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return "Tag name is required";
      }

      if (trimmedName.length > MAX_NAME_LENGTH) {
        return `Tag name must be ${MAX_NAME_LENGTH} characters or less`;
      }

      const nameExists = tags.some(
        (tag) =>
          tag.name.toLowerCase() === trimmedName.toLowerCase() &&
          tag.id !== excludeId
      );

      if (nameExists) {
        return "Tag name already exists";
      }

      return null;
    },
    [tags]
  );

  const validateColor = (color: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  // Optimistic update helpers
  const addTagToList = useCallback((newTag: Tag) => {
    setTags((prev) => [newTag, ...prev]);
  }, []);

  const updateTagInList = useCallback(
    (tagId: number, updates: Partial<Tag>) => {
      setTags((prev) =>
        prev.map((tag) => (tag.id === tagId ? { ...tag, ...updates } : tag))
      );
    },
    []
  );

  const removeTagFromList = useCallback(
    (tagId: number) => {
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      if (selectedTagId === tagId) {
        setSelectedTagId(null);
      }
    },
    [selectedTagId]
  );

  const handleNewFormChange = (field: keyof FormData, value: string) => {
    setNewForm((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleEditFormChange = (field: keyof FormData, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleAddTag = async () => {
    const validationError = validateTagName(newForm.name);
    if (validationError) {
      setErrors([validationError]);
      return;
    }

    if (!validateColor(newForm.color)) {
      setErrors(["Invalid color format"]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    const optimisticTag: Tag = {
      id: Date.now(),
      name: newForm.name.trim(),
      description: newForm.description.trim() || undefined,
      color: newForm.color,
    };

    addTagToList(optimisticTag);

    const formData = { ...newForm };
    setNewForm({ name: "", description: "", color: DEFAULT_TAG_COLOR });

    try {
      const createdTag = await api.post<Tag>("/tags", {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });

      removeTagFromList(optimisticTag.id);
      addTagToList(createdTag);
    } catch (error) {
      removeTagFromList(optimisticTag.id);
      setNewForm(formData);
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!selectedTag) return;

    const validationError = validateTagName(editForm.name, selectedTag.id);
    if (validationError) {
      setErrors([validationError]);
      return;
    }

    if (!validateColor(editForm.color)) {
      setErrors(["Invalid color format"]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    const originalTag = { ...selectedTag };
    const updatedData = {
      name: editForm.name.trim(),
      description: editForm.description.trim() || undefined,
      color: editForm.color,
    };

    updateTagInList(selectedTag.id, updatedData);

    try {
      const updatedTag = await api.put<Tag>(
        `/tags/${selectedTag.id}`,
        updatedData
      );
      updateTagInList(selectedTag.id, updatedTag);
    } catch (error) {
      updateTagInList(selectedTag.id, originalTag);
      handleError(error);
      await refreshTags();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tagId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this tag?")) return;

    const tagToDelete = tags.find((tag) => tag.id === tagId);
    if (!tagToDelete) return;

    removeTagFromList(tagId);

    try {
      await api.delete(`/tags/${tagId}`);
    } catch (error) {
      setTags((prev) => [...prev, tagToDelete].sort((a, b) => b.id - a.id));
      handleError(error);
    }
  };

  const handleSelectTag = (tag: Tag) => {
    setSelectedTagId(tag.id);
    setErrors([]);
  };

  const getTextColor = (bgColor: string): string => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  const ErrorDisplay = ({
    errors,
    onClose,
  }: {
    errors: string[];
    onClose: () => void;
  }) => {
    if (errors.length === 0) return null;

    return (
      <div className="p-4 bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div className="flex-1">
            {errors.length === 1 ? (
              <p className="text-sm text-red-600">{errors[0]}</p>
            ) : (
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 ml-4"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">Loading tags...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ErrorDisplay errors={errors} onClose={() => setErrors([])} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tags</h1>

            <div className="space-y-4">
              <TagForm
                form={newForm}
                onChange={handleNewFormChange}
                onSubmit={handleAddTag}
                isSubmitting={isSubmitting}
                getTextColor={getTextColor}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex-shrink-0">
              All Tags ({tags.length})
            </h2>

            {tags.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p>No tags found</p>
                  <p className="text-sm mt-1">Create your first tag above</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => handleSelectTag(tag)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTagId === tag.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: tag.color }}
                          />
                          <h3 className="font-medium text-gray-900">
                            {tag.name}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => handleDeleteTag(tag.id, e)}
                          className="text-gray-400 hover:text-red-500 text-lg transition-colors"
                          title="Delete tag"
                        >
                          ×
                        </button>
                      </div>

                      {tag.description && (
                        <p className="text-sm text-gray-600 ml-7 line-clamp-2">
                          {tag.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white">
          {selectedTag ? (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Tag
              </h2>

              <div className="space-y-4">
                <TagForm
                  form={editForm}
                  onChange={handleEditFormChange}
                  isEdit
                  onSubmit={handleUpdateTag}
                  isSubmitting={isSubmitting}
                  getTextColor={getTextColor}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <p className="text-lg mb-2">Select a tag to edit</p>
                <p className="text-sm">Click on any tag from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;
