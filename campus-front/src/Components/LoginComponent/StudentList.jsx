import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteUser } from '../../Services/LoginService';
import './StudentList.css';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents()
      .then((response) => {
        const studentData = response.data || [];
        setStudents(studentData.map(student => ({
          userId: student.username,
          email: student.email || `${student.username}@student.edu`,
          role: student.role || 'Student',
          itemsCount: student.itemsCount || 0 // Default to 0 if itemsCount is not provided
        })));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setStudents([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const handleDeleteStudent = (userId) => {
    if (window.confirm(`Are you sure you want to delete student ${userId}?`)) {
      deleteUser(userId)
        .then(() => {
          setStudents(students.filter(student => student.userId !== userId));
          alert('Student deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
          if (error.response?.status === 409) {
            alert('Cannot delete student because they have reported lost or found items.');
          } else {
            alert('Failed to delete student. Please try again.');
          }
        });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>CampusConnect Student Management</h1>
          </div>
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate('/AdminMenu')}>
              ← Back
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Student List ({students.length})</h2>
        {students.length === 0 ? (
          <div className="no-students">
            <h3>No students found</h3>
            <p>No students are registered in the system.</p>
          </div>
        ) : (
          <div className="students-grid">
            {students.map((student, index) => (
              <div key={student.userId || index} className="student-card">
                <div className="student-info">
                  <h3>{student.userId}</h3>
                  <p>Email: {student.email}</p>
                  <p>Role: {student.role}</p>
                  {student.itemsCount !== undefined && (
                    <p>Items Reported: {student.itemsCount}</p>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteStudent(student.userId)}
                  title="Delete Student"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;