import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiCheck, FiRefreshCw } from "react-icons/fi";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const getRemainingTime = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline.seconds * 1000);
  const difference = deadlineDate - now;

  if (difference <= 0) {
    return "Deadline passed";
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${
    minutes !== 1 ? "s" : ""
  } left`;
};

const TaskList = ({
  title = "",
  status = "",
  tasks = [],
  color = "#FFFFFF", // Default to white if color is not provided
  handleEditTask = () => {},
  handleDeleteTask = () => {},
  handleToggleComplete = () => {},
}) => {
  const filteredTasks = tasks.filter((task) => task.status === status);
  const [remainingTimes, setRemainingTimes] = useState({});

  useEffect(() => {
    const updateRemainingTimes = () => {
      const newRemainingTimes = {};
      tasks.forEach((task) => {
        if (task.deadline) {
          newRemainingTimes[task.id] = getRemainingTime(task.deadline);
        }
      });
      setRemainingTimes(newRemainingTimes);
    };

    updateRemainingTimes();
    const interval = setInterval(updateRemainingTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          className={`bg-white shadow-lg rounded-lg  mb-4 w-full ${
            snapshot.isDraggingOver ? "bg-blue-100" : ""
          }`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div
            className="rounded-t-lg p-2 mb-2"
            style={{ backgroundColor: color }}
          >
            <h2 className="text-lg font-bold text-center">{title}</h2>
          </div>
          <ul>
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-1 border-b last:border-none flex justify-between items-center ${
                      snapshot.isDragging ? "bg-gray-100" : ""
                    }`}
                  >
                    <div
                      className={
                        task.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      <span>{task.name}</span>
                      <br />
                      <small className="text-gray-500">
                        {task.deadline
                          ? remainingTimes[task.id] || "Calculating..."
                          : "No deadline"}
                      </small>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleToggleComplete(task.id, task.completed)
                        }
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
