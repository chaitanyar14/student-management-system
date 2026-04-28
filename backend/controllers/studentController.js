const db = require('../config/db');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM students ORDER BY created_at DESC';
    let params = [];

    if (search) {
      query = 'SELECT * FROM students WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC';
      params = [`%${search}%`, `%${search}%`];
    }

    const [students] = await db.execute(query, params);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const [student] = await db.execute('SELECT * FROM students WHERE id = ?', [req.params.id]);
    
    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  const { name, email, phone, course } = req.body;

  try {
    // Check if email already exists
    const [existing] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const [result] = await db.execute(
      'INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, course || null]
    );

    const [newStudent] = await db.execute('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json(newStudent[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  const { name, email, phone, course } = req.body;
  const studentId = req.params.id;

  try {
    // Check if student exists
    const [existing] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if email is taken by another student
    if (email && email !== existing[0].email) {
      const [emailCheck] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: 'Email already registered to another student' });
      }
    }

    await db.execute(
      'UPDATE students SET name = ?, email = ?, phone = ?, course = ? WHERE id = ?',
      [
        name || existing[0].name, 
        email || existing[0].email, 
        phone !== undefined ? phone : existing[0].phone, 
        course !== undefined ? course : existing[0].course, 
        studentId
      ]
    );

    const [updatedStudent] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);
    res.json(updatedStudent[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM students WHERE id = ?', [req.params.id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await db.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student removed successfully', id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
