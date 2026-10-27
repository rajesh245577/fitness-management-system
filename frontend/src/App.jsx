
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8081/api/members";

function App() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    weightKg: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadMembers() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load members");
      setMembers(await response.json());
    } catch {
      setMessage("Cannot connect to backend. Check that Docker is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  
async function addMember(event) {
  event.preventDefault();
  setMessage("");

  const isEditing = editingMember !== null;

  try {
    const response = await fetch(
      isEditing ? `${API}/${editingMember.id}` : API,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          weightKg: Number(form.weightKg),
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Could not save member");
    }

    setForm({ name: "", email: "", weightKg: "" });
    setEditingMember(null);
    setMessage(
      isEditing
        ? "Member updated successfully."
        : "Member added successfully."
    );

    await loadMembers();
  } catch (error) {
    setMessage(error.message || "Failed to save member.");
  }
}

function editMember(member) {
  setEditingMember(member);

  setForm({
    name: member.name,
    email: member.email,
    weightKg: String(member.weightKg),
  });

  setMessage("");
}


  async function deleteMember(id) {
    if (!window.confirm("Delete this member?")) return;

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete member");
      setMembers((current) => current.filter((member) => member.id !== id));
      setMessage("Member deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <h1>FitTrack</h1>
            <p>Fitness Management System</p>
          </div>
        </div>
        <span className="status"><span /> System dashboard</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">YOUR FITNESS WORKSPACE</p>
          <h2>Manage your members.</h2>
          <p className="subtitle">
            Keep member details organized in one place.
          </p>
        </div>
        <div className="welcome-icon">✦</div>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span className="stat-label">TOTAL MEMBERS</span>
          <strong>{members.length}</strong>
          <span className="stat-note">Registered members</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">AVERAGE WEIGHT</span>
          <strong>
            {members.length
              ? (members.reduce((sum, m) => sum + Number(m.weightKg || 0), 0) /
                  members.length).toFixed(1)
              : "0.0"}{" "}
            <small>kg</small>
          </strong>
          <span className="stat-note">Across recorded members</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">SYSTEM STATUS</span>
          <strong className="online">Online</strong>
          <span className="stat-note">Dashboard available</span>
        </article>
      </section>

      <section className="content">
        <article className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MEMBER DETAILS</p>
              <h3>{editingMember ? "Edit member" : "Add a member"}</h3>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={addMember}>
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter member name"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="member@example.com"
                required
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.weightKg}
                onChange={(e) =>
                  setForm({ ...form, weightKg: e.target.value })
                }
                placeholder="e.g. 65.5"
                required
              />
            </label>
          <button className="primary-button" type="submit">
            {editingMember ? "Save changes" : "Add member"} <span>→</span>
          </button>

          {editingMember && (
            <button
              className="refresh-button"
              type="button"
              onClick={() => {
                setEditingMember(null);
                setForm({ name: "", email: "", weightKg: "" });
                setMessage("");
              }}
            >
              Cancel
            </button>
          )}

          <button
            className="edit-button"
            onClick={() => editMember(member)}
            aria-label={`Edit ${member.name}`}
          >
            Edit
          </button>

          </form>
          {message && <p className="message" role="status">{message}</p>}
        </article>

        <article className="panel members-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR DATABASE</p>
              <h3>Registered members</h3>
            </div>
            <button className="refresh-button" onClick={loadMembers}>
              Refresh ↻
            </button>
          </div>

          {loading ? (
            <p className="empty">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="empty">No members yet. Add your first member.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>MEMBER</th>
                    <th>WEIGHT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-name">
                          <span className="avatar">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <strong>{member.name}</strong>
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{member.weightKg} kg</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => deleteMember(member.id)}
                          aria-label={`Delete ${member.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      <footer>FitTrack · Fitness Management System · DevOps Project</footer>
    </main>
  );
}

export default App;
