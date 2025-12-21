'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string | number;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  image?: string;
  video?: string;
  color?: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    image: '',
    video: '',
    color: 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)',
  });
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const ADMIN_PASSWORD = 'admin@123';

  // Fetch projects from API
  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        image: formData.image,
        video: formData.video,
        color: formData.color,
      };

      if (editingId) {
        // Update existing project
        const response = await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        const data = await response.json();
        if (data.success) {
          setProjects(projects.map(p => p.id === editingId ? data.data : p));
        }
      } else {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        const data = await response.json();
        if (data.success) {
          setProjects([...projects, data.data]);
        }
      }
      resetForm();
      setCurrentPage('projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Gagal menyimpan project');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: '',
      image: '',
      video: '',
      color: 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)',
    });
    setEditingId(null);
  };

  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags?.join(', ') || '',
      image: project.image || '',
      video: project.video || '',
      color: project.color || 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)',
    });
    setEditingId(project.id);
    setCurrentPage('add-project');
  };

  const handleDeleteProject = async (id: string | number) => {
    if (confirm('Yakin ingin menghapus project ini?')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          setProjects(projects.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Gagal menghapus project');
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = {
    total: projects.length,
    coding: projects.filter(p => p.category === 'coding').length,
    design: projects.filter(p => p.category === 'design').length,
    video: projects.filter(p => p.category === 'video').length,
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(10,10,10,0.9) 100%)',
          padding: '2rem',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '1.5rem' }}>🔐 Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#ffffff', marginBottom: '0.5rem', display: 'block' }}>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '5px',
                  background: 'rgba(10,10,10,0.5)',
                  color: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '700',
              }}
            >
              Login
            </button>
          </form>
          {loginError && (
            <p style={{ color: '#ff9999', textAlign: 'center', marginTop: '1rem', fontWeight: '600' }}>
              {loginError}
            </p>
          )}
          <a href="/" style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
            color: '#999999',
            textDecoration: 'none',
            gap: '0.5rem',
          }}>
            ← Back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        color: 'white',
        padding: '2rem 0',
        boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}>
        <h2 style={{ padding: '0 1.5rem', marginBottom: '2rem', fontSize: '1.5rem', color: '#ffffff', fontWeight: '700' }}>
          <i className="fas fa-crown"></i> Admin
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['dashboard', 'projects', 'add-project'].map(page => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 1.5rem',
                  color: currentPage === page ? '#ffffff' : '#cccccc',
                  background: currentPage === page ? '#1a1a1a' : 'none',
                  border: currentPage === page ? '0 0 0 4px #ffffff' : 'none',
                  borderLeft: currentPage === page ? '4px solid #ffffff' : 'none',
                  paddingLeft: currentPage === page ? '1.2rem' : '1.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    (e.target as HTMLButtonElement).style.background = '#1a1a1a';
                    (e.target as HTMLButtonElement).style.paddingLeft = '2rem';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    (e.target as HTMLButtonElement).style.background = 'none';
                    (e.target as HTMLButtonElement).style.paddingLeft = '1.5rem';
                  }
                }}
              >
                {page === 'dashboard' && <><i className="fas fa-chart-line"></i> Dashboard</>}
                {page === 'projects' && <><i className="fas fa-folder"></i> Kelola Projects</>}
                {page === 'add-project' && <><i className="fas fa-plus-circle"></i> Tambah Project</>}
              </button>
            </li>
          ))}
          <li style={{ borderTop: '1px solid #333333', marginTop: '2rem', paddingTop: '2rem' }}>
            <button
              onClick={handleLogout}
              style={{
                width: 'calc(100% - 3rem)',
                margin: '0 1.5rem',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '700',
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(10,10,10,0.8) 100%)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2rem', fontWeight: '700' }}>
            {currentPage === 'dashboard' && 'Dashboard'}
            {currentPage === 'projects' && 'Kelola Projects'}
            {currentPage === 'add-project' && (editingId ? 'Edit Project' : 'Tambah Project Baru')}
          </h1>
          <span style={{ color: '#ffffff' }}>Admin {loading && '(Loading...)'}</span>
        </div>

        {/* Dashboard */}
        {currentPage === 'dashboard' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              {[
                { label: 'Total Projects', value: stats.total, icon: 'fas fa-project-diagram' },
                { label: 'Coding', value: stats.coding, icon: 'fas fa-code' },
                { label: 'Design', value: stats.design, icon: 'fas fa-palette' },
                { label: 'Video Editing', value: stats.video, icon: 'fas fa-film' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(15,15,15,0.4) 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  borderLeft: '4px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <h3 style={{ color: '#cccccc', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    <i className={stat.icon}></i> {stat.label}
                  </h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(15,15,15,0.4) 100%)',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}>
              <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Recent Projects</h3>
              {projects.length > 0 ? (
                <ul style={{ color: '#ffffff', listStyle: 'none', padding: 0 }}>
                  {projects.slice(0, 5).map(p => (
                    <li key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {p.title} - <span style={{ color: '#cccccc' }}>{p.category}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#999999' }}>Belum ada project</p>
              )}
            </div>
          </div>
        )}

        {/* Projects Management */}
        {currentPage === 'projects' && (
          <div>
            <button
              onClick={() => {
                resetForm();
                setCurrentPage('add-project');
              }}
              style={{
                background: '#333333',
                color: '#ffffff',
                padding: '12px 30px',
                border: '1px solid #555555',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '700',
                marginBottom: '1.5rem',
              }}
            >
              <i className="fas fa-plus"></i> Tambah Project Baru
            </button>

            {projects.length > 0 ? (
              <table style={{
                width: '100%',
                background: 'rgba(26,26,26,0.5)',
                borderCollapse: 'collapse',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <thead style={{ background: 'rgba(42,42,42,0.8)' }}>
                  <tr>
                    <th style={{ padding: '1.2rem', textAlign: 'left', color: '#ffffff', fontWeight: '700' }}>Project Name</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', color: '#ffffff', fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', color: '#ffffff', fontWeight: '700' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <td style={{ padding: '1.2rem', color: '#ffffff' }}>{project.title}</td>
                      <td style={{ padding: '1.2rem', color: '#ffffff' }}>
                        <span style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                        }}>
                          {project.category}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem', color: '#ffffff' }}>
                        <button
                          onClick={() => handleEditProject(project)}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          style={{
                            background: 'rgba(255,100,100,0.1)',
                            color: '#ff9999',
                            border: '1px solid rgba(255,100,100,0.2)',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(26,26,26,0.5)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
              }}>
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#888888', marginBottom: '1rem', display: 'block' }}></i>
                <p>Belum ada project</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Project */}
        {currentPage === 'add-project' && (
          <div style={{
            background: 'rgba(26,26,26,0.6)',
            padding: '2.5rem',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            <form onSubmit={handleSubmitProject}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Nama Project *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '5px',
                      background: 'rgba(10,10,10,0.5)',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Kategori *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '5px',
                      background: 'rgba(10,10,10,0.5)',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Pilih kategori</option>
                    <option value="coding">Coding</option>
                    <option value="design">Design</option>
                    <option value="video">Video Editing</option>
                    <option value="game">Game Dev</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Deskripsi *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '5px',
                    background: 'rgba(10,10,10,0.5)',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Tag (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="React, Node.js, MongoDB"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '5px',
                      background: 'rgba(10,10,10,0.5)',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Link (URL)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '5px',
                      background: 'rgba(10,10,10,0.5)',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Pilih Warna (Fallback)</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '5px',
                    background: 'rgba(10,10,10,0.5)',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)">Orange - Red</option>
                  <option value="linear-gradient(135deg, #ff6b35 0%, #ff8c00 100%)">Red - Orange</option>
                  <option value="linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)">Light Orange</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#ffffff', marginBottom: '0.7rem', display: 'block', fontWeight: '700' }}>Preview Project</label>
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '10px',
                  background: formData.image || formData.color,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {!formData.image && <i className="fas fa-image" style={{ fontSize: '4rem', color: 'white', opacity: 0.7 }}></i>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '12px 30px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setCurrentPage('projects');
                  }}
                  style={{
                    background: '#0a0a0a',
                    color: '#999999',
                    padding: '12px 30px',
                    border: '1px solid #555555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
