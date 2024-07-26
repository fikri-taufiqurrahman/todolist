import React from "react";
import { FiEdit, FiTrash, FiCheck, FiRefreshCw } from "react-icons/fi";

const MandatoryNotUrgent = ({
  tasks,
  handleEditTask,
  handleDeleteTask,
  handleToggleComplete,
}) => {
  const filteredTasks = tasks.filter(
    (task) => task.status === "mandatory-not-urgent"
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full">
      <h2 className="text-xl font-bold mb-4">Mandatory, But Not Urgent</h2>
      <ul>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-2 border-b last:border-none flex justify-between items-center"
          >
            <div className={task.completed ? "line-through text-gray-500" : ""}>
              <span>{task.name}</span>
              <br />
              <small className="text-gray-500">
                Created at: {task.createdAt?.toDate().toLocaleString()}
              </small>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleComplete(task.id, task.completed)}
                className={`py-1 px-2 rounded shadow-sm focus:outline-none focus:ring-2 ${
                  task.completed
                    ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                    : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                }`}
              >
                {task.completed ? <FiRefreshCw /> : <FiCheck />}
              </button>
              <button
                onClick={() => handleEditTask(task)}
                className="bg-yellow-500 text-white py-1 px-2 rounded shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white py-1 px-2 rounded shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FiTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MandatoryNotUrgent;
