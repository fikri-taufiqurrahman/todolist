import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Tasks from "./components/tasks";
// import DragDropContainer from "./components/DragDropContainer";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/todolist/register" element={<Register />} />
          <Route path="/todolist" element={<Login />} />
          <Route path="/todolist/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
