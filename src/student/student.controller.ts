import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import * as studentService from './student.service';
import { StudentCreateDto } from './dto/StudentCreateDto';
import { StudentUpdateDto } from './dto/StudentUpdateDto';
import { StudentQueryDto } from './dto/query/StudentQueryDto';

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await studentService.get(id);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.send({
        ...result,
      });
    }
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
    const studentCreateDto = plainToInstance(StudentCreateDto, req.body);
    const id = await studentService.create(studentCreateDto);
    res.status(StatusCodes.CREATED).json({
      id,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const studentUpdateDto = plainToInstance(StudentUpdateDto, req.body);
    await studentService.update(id, studentUpdateDto);
    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

export const listByGroupId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.groupId as string;
    const list = await studentService.listByGroupId(id);
    res.status(StatusCodes.OK).json(list);
  } catch (error) {
    next(error);
  }
};

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = plainToInstance(StudentQueryDto, req.body);
    const result = await studentService.search(query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    await studentService.remove(id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
