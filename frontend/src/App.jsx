import { useEffect, useState } from "react";
import { api } from "./lib/api";

export default function App() {
  const [health, setHealth] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", name: "" });
  const [dorms, setDorms] = useState([]);
  const [dormForm, setDormForm] = useState({ name: "", price: 0 , location: "", rating: 0, image_url: "" });

  useEffect(() => {
    api.get("/health")
      .then(r => setHealth(`DB: ${r.data.db} @ ${r.data.now}`))
      .catch(() => setHealth("Backend unreachable"));

    api.get("/users")
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]));

    api.get("/dorms")
      .then(r => console.log(r.data))
      .catch(() => console.log("Could not fetch dorms"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    await api.post("/users", form);
    setForm({ email: "", name: "" });
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const dormSubmit = async (e) => {
    e.preventDefault();
    if (!dormForm.name || !dormForm.price || !dormForm.location || !dormForm.rating || !dormForm.image_url) return;
    await api.post("/dorms", dormForm);
    setDormForm({ name: "", price: 0 , location: "", rating: 0, image_url: "" });
    const { data } = await api.get("/dorms");
    setDorms(data);
  }
  
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">LUMIQ</h1>
      <p className="text-center mb-8 text-gray-600">{health}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create User</h2>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4">
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add User
          </button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Dorm</h2>
        <form onSubmit={dormSubmit} className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name"
            value={dormForm.name}
            onChange={e => setDormForm({ ...dormForm, name: e.target.value })}
          />
          <input
            type="number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Price"
            value={dormForm.price}
            onChange={e => setDormForm({ ...dormForm, price: Number(e.target.value) })}
          />
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Location"
            value={dormForm.location}
            onChange={e => setDormForm({ ...dormForm, location: e.target.value })}
          />
          <input
            type="number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rating"
            value={dormForm.rating}
            onChange={e => setDormForm({ ...dormForm, rating: Number(e.target.value) })}
          />
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring -2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Image URL"
            value={dormForm.image_url}
            onChange={e => setDormForm({ ...dormForm, image_url: e.target.value })}
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Dorm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users found</p>
        ) : (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <span className="font-medium text-gray-800">{u.name}</span>
                <span className="text-gray-600 ml-2">({u.email})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dorms</h2>
        {dorms.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No dorms found</p>
        ) : (
          <ul className="space-y-2">
            {dorms.map(d => (
              <li key={d.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <span className="font-medium text-gray-800">{d.name}</span>
                <span className="text-gray-600 ml-2">({d.location})</span>
                <span className="text-gray-600 ml-2">- ${d.price} per month</span>
                <span className="text-gray-600 ml-2">- Rating: {d.rating}/5</span>
                <div className="mt-2">
                  <img src={d.image_url} alt={d.name} className="w-32 h-32 object-cover rounded-md" />
                </div>  
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
