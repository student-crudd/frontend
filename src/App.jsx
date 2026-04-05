import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8081/students';

const emptyForm = {
  name: '',
  department: '',
  email: ''
};

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch students. Please check backend server.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      setErrorMessage('Unable to save student. Make sure email is unique.');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      department: student.department,
      email: student.email
    });
  };

  const handleDelete = async (id) => {
    setErrorMessage('');

    try {
      await axios.delete(`${API_URL}/${id}`);
      if (editingId === id) {
        resetForm();
      }
      fetchStudents();
    } catch (error) {
      setErrorMessage('Unable to delete student.');
    }
  };

  return (
    <div className="app-shell">
      <div className="page-glow" />
      <main className="container">
        <h1>Student Management System</h1>

        <section className="panel">
          <h2>{editingId ? 'Update Student' : 'Add Student'}</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="actions">
              <button type="submit">{editingId ? 'Save Changes' : 'Submit'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>View Students</h2>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.department}</td>
                      <td>{student.email}</td>
                      <td className="row-actions">
                        <button type="button" onClick={() => handleEdit(student)}>
                          Update
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
