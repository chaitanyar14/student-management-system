import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';
import SearchBar from '../components/SearchBar';
import { Plus, Users, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async (search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`/students?search=${search}`);
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchQuery);
  }, [searchQuery]);

  const handleAdd = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/students/${id}`);
        fetchStudents(searchQuery);
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingStudent) {
        await axios.put(`/students/${editingStudent.id}`, formData);
      } else {
        await axios.post('/students', formData);
      }
      setIsFormOpen(false);
      fetchStudents(searchQuery);
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.message || 'Failed to save student');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 hidden sm:block">EduManage</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">
                Welcome, {user?.name}
              </span>
              <button 
                onClick={logout}
                className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
            <p className="text-slate-500 mt-1">Manage all your students in one place</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:w-64">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <button onClick={handleAdd} className="btn-primary whitespace-nowrap">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Student</span>
            </button>
          </div>
        </div>

        {/* Student Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No students found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or add a new student.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onEdit={() => handleEdit(student)}
                onDelete={() => handleDelete(student.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <StudentForm 
              initialData={editingStudent}
              onSubmit={handleFormSubmit}
              onClose={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
