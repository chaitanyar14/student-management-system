const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { validateStudent, handleValidationErrors } = require('../middleware/validation');

// Protect all student routes
router.use(protect);

router.route('/')
  .get(getStudents)
  .post(validateStudent, handleValidationErrors, createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(validateStudent, handleValidationErrors, updateStudent)
  .delete(deleteStudent);

module.exports = router;
