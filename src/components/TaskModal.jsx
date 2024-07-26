import React, { useState } from "react";

const TaskModal = ({
  isOpen,
  onClose,
  task,
  setTask,
  status,
  setStatus,
  deadline,
  setDeadline,
  handleSaveTask,
  editTask,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editTask ? "Edit Task" : "Add Task"}
        </h2>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="w-full px-3 py-2 mb-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="Enter deadline"
          className="w-full px-3 py-2 mb-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mandatory-urgent">Mandatory & Urgent</option>
          <option value="mandatory-not-urgent">Mandatory & Not Urgent</option>
          <option value="unmandatory-urgent">Unmandatory & Urgent</option>
          <option value="unmandatory-not-urgent">
            Unmandatory & Not Urgent
          </option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSaveTask();
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
