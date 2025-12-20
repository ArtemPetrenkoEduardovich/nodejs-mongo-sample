import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { GroupCreateDto } from './dto/GroupCreateDto';
import * as groupService from './group.service';

export const listGroups = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await groupService.list();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const groupSaveDto = plainToInstance(GroupCreateDto, req.body);
    const id = await groupService.create(groupSaveDto);
    res.status(StatusCodes.CREATED).json({
      id,
    });
  } catch (error) {
    next(error);
  }
};
