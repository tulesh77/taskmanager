// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // 1. Fetch Tasks
  useEffect(() => {
    axios.get('https://my-task-api-rahi.onrender.com/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // 2. Add Task Function
  const addTask = () => {
    if (!newTask) return;
    axios.post('https://my-task-api-rahi.onrender.com/api/tasks', { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // 3. Delete Task Function (NOW SEPARATE AND CORRECT)
  const deleteTask = (id) => {
    axios.delete(`https://my-task-api-rahi.onrender.com/api/tasks/${id}`)
      .then(() => {
        // Remove the task from the screen immediately
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => console.error("Error deleting task:", error));
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
          onKeyDown={(e) => e.key === 'Enter' && addTask()} 
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task._id} className="task-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div className="task-info">
                <span>{task.title}</span>
             </div>
             <button 
               onClick={() => deleteTask(task._id)}
               style={{ marginLeft: '10px', background: '#ef4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
             >
               Delete
             </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;