// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); // Track what the user types

  // 1. Fetch tasks on load
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // 2. Function to add a task
  const addTask = () => {
    if (!newTask) return; // Don't add empty tasks

    axios.post('http://127.0.0.1:5000/api/tasks', { title: newTask })
      .then(response => {
        // Add the new task to the list immediately
        setTasks([...tasks, response.data]);
        setNewTask(""); // Clear the input box
      })
      .catch(error => console.error("Error adding task:", error));
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>

      {/* Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: '10px', width: '200px', marginRight: '10px' }}
        />
        <button 
          onClick={addTask}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{ background: '#101104ff', margin: '5px 0', padding: '10px' }}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;