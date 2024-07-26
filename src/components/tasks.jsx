import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import {
  saveTask,
  getTasks,
  updateTask,
  deleteTask,
  signOut,
  auth,
  updateTaskDnD,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [status, setStatus] = useState("mandatory-urgent");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/todolist");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTasks(user);
      } else {
        setUser(null);
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async (user) => {
    try {
      const tasks = await getTasks(user);
      setTasks(tasks);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveTask = async () => {
    if (!task.trim() || !user) return;
    try {
      if (editTask) {
        await updateTask(editTask.id, { name: task, status, deadline });
        setEditTask(null);
      } else {
        await saveTask({ name: task, status, completed: false }, deadline);
      }
      setTask("");
      setStatus("mandatory-urgent");
      setDeadline(""); // Reset the deadline
      fetchTasks(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTask = (task) => {
    setTask(task.name);
    setStatus(task.status);
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await updateTask(taskId, { completed: !completed });
      fetchTasks(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const draggedTask = tasks.find((task) => task.id === draggableId);
    if (!draggedTask) return;

    // Optimistic UI update
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );
    setTasks(updatedTasks);

    try {
      await updateTaskDnD(draggedTask.id, { status: destination.droppableId });
      // Optionally fetch tasks again to ensure consistency
      fetchTasks(user);
    } catch (error) {
      setError(error.message);
      // Revert UI update if there was an error
      setTasks(tasks);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-1 bg-gray-200">
      <div className="rounded-lg p-6 w-full max-w-full">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {user?.displayName || user?.email}
          </h1>
        </div>

        <div className="max-w-8xl mx-auto p-2">
          {user ? (
            <>
              <div className="text-center mb-4 ">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white py-2 px-4 mx-2 rounded shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Task
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white p-2  mx-2 rounded-md hover:bg-red-600"
                >
                  Sign out
                </button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                  <TaskList
                    title="Mandatory and Urgent"
                    status="mandatory-urgent"
                    tasks={tasks}
                    color="#FF6961" // Pastel Merah
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleComplete={handleToggleComplete}
                  />
                  <TaskList
                    title="Mandatory, But Not Urgent"
                    status="mandatory-not-urgent"
                    tasks={tasks}
                    color="#FDFD96" // Pastel Kuning
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleComplete={handleToggleComplete}
                  />
                  <TaskList
                    title="Unmandatory and Urgent"
                    status="unmandatory-urgent"
                    tasks={tasks}
                    color="#FFB347" // Pastel Oranye
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleComplete={handleToggleComplete}
                  />
                  <TaskList
                    title="Unmandatory and Not Urgent"
                    status="unmandatory-not-urgent"
                    tasks={tasks}
                    color="#77DD77" // Pastel Hijau
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleComplete={handleToggleComplete}
                  />
                </div>
              </DragDropContext>

              <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={task}
                setTask={setTask}
                status={status}
                setStatus={setStatus}
                deadline={deadline}
                setDeadline={setDeadline}
                handleSaveTask={handleSaveTask}
                editTask={editTask}
              />
            </>
          ) : (
            <div className="text-center text-red-500 mt-4">
              Please log in to see your tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
