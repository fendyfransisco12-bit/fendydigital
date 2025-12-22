'use client';

import { useState, useEffect } from 'react';

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

interface SkillCategory {
  title: string;
  tools: Array<{ name: string; logo: string }>;
}

const skillCategories: Record<string, SkillCategory> = {  
  design: {
    title: 'Design',
    tools: [
      { name: 'Canva', logo: 'https://i.ibb.co/7d80L8Lt/Untitled-1-Recovered.png'},
      { name: 'Illustrator', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg' },
      { name: 'Photoshop', logo: 'https://cdn.worldvectorlogo.com/logos/adobe-photoshop-2.svg' }
    ]
  },
  video: {
    title: 'Video Editing',
    tools: [
      { name: 'After Effect', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg' },
      { name: 'Premiere Pro', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg' },
      { name: 'Lightroom', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg' }
    ]
  },
  coding: {
    title: 'Coding',
    tools: [
      { name: 'HTML5', logo: 'https://cdn.worldvectorlogo.com/logos/html-1.svg' },
      { name: 'CSS3', logo: 'https://cdn.worldvectorlogo.com/logos/css-3.svg' },
      { name: 'JavaScript', logo: 'https://cdn.worldvectorlogo.com/logos/javascript-1.svg' },
      { name: 'Node.js', logo: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' }
    ]
  },
  database: {
    title: 'Database',
    tools: [
      { name: 'Neon', logo: './neon-logo.svg' },
      { name: 'Firebase', logo: 'https://cdn.worldvectorlogo.com/logos/firebase-1.svg' }
    ]
  },
  game: {
    title: 'Game Development',
    tools: [
      { name: 'Unity', logo: './unity-logo.svg' },
      { name: 'Blender', logo: 'https://cdn.worldvectorlogo.com/logos/blender-2.svg' },
      { name: 'Godot', logo: './godot-logo.svg' }
    ]
  }
};

const toolsData: Record<string, { description: string }> = {
  'Photoshop': { description: 'Enhanced images and created professional digital graphics to support visual storytelling.' },
  'Illustrator': { description: 'Designed vector illustrations and logos with precision for professional branding and communication.' },
  'Canva': { description: 'Canva adalah platform desain online yang memudahkan siapa saja untuk membuat desain profesional dengan template siap pakai.' },
  'After Effect': { description: 'Created motion graphics and visual effects to produce engaging and cinematic content.' },
  'Premiere Pro': { description: 'Edited high-quality videos for films, broadcasts, and digital media projects.' },
  'Lightroom': { description: 'Improved photo quality and applied advanced color correction for professional-grade imagery.' },
  'HTML5': { description: 'Leverages semantic markup to create accessible and responsive web structures that enhance user experience.' },
  'CSS3': { description: 'Implements modern styling and animation techniques to design intuitive and visually engaging web interfaces.' },
  'JavaScript': { description: 'Develops dynamic web functionality, enabling interactive and responsive user experiences.' },
  'Node.js': { description: 'Builds scalable backend applications and APIs, optimizing data flow and server-side logic.' },
  'Neon': { description: 'Neon enables me to build and test modern cloud-based applications effectively, thanks to its serverless architecture and high scalability. This supports the practical development of my projects.' },
  'Firebase': { description: 'Integrates real-time database and cloud services to enhance application interactivity and performance.' },
  'Unity': { description: 'Developing 3D games in Unity, implementing gameplay mechanics, physics, and scripting to create engaging and functional experiences.' },
  'Blender': { description: 'Creating 3D models, animations, and visual assets for games, simulations, and digital projects, with a focus on both creativity and technical precision.' },
  'Godot': { description: 'Building 2D pixel games using Godot, implementing gameplay mechanics, logic systems, and optimized performance to deliver fun and engaging experiences.' }
};

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
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

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="bg-black text-white">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <a href="#" className="logo">
              <span className="logo-icon">F</span>
              <span className="logo-text">nnex</span>
            </a>
            <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Project</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <button 
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Hi, I'm Fendy</h1>
            <p>A motivated Web, Game, and Digital Designer</p>
            <p className="subtitle">Passionate about crafting interactive games, responsive websites, and visually engaging digital solutions</p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">Explore My Work</a>
              <a href="#contact" className="btn btn-secondary">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Hello! I'm Fendy, a Web Developer and Designer passionate about building responsive and user-friendly digital experiences.</p>
              <p>Over the past year and a half, I've been honing my skills through personal projects, exploring modern web technologies, and creating digital solutions that are both visually appealing and functional.</p>
              <p>I'm ready to apply my knowledge and creativity to develop innovative applications that make a meaningful impact.</p>
              <div className="social-links">
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">MY SKILLS</h2>
          <div className="skills-buttons">
            <button 
              className="skill-btn"
              onClick={() => {
                setSelectedCategory('design');
                setCarouselOpen(true);
              }}
            >
              <i className="fas fa-palette"></i>
              <span>Design</span>
            </button>
            <button 
              className="skill-btn"
              onClick={() => {
                setSelectedCategory('video');
                setCarouselOpen(true);
              }}
            >
              <i className="fas fa-film"></i>
              <span>Video Editing</span>
            </button>
            <button 
              className="skill-btn"
              onClick={() => {
                setSelectedCategory('coding');
                setCarouselOpen(true);
              }}
            >
              <i className="fas fa-code"></i>
              <span>Coding</span>
            </button>
            <button 
              className="skill-btn"
              onClick={() => {
                setSelectedCategory('database');
                setCarouselOpen(true);
              }}
            >
              <i className="fas fa-database"></i>
              <span>Database</span>
            </button>
            <button 
              className="skill-btn"
              onClick={() => {
                setSelectedCategory('game');
                setCarouselOpen(true);
              }}
            >
              <i className="fas fa-gamepad"></i>
              <span>Game Dev</span>
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">MY PROJECT</h2>
          
          <div className="category-filter">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              ALL
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'coding' ? 'active' : ''}`}
              onClick={() => setActiveFilter('coding')}
            >
              CODING
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'design' ? 'active' : ''}`}
              onClick={() => setActiveFilter('design')}
            >
              DESIGN
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'video' ? 'active' : ''}`}
              onClick={() => setActiveFilter('video')}
            >
              VIDEO EDITING
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'game' ? 'active' : ''}`}
              onClick={() => setActiveFilter('game')}
            >
              GAME DEVELOPMENT
            </button>
          </div>

          <div className="projects-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#999' }}>
                <p>Loading projects...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div key={project.id} className="project-card" style={{ background: project.color || 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)' }}>
                  <div className="project-image" style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {!project.image && <i className="fas fa-image"></i>}
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        {project.tags.map((tag, idx) => (
                          <span key={idx} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className={`category-badge ${project.category}`}>
                      {project.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#999' }}>
                <p>No projects yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Let's Collaborate</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:fendyfransisco12@gmail.com">fendyfransisco12@gmail.com</a></p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Phone Number</h4>
                  <p><a href="tel:+62895192...">+62 895 1927 4202</a></p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Location</h4>
                  <p style={{ color: '#ffffff' }}>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Fendy | All rights reserved.</p>
          <div className="footer-social">
            <a href="/admin" className="social-link" title="Admin Panel"><i className="fas fa-cog"></i></a>
          </div>
        </div>
      </footer>

      {/* Carousel Modal */}
      {carouselOpen && selectedCategory && (
        <div 
          className="carousel-modal"
          onClick={() => setCarouselOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div 
            className="carousel-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setCarouselOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            
            <h2 style={{ color: '#ffffff', marginBottom: '2rem', display: 'none' }}>
              {skillCategories[selectedCategory]?.title}
            </h2>

            <style>{`
              @keyframes spin-wheel {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes counter-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
              }
            `}</style>
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                margin: '0 auto 2rem',
                animation: 'spin-wheel 20s linear infinite',
              }}
            >
              {skillCategories[selectedCategory]?.tools.map((tool, index) => {
                const toolCount = skillCategories[selectedCategory]?.tools.length || 1;
                const angleStep = 360 / toolCount;
                const angle = angleStep * index;
                const radian = (angle * Math.PI) / 180;
                const radius = 140;
                
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTool(tool.name);
                      setToolModalOpen(true);
                      setCarouselOpen(false);
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      width: '80px',
                      height: '80px',
                      background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), transparent 70%)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      transition: 'box-shadow 0.3s ease, background 0.3s ease',
                      boxShadow: `
                        inset 0 0 15px rgba(255,255,255,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        0 0 8px rgba(255,255,255,0.2),
                        0 0 15px rgba(255,255,255,0.15),
                        0 0 25px rgba(255,255,255,0.1),
                        0 0 40px rgba(255,200,100,0.05)
                      `,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'radial-gradient(circle at 35% 35%, rgba(255,165,0,0.25), transparent 70%)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `
                        inset 0 0 20px rgba(255,165,0,0.3),
                        inset 0 1px 0 rgba(255,200,100,0.4),
                        0 0 12px rgba(255,165,0,0.4),
                        0 0 25px rgba(255,165,0,0.35),
                        0 0 40px rgba(255,165,0,0.25),
                        0 0 60px rgba(255,165,0,0.15)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), transparent 70%)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `
                        inset 0 0 15px rgba(255,255,255,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        0 0 8px rgba(255,255,255,0.2),
                        0 0 15px rgba(255,255,255,0.15),
                        0 0 25px rgba(255,255,255,0.1),
                        0 0 40px rgba(255,200,100,0.05)
                      `;
                    }}
                  >
                    <img 
                      src={tool.logo} 
                      alt={tool.name}
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                        animation: 'counter-spin 20s linear infinite',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <p style={{ color: '#cccccc', fontSize: '0.9rem', display: 'none' }}>Click on a tool to learn more</p>
          </div>
        </div>
      )}

      {/* Tool Detail Modal */}
      {toolModalOpen && selectedTool && (
        <div 
          className="tool-modal"
          onClick={() => setToolModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
        >
          <div 
            className="tool-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(10,10,10,0.9) 100%)',
              padding: '3rem',
              borderRadius: '15px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setToolModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src={skillCategories[selectedCategory]?.tools.find(t => t.name === selectedTool)?.logo}
                alt={selectedTool}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>{selectedTool}</h3>
            <p style={{ color: '#cccccc', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {toolsData[selectedTool]?.description || 'A valuable tool in my skillset.'}
            </p>

            <button
              onClick={() => setToolModalOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '700',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
