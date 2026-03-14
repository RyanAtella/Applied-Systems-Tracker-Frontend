import { useEffect, useState } from "react";
import { getApplications, createApplication, deleteApplication, updateApplication } from "./api";
import './App.css';

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingID, setEditingID] = useState(null); //ID of the app being edited
  const [editingName, setEditingName] = useState(""); //Temp state for editing name


  //Form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [dateApplied, setDateApplied] = useState("");

  const userID = 4;

  //Fetch applications on mount
  useEffect(() => {
    getApplications()
      .then((data) => setApplications(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const newApp = await createApplication({
        company,
        role,
        status,
        date_applied: dateApplied,
        user_id: userID,
      });
      setApplications([...applications, newApp]); //add new app to state
      //Reset form
      setCompany("");
      setRole("");
      setStatus("Applied");
      setDateApplied("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id)); //remove deleted app from state
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading Applications...</p>;

  return (
    <div className="container">
      <h1>Applied Systems Tracker</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h2>Create Application</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offered">Offered</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
        </select>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          required
        />
        <button type="submit">Add Application</button>
      </form>

      <h2>Applications</h2>
      <table border = "1" cellPadding = "5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
        {applications.map((app, index) => (
           <tr key={app.id}>
             <td>{index + 1}</td>  {/* <- sequential numbering */}
             <td>
               {editingID === app.id ? (
                 <input
                   type="text"
                   value={editingName}
                   onChange={(e) => setEditingName(e.target.value)}
                 />
               ) : (
                 app.company
               )}
             </td>
             <td>{app.role}</td>
             <td>
               {editingID === app.id ? (
                 <select
                   value={app.status}
                   onChange={(e) => {
                   const updated = { ...app, status: e.target.value };
                   setApplications(applications.map(a => a.id === app.id ? updated : a));
                   }}
                 >
                   <option value="Applied">Applied</option>
                   <option value="Interviewing">Interviewing</option>
                   <option value="Offered">Offered</option>
                   <option value="Rejected">Rejected</option>
                   <option value="Accepted">Accepted</option>
                 </select>
              ) : (
                app.status
            )}
          </td>
          <td>{app.date_applied}</td>
          <td>
            <div className="actions">
            {editingID === app.id ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      const updated = await updateApplication(app.id, {
                        company: editingName,
                        role: app.role,
                        status: app.status,
                        date_applied: app.date_applied,
                        user_id: app.user_id,
                      });
                      setApplications(applications.map(a => a.id === app.id ? updated : a));
                      setEditingID(null);
                      setEditingName("");
                    } catch (err) {
                      setError(err.message);
                    }
                  }}
                >
                  Save
                </button>
                <button onClick={() => setEditingID(null)}>Cancel</button>
              </>
            ) : (
              <>
              <button
                onClick={() => {
                  setEditingID(app.id);
                  setEditingName(app.company);
                }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteApplication(app.id);
                    setApplications(applications.filter(a => a.id !== app.id));
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>




      </table>
    </div>
  );
}

export default App;