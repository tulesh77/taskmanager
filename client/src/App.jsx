// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  // New state to track what is being typed in the "subtask" input box
  const [subtaskInputs, setSubtaskInputs] = useState({}); 

  // CHANGE THIS TO YOUR RENDER URL
  const API_URL = 'https://my-task-api-rahi.onrender.com/api/tasks'; 

  // 1. Fetch Tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  };

  // 2. Add Main Task
  const addTask = () => {
    if (!newTask) return;
    axios.post(API_URL, { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // 3. Delete Task
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  // 4. Add Sub-task (NEW!)
  const addSubtask = (taskId) => {
    const text = subtaskInputs[taskId]; // Get text for this specific task
    if (!text) return;

    axios.post(`${API_URL}/${taskId}/subtasks`, { title: text })
      .then(() => {
        // Refresh the whole list to show the new subtask
        fetchTasks();
        // Clear just that input box
        setSubtaskInputs({ ...subtaskInputs, [taskId]: "" });
      })
      .catch(error => console.error("Error adding subtask:", error));
  };

  // Helper to handle typing in subtask boxes
  const handleSubtaskChange = (taskId, value) => {
    setSubtaskInputs({ ...subtaskInputs, [taskId]: value });
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
          <li key={task._id} className="task-card" style={{ display: 'block' }}> 
            {/* Main Task Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
               <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{task.title}</span>
               <button 
                 onClick={() => deleteTask(task._id)}
                 style={{ background: '#ffffffff', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
               >
                 Delete
               </button>
            </div>

            {/* Sub-tasks List */}
            <div style={{ marginLeft: '20px', fontSize: '0.9rem', color: '#555' }}>
              {task.subtasks && task.subtasks.map((sub, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  • {sub.title}
                </div>
              ))}
            </div>

            {/* Add Sub-task Input */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
              <input 
                type="text"
                placeholder="Add sub-task..."
                value={subtaskInputs[task._id] || ""}
                onChange={(e) => handleSubtaskChange(task._id, e.target.value)}
                style={{ padding: '5px', fontSize: '0.8rem', width: '70%' }}
              />
              <button 
                onClick={() => addSubtask(task._id)}
                style={{ fontSize: '0.8rem', padding: '5px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor:'pointer' }}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;