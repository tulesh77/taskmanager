// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  // --- STATE ---
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  
  const [newCategory, setNewCategory] = useState("Personal"); 
  
  const [subtaskInputs, setSubtaskInputs] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // Edit State
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Auth State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const API_URL = 'https://my-task-api-rahi.onrender.com/api'; 

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const getConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const getCategoryColor = (category) => {
    if (category === 'Urgent') return '#ef4444'; // Red
    if (category === 'Work') return '#3b82f6';   // Blue
    return '#10b981';                            // Green
  };

  // --- AUTH FUNCTIONS ---
  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    axios.post(`${API_URL}${endpoint}`, { username, password })
      .then(response => {
        setIsLoading(false);
        if (isRegistering) {
          toast.success("Registration successful! Please log in.");
          setIsRegistering(false); 
        } else {
          setToken(response.data.token); 
          setLoggedInUser(response.data.username); 
          toast.success(`Welcome back, ${response.data.username}!`);
        }
      })
      .catch(error => {
        setIsLoading(false);
        toast.error(error.response?.data?.message || "An error occurred");
      });
  };

  const logout = () => {
    setToken(null); setLoggedInUser(""); setTasks([]);
    toast.success("Logged out");
  };

  // --- TASK FUNCTIONS ---
  const fetchTasks = () => {
    setIsLoading(true);
    axios.get(`${API_URL}/tasks`, getConfig())
      .then(response => { setTasks(response.data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  };

  const addTask = () => {
    if (!newTask) return;
    axios.post(`${API_URL}/tasks`, { title: newTask, category: newCategory }, getConfig())
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
        toast.success("Task added!");
      })
      .catch(() => toast.error("Failed to add task"));
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/tasks/${id}`, getConfig())
      .then(() => {
        setTasks(tasks.filter(t => t._id !== id));
        toast.success("Task deleted");
      })
      .catch(() => toast.error("Failed"));
  };

  const toggleTaskCompletion = (id, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    axios.put(`${API_URL}/tasks/${id}`, { status: newStatus }, getConfig())
      .then(() => {
        setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
        if (newStatus === 'done') toast.success("Task completed!");
      });
  };

  const saveEdit = (id) => {
    axios.put(`${API_URL}/tasks/${id}`, { title: editTitle }, getConfig())
      .then(() => {
        setTasks(tasks.map(t => t._id === id ? { ...t, title: editTitle } : t));
        setEditingTaskId(null); setEditTitle("");
        toast.success("Task updated");
      });
  };

  const addSubtask = (taskId) => {
    const text = subtaskInputs[taskId];
    if (!text) return;
    axios.post(`${API_URL}/tasks/${taskId}/subtasks`, { title: text }, getConfig())
      .then(() => {
        fetchTasks();
        setSubtaskInputs({ ...subtaskInputs, [taskId]: "" });
        toast.success("Sub-task added");
      });
  };

  // --- RENDER ---
  return (
    <div className="app-container">
      <Toaster position="top-center" />

      {!token ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>🔐 {isRegistering ? "Create Account" : "Login"}</h1>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '10px' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} />
            <button type="submit" disabled={isLoading} style={{ padding: '10px', background: isLoading ? '#ccc' : '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>
              {isLoading ? "Processing..." : (isRegistering ? "Sign Up" : "Log In")}
            </button>
          </form>
          {isLoading && <div className="loader"></div>}
          <p style={{ marginTop: '20px', cursor: 'pointer', color: '#4f46e5' }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Log In" : "Need an account? Sign Up"}
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>👋 Hello, {loggedInUser}!</h1>
            <button onClick={logout} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
          </div>
          
          <div className="input-group" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Urgent">Urgent</option>
            </select>

            <input type="text" placeholder="What needs to be done?" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} style={{ flex: 1, padding: '10px' }} />
            <button onClick={addTask} style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>Add</button>
          </div>

          {isLoading ? <div className="loader"></div> : (
            <ul>
              {tasks.map(task => (
                <li key={task._id} className="task-card" style={{ display: 'block', position: 'relative' }}> 
                  
                  <span style={{ 
                    position: 'absolute', top: '-10px', right: '-5px', 
                    background: getCategoryColor(task.category || 'Personal'), 
                    color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' 
                  }}>
                    {task.category || 'Personal'}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', marginTop: '5px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTaskCompletion(task._id, task.status)} style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }} />
                        
                        {editingTaskId === task._id ? (
                          <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ padding: '5px', flex: 1 }} />
                            <button onClick={() => saveEdit(task._id)} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                            <button onClick={() => setEditingTaskId(null)} style={{ background: '#9ca3af', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        ) : (
                          <span style={{ 
                            fontWeight: 'bold', 
                            textDecoration: task.status === 'done' ? 'line-through' : 'none', 
                            color: task.status === 'done' ? '#999' : 'black',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere'
                          }}>
                            {task.title}
                          </span>
                        )}
                      </div>
                      
                      {editingTaskId !== task._id && (
                        <div style={{ display: 'flex', gap: '5px', marginLeft: '10px', flexShrink: 0 }}>
                          <button onClick={() => { setEditingTaskId(task._id); setEditTitle(task.title); }} style={{ background: '#eab308', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
                            ✏️
                          </button>
                          <button onClick={() => deleteTask(task._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                            Del
                          </button>
                        </div>
                      )}
                      
                  </div>
                  
                  <div style={{ marginLeft: '20px', fontSize: '0.9rem', color: '#555' }}>
                    {task.subtasks && task.subtasks.map((sub, index) => (
                      // 👇 FIXED: Added wordBreak and overflowWrap to sub-tasks too
                      <div key={index} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        • {sub.title}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <input type="text" placeholder="Add sub-task..." value={subtaskInputs[task._id] || ""} onChange={(e) => setSubtaskInputs({ ...subtaskInputs, [task._id]: e.target.value })} style={{ padding: '5px', width: '70%' }} />
                    <button onClick={() => addSubtask(task._id)} style={{ padding: '5px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;