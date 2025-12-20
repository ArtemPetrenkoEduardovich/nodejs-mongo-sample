import express from 'express';
import groups from '../group/group.router';
import students from '../student/student.router';

const router = express.Router();

router.use('/api/groups', groups);
router.use('/api/students', students);

export default router;
