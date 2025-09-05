import { useEffect, useState } from "react";
import { api } from "./lib/api";

export default function App() {
  const [health, setHealth] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", name: "" });

  useEffect(() => {
    api.get("/health")
      .then(r => setHealth(`DB: ${r.data.db} @ ${r.data.now}`))
      .catch(() => setHealth("Backend unreachable"));

    api.get("/users")
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    await api.post("/users", form);
    setForm({ email: "", name: "" });
    const { data } = await api.get("/users");
    setUsers(data);
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>LUMIQ</h1>
      <p>{health}</p>

      <h2>Create user</h2>
      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.id}. {u.name} ({u.email})</li>)}
      </ul>
    </main>
  );
}
