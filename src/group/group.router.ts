import express from 'express';
import { listGroups, create } from './group.controller';
import validateDto from '../middleware/validateDto';
import { GroupCreateDto } from './dto/GroupCreateDto';

const router = express.Router();

router.get('', listGroups);
router.post('', validateDto(GroupCreateDto), create);

export default router;
