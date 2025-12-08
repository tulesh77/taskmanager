// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get('https://my-task-api-rahi.onrender.com')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = () => {
    if (!newTask) return;
    axios.post('https://my-task-api-rahi.onrender.com', { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch(error => console.error("Error adding task:", error));
  };

  return (
    <div className="app-container">
      <h1>🚀 Task Manager</h1>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()} // Allow 'Enter' key
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task._id} className="task-card">
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;