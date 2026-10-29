
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8081/api/members";

function App() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to load members.");
      }

      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        "Unable to connect to the backend. Check whether the Spring Boot application is running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setEmail("");
    setWeightKg("");
    setEditingMember(null);
  }

  async function addMember(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const memberData = {
      name: name.trim(),
      email: email.trim(),
      weightKg: Number(weightKg),
    };

    if (
      !memberData.name ||
      !memberData.email ||
      weightKg === "" ||
      !Number.isFinite(memberData.weightKg) ||
      memberData.weightKg <= 0
    ) {
      setError("Please enter valid member details.");
      return;
    }

    try {
      const isEditing = editingMember !== null;

      const response = await fetch(
        isEditing ? `${API}/${editingMember.id}` : API,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberData),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to save member.");
      }

      setMessage(
        isEditing
          ? "Member updated successfully."
          : "Member added successfully."
      );

      resetForm();
      await loadMembers();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    }
  }

  function editMember(member) {
    setEditingMember(member);
    setName(member.name ?? "");
    setEmail(member.email ?? "");
    setWeightKg(String(member.weightKg ?? ""));
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function deleteMember(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to delete member.");
      }

      setMembers((previousMembers) =>
        previousMembers.filter((member) => member.id !== id)
      );

      if (editingMember?.id === id) {
        resetForm();
      }

      setMessage("Member deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    }
  }

  const averageWeight =
    members.length > 0
      ? (
          members.reduce(
            (total, member) =>
              total + (Number(member.weightKg) || 0),
            0
          ) / members.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <p className="eyebrow">FITNESS MANAGEMENT SYSTEM</p>
            <h1>Fitness Dashboard</h1>
            <p className="header-description">
              Manage your fitness members in one place.
            </p>
          </div>

          <div className="status-badge">
            <span className="status-dot"></span>
            System Dashboard
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Members</p>
            <h2>{members.length}</h2>
            <p className="stat-description">Registered members</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Average Weight</p>
            <h2>{averageWeight} kg</h2>
            <p className="stat-description">Across all members</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Application</p>
            <h2 className="system-status">Active</h2>
            <p className="stat-description">Fitness management</p>
          </div>
        </section>

        <section className="content-card">
          <div className="section-heading">
            <div>
              <h2>
                {editingMember ? "Edit Member" : "Add a Member"}
              </h2>
              <p>
                {editingMember
                  ? "Update the member's information."
                  : "Enter the details to register a new member."}
              </p>
            </div>
          </div>

          <form onSubmit={addMember} className="member-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weightKg">Weight (kg)</label>
              <input
                id="weightKg"
                type="number"
                placeholder="Enter weight"
                min="0.1"
                step="0.1"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingMember ? "Update Member" : "Add Member"}
              </button>

              {editingMember && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className="success-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="content-card">
          <div className="section-heading members-heading">
            <div>
              <h2>Registered Members</h2>
              <p>View, edit, and delete member information.</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadMembers}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="empty-state">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="empty-state">
              No members registered yet. Add your first member above.
            </p>
          ) : (
            <div className="table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Weight</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.weightKg} kg</td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => editMember(member)}
                            aria-label={`Edit ${member.name}`}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => deleteMember(member.id)}
                            aria-label={`Delete ${member.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="app-footer">
          Fitness Management System
        </footer>
      </main>
    </div>
  );
}

export default App;
