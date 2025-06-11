import React, { useState, useEffect, useCallback } from "react";
import { api, ValidationError } from "../utils/api";

interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface Task {
  id: number;
  title: string;
  status: "Open" | "In Progress" | "Completed";
  callId: number;
}

interface Call {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  tags?: Tag[];
  tasks?: Task[];
}

interface FormData {
  title: string;
  tagIds: number[];
}

const TASK_STATUSES = ["Open", "In Progress", "Completed"] as const;

const Calls: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newForm, setNewForm] = useState<FormData>({ title: "", tagIds: [] });
  const [editForm, setEditForm] = useState<FormData>({ title: "", tagIds: [] });
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [showNewTagSelector, setShowNewTagSelector] = useState(false);
  const [showEditTagSelector, setShowEditTagSelector] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);

  const selectedCall = calls.find((call) => call.id === selectedCallId) || null;

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCall) {
      setEditForm({
        title: selectedCall.title,
        tagIds: selectedCall.tags?.map((tag) => tag.id) || [],
      });
    }
  }, [selectedCall]);

  // API calls
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [callsData, tagsData] = await Promise.all([
        api.get<Call[]>("/calls"),
        api.get<Tag[]>("/tags"),
      ]);
      setCalls(callsData);
      setTags(tagsData);
      setErrors([]);
    } catch (error) {
      setErrors([getErrorMessage(error)]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [callsData, tagsData] = await Promise.all([
        api.get<Call[]>("/calls"),
        api.get<Tag[]>("/tags"),
      ]);
      setCalls(callsData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const fetchCallDetails = async (callId: number): Promise<Call | null> => {
    try {
      return await api.get<Call>(`/calls/${callId}`);
    } catch (error) {
      throw error;
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

  // Optimistic update helpers
  const updateCallInList = useCallback(
    (callId: number, updates: Partial<Call>) => {
      setCalls((prev) =>
        prev.map((call) =>
          call.id === callId ? { ...call, ...updates } : call
        )
      );
    },
    []
  );

  const addCallToList = useCallback((newCall: Call) => {
    setCalls((prev) => [newCall, ...prev]);
  }, []);

  const removeCallFromList = useCallback(
    (callId: number) => {
      setCalls((prev) => prev.filter((call) => call.id !== callId));
      if (selectedCallId === callId) {
        setSelectedCallId(null);
      }
    },
    [selectedCallId]
  );

  const updateTaskInCall = useCallback(
    (callId: number, taskId: number, updates: Partial<Task>) => {
      updateCallInList(callId, {
        tasks: calls
          .find((c) => c.id === callId)
          ?.tasks?.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
      });
    },
    [calls, updateCallInList]
  );

  const addTaskToCall = useCallback(
    (callId: number, newTask: Task) => {
      const call = calls.find((c) => c.id === callId);
      updateCallInList(callId, {
        tasks: [...(call?.tasks || []), newTask],
      });
    },
    [calls, updateCallInList]
  );

  const removeTaskFromCall = useCallback(
    (callId: number, taskId: number) => {
      const call = calls.find((c) => c.id === callId);
      updateCallInList(callId, {
        tasks: call?.tasks?.filter((task) => task.id !== taskId),
      });
    },
    [calls, updateCallInList]
  );

  // Form handlers
  const handleNewFormChange = (field: keyof FormData, value: any) => {
    setNewForm((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleEditFormChange = (field: keyof FormData, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleTagToggle = (tagId: number, isEdit = false) => {
    const form = isEdit ? editForm : newForm;
    const setForm = isEdit ? handleEditFormChange : handleNewFormChange;

    const newTagIds = form.tagIds.includes(tagId)
      ? form.tagIds.filter((id) => id !== tagId)
      : [...form.tagIds, tagId];

    setForm("tagIds", newTagIds);
  };

  // CRUD operations
  const handleAddCall = async () => {
    if (!newForm.title.trim()) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const newCall = await api.post<Call>("/calls", {
        title: newForm.title.trim(),
        userId: 1,
        tagIds: newForm.tagIds,
      });

      addCallToList(newCall);
      setNewForm({ title: "", tagIds: [] });
      setShowNewTagSelector(false);
    } catch (error) {
      handleError(error);
      await refreshData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCall = async () => {
    if (!editForm.title.trim() || !selectedCall) return;

    setIsSubmitting(true);
    setErrors([]);

    const optimisticUpdate = {
      title: editForm.title.trim(),
      tags: tags.filter((tag) => editForm.tagIds.includes(tag.id)),
    };

    updateCallInList(selectedCall.id, optimisticUpdate);

    try {
      await api.put(`/calls/${selectedCall.id}`, {
        title: editForm.title.trim(),
        tagIds: editForm.tagIds,
      });
      setShowEditTagSelector(false);
    } catch (error) {
      handleError(error);
      await refreshData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCall = async (callId: number) => {
    if (!confirm("Are you sure you want to delete this call?")) return;

    removeCallFromList(callId);

    try {
      await api.delete(`/calls/${callId}`);
    } catch (error) {
      handleError(error);
      await refreshData();
    }
  };

  const handleSelectCall = async (call: Call) => {
    setErrors([]);

    if (!call.tasks) {
      try {
        const detailedCall = await fetchCallDetails(call.id);
        if (detailedCall) {
          updateCallInList(call.id, detailedCall);
        }
      } catch (error) {
        handleError(error);
      }
    }

    setSelectedCallId(call.id);
  };

  // Task operations
  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !selectedCall) return;

    const tempId = Date.now();
    const tempTask: Task = {
      id: tempId,
      title: newTaskTitle.trim(),
      status: "Open",
      callId: selectedCall.id,
    };

    addTaskToCall(selectedCall.id, tempTask);
    setNewTaskTitle("");
    setErrors([]);

    try {
      const newTask = await api.post<Task>("/tasks", {
        title: newTaskTitle.trim(),
        callId: selectedCall.id,
      });

      removeTaskFromCall(selectedCall.id, tempId);
      addTaskToCall(selectedCall.id, newTask);
    } catch (error) {
      removeTaskFromCall(selectedCall.id, tempId);
      handleError(error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    if (!selectedCall) return;

    updateTaskInCall(selectedCall.id, taskId, {
      status: status as Task["status"],
    });

    try {
      await api.put(`/tasks/${taskId}`, { status });
    } catch (error) {
      handleError(error);
      if (selectedCall) {
        const updatedCall = await fetchCallDetails(selectedCall.id);
        if (updatedCall) {
          updateCallInList(selectedCall.id, updatedCall);
        }
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?") || !selectedCall)
      return;

    removeTaskFromCall(selectedCall.id, taskId);

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      handleError(error);
      if (selectedCall) {
        const updatedCall = await fetchCallDetails(selectedCall.id);
        if (updatedCall) {
          updateCallInList(selectedCall.id, updatedCall);
        }
      }
    }
  };

  // UI helpers
  const getTextColor = (bgColor: string): string => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  const getSelectedTags = (tagIds: number[]) =>
    tags.filter((tag) => tagIds.includes(tag.id));

  const getAvailableTags = (tagIds: number[]) =>
    tags.filter((tag) => !tagIds.includes(tag.id));

  // Components
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

  const TagSelector = ({
    selectedTagIds,
    isOpen,
    onToggle,
    onTagSelect,
  }: {
    selectedTagIds: number[];
    isOpen: boolean;
    onToggle: () => void;
    onTagSelect: (tagId: number) => void;
  }) => (
    <>
      {getSelectedTags(selectedTagIds).map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.id)}
          className="px-3 py-1 rounded-full text-sm font-medium transition-colors group hover:opacity-80"
          style={{
            backgroundColor: tag.color,
            color: getTextColor(tag.color),
          }}
        >
          {tag.name}
          <span className="ml-1 opacity-60 group-hover:opacity-100">×</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="text-lg">+</span>
        </button>

        {isOpen && (
          <div className="absolute top-10 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48">
            <div className="max-h-40 overflow-y-auto">
              {getAvailableTags(selectedTagIds).length > 0 ? (
                getAvailableTags(selectedTagIds).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      onTagSelect(tag.id);
                      onToggle();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  All tags selected
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Calls</h1>

            <div className="space-y-4">
              <input
                type="text"
                value={newForm.title}
                onChange={(e) => handleNewFormChange("title", e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isSubmitting && handleAddCall()
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter call title..."
              />

              <div className="flex flex-wrap gap-2 items-center">
                <TagSelector
                  selectedTagIds={newForm.tagIds}
                  isOpen={showNewTagSelector}
                  onToggle={() => setShowNewTagSelector(!showNewTagSelector)}
                  onTagSelect={(tagId) => handleTagToggle(tagId)}
                />
              </div>

              <button
                onClick={handleAddCall}
                disabled={isSubmitting || !newForm.title.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Call"}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex-shrink-0">
              All Calls ({calls.length})
            </h2>

            {calls.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p>No calls found</p>
                  <p className="text-sm mt-1">Create your first call above</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {calls.map((call) => (
                    <div
                      key={call.id}
                      onClick={() => handleSelectCall(call)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCallId === call.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">
                          {call.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCall(call.id);
                          }}
                          className="text-gray-400 hover:text-red-500 text-lg transition-colors"
                          title="Delete call"
                        >
                          ×
                        </button>
                      </div>

                      {call.tags && call.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {call.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 rounded-full text-xs"
                              style={{
                                backgroundColor: tag.color,
                                color: getTextColor(tag.color),
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white flex flex-col">
          {selectedCall ? (
            <>
              <div className="flex-shrink-0 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Edit Call
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      handleEditFormChange("title", e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && !isSubmitting && handleUpdateCall()
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter call title..."
                  />

                  <div className="flex flex-wrap gap-2 items-center">
                    <TagSelector
                      selectedTagIds={editForm.tagIds}
                      isOpen={showEditTagSelector}
                      onToggle={() =>
                        setShowEditTagSelector(!showEditTagSelector)
                      }
                      onTagSelect={(tagId) => handleTagToggle(tagId, true)}
                    />
                  </div>

                  <button
                    onClick={handleUpdateCall}
                    disabled={isSubmitting || !editForm.title.trim()}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Updating..." : "Update Call"}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
                  Tasks
                </h3>

                <div className="flex gap-2 mb-4 flex-shrink-0">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {selectedCall.tasks && selectedCall.tasks.length > 0 ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-3">
                      {selectedCall.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="flex-1 text-gray-900">
                            {task.title}
                          </span>

                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleUpdateTaskStatus(task.id, e.target.value)
                            }
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {TASK_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500 text-lg transition-colors"
                            title="Delete task"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>No tasks found</p>
                  </div>
                )}
              </div>
            </>
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <p className="text-lg mb-2">Select a call to edit</p>
                <p className="text-sm">Click on any call from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calls;
