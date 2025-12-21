export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <a href="/" className="text-gray-300 hover:text-white">
            ← Kembali ke Home
          </a>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: "12" },
            { label: "Total Visitors", value: "1,234" },
            { label: "Messages", value: "56" },
            { label: "Downloads", value: "890" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Projects Management */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Kelola Projects</h2>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">Project Name</th>
                <th className="border-b px-4 py-3 font-semibold">Status</th>
                <th className="border-b px-4 py-3 font-semibold">Date</th>
                <th className="border-b px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">Project {i}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Published
                    </span>
                  </td>
                  <td className="px-4 py-3">Dec 22, 2025</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            + Tambah Project
          </button>
        </section>
      </main>
    </div>
  );
}
