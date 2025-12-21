export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-5xl mx-auto">
        <div className="text-2xl font-bold">Portfolio</div>
        <div className="flex gap-4">
          <a href="/" className="hover:text-blue-400">Home</a>
          <a href="/admin" className="hover:text-blue-400">Admin</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Selamat Datang</h1>
        <p className="text-xl text-gray-300 mb-8">
          Portfolio & Project Showcase
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">
          Lihat Project
        </button>
      </section>

      {/* Projects Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-700 p-6 rounded-lg hover:bg-slate-600 transition">
              <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
              <p className="text-gray-300 mb-4">Deskripsi project {i}</p>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Lihat Detail →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20 py-8 text-center text-gray-400">
        <p>&copy; 2025 My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}
