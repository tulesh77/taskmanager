// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- STATE ---
  const [token, setToken] = useState(null); // The Digital Key (null = not logged in)
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [subtaskInputs, setSubtaskInputs] = useState({});
  
  // Auth State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login/Register
  const [authError, setAuthError] = useState("");

  // CHANGE THIS TO YOUR RENDER URL
  const API_URL = 'https://my-task-api-rahi.onrender.com/api'; 

  // --- EFFECT ---
  useEffect(() => {
    // Only fetch tasks if we are logged in (have a token)
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // --- AUTH FUNCTIONS ---
  const handleAuth = (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    axios.post(`${API_URL}${endpoint}`, { username, password })
      .then(response => {
        if (isRegistering) {
          alert("Registration successful! Please log in.");
          setIsRegistering(false); // Switch to login view
        } else {
          setToken(response.data.token); // SAVE THE TOKEN!
          setAuthError("");
        }
      })
      .catch(error => {
        setAuthError(error.response?.data?.message || "An error occurred");
      });
  };

  const logout = () => {
    setToken(null); // Throw away the key
    setTasks([]);
  };

  // --- TASK FUNCTIONS ---
  const fetchTasks = () => {
    axios.get(`${API_URL}/tasks`)
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  };

  const addTask = () => {
    if (!newTask) return;
    axios.post(`${API_URL}/tasks`, { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch(error => console.error(error));
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error(error));
  };

  const addSubtask = (taskId) => {
    const text = subtaskInputs[taskId];
    if (!text) return;
    axios.post(`${API_URL}/tasks/${taskId}/subtasks`, { title: text })
      .then(() => {
        fetchTasks();
        setSubtaskInputs({ ...subtaskInputs, [taskId]: "" });
      })
      .catch(error => console.error(error));
  };

  // --- RENDER ---
  
  // 1. IF NOT LOGGED IN -> SHOW LOGIN FORM
  if (!token) {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>🔐 {isRegistering ? "Create Account" : "Login"}</h1>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '10px' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        {authError && <p style={{ color: 'red' }}>{authError}</p>}

        <p style={{ marginTop: '20px', cursor: 'pointer', color: '#4f46e5' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Log In" : "Need an account? Sign Up"}
        </p>
      </div>
    );
  }

  // 2. IF LOGGED IN -> SHOW TASK MANAGER
  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🚀 Task Manager</h1>
        <button onClick={logout} style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
               <span style={{ fontWeight: 'bold' }}>{task.title}</span>
               <button onClick={() => deleteTask(task._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
            
            <div style={{ marginLeft: '20px', fontSize: '0.9rem', color: '#555' }}>
              {task.subtasks && task.subtasks.map((sub, index) => (
                <div key={index}>• {sub.title}</div>
              ))}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
              <input 
                type="text"
                placeholder="Add sub-task..."
                value={subtaskInputs[task._id] || ""}
                onChange={(e) => setSubtaskInputs({ ...subtaskInputs, [task._id]: e.target.value })}
                style={{ padding: '5px', width: '70%' }}
              />
              <button onClick={() => addSubtask(task._id)} style={{ padding: '5px', background: '#4f46e5', color: 'white', border: 'none', cursor:'pointer' }}>+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;