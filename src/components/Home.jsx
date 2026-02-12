import React from "react";

export default function Home() {
  const companiesData = [
    { name: "Startups", value: 40 },
    { name: "SMEs", value: 65 },
    { name: "Enterprises", value: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Smart Customer Support,
          <span className="text-blue-600"> Simplified</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We help companies manage customer issues faster, smarter, and more
          efficiently with a modern ticketing system.
        </p>
      </section>

      {/* WHAT WE DO */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Centralized Support",
            desc: "All customer queries in one powerful dashboard.",
            icon: "📥",
          },
          {
            title: "Smart Assignment",
            desc: "Tickets automatically routed to the right team.",
            icon: "⚙️",
          },
          {
            title: "Fast Resolution",
            desc: "Reduce response time and increase satisfaction.",
            icon: "🚀",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* GRAPH SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-2">Companies Trusting Us</h2>
          <p className="text-sm text-gray-500 mb-8">
            Growing adoption across industries
          </p>

          <div className="flex items-end justify-center gap-10 h-52">
            {companiesData.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div
                  className="w-14 rounded-xl bg-gradient-to-t from-blue-500 to-blue-400 shadow-md"
                  style={{ height: `${item.value}%` }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFECTION / TRUST */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {[
          { value: "99.9%", label: "Uptime Reliability" },
          { value: "24/7", label: "Support Availability" },
          { value: "100%", label: "Data Security" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white to-blue-50 border rounded-2xl p-8 text-center shadow-sm"
          >
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {item.value}
            </p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 pb-8">
        © 2025 Video Advertisements System · Built for modern support teams
      </footer>
    </div>
  );
}
