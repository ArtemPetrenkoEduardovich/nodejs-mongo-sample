import express from 'express';
import {
  get,
  create,
  update,
  listByGroupId,
  search,
  remove,
} from './student.controller';
import validateDto from '../middleware/validateDto';
import { StudentCreateDto } from './dto/StudentCreateDto';
import { StudentUpdateDto } from './dto/StudentUpdateDto';
import { StudentQueryDto } from './dto/query/StudentQueryDto';

const router = express.Router();

router.get('/:id', get);
router.post('', validateDto(StudentCreateDto), create);
router.patch('/:id', validateDto(StudentUpdateDto), update);
router.get('/groupId/:groupId', listByGroupId);
router.post('/_search', validateDto(StudentQueryDto), search);
router.delete('/:id', remove);

export default router;
