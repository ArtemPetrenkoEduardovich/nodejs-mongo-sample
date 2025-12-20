import { StudentCreateDto } from './dto/StudentCreateDto';
import * as studentRepository from './student.repository';
import { plainToInstance } from 'class-transformer';
import { StudentDetailsDto } from './dto/StudentDetailsDto';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { StudentUpdateDto } from './dto/StudentUpdateDto';
import { StudentInfoDto } from './dto/StudentInfoDto';
import * as groupService from '../group/group.service';
import { StudentQueryDto } from './dto/query/StudentQueryDto';
import { isIdValid } from '../common/validators/validateDocumentId';

export const get = async (id: string): Promise<StudentDetailsDto> => {
  if (!isIdValid(id)) {
    throw new ValidationException(`id ${id} is not valid`);
  }
  const student = await studentRepository.get(id);

  if (!student) {
    throw new NotFoundException(`Student with id ${id} not found.`);
  }
  return plainToInstance(StudentDetailsDto, student, {
    excludeExtraneousValues: true,
  });
};

export const create = async (createDto: StudentCreateDto): Promise<string> => {
  await validateGroupId(createDto.groupId);
  return studentRepository.create(createDto);
};

export const update = async (
  id: string,
  studentDto: StudentUpdateDto,
): Promise<void> => {
  if (!isIdValid(id)) {
    throw new ValidationException(`id ${id} is not valid`);
  }
  if (studentDto.groupId) {
    await validateGroupId(studentDto.groupId);
  }
  await studentRepository.update(id, studentDto);
};

export const listByGroupId = async (
  groupId: string,
): Promise<StudentInfoDto[]> => {
  if (!isIdValid(groupId)) {
    throw new ValidationException(`id ${groupId} is not valid`);
  }
  const students = await studentRepository.filter(
    plainToInstance(StudentQueryDto, { groupId }),
  );
  return students.map((student) =>
    plainToInstance(StudentInfoDto, student, {
      excludeExtraneousValues: true,
    }),
  );
};

export const search = async (
  query: StudentQueryDto,
): Promise<StudentInfoDto[]> => {
  if (!!query.groupId && !isIdValid(query.groupId)) {
    throw new ValidationException(`id ${query.groupId} is not valid`);
  }
  const students = await studentRepository.filter(query);
  return students.map((student) =>
    plainToInstance(StudentInfoDto, student, {
      excludeExtraneousValues: true,
    }),
  );
};

export const remove = async (id: string): Promise<void> => {
  if (!isIdValid(id)) {
    throw new ValidationException(`id ${id} is not valid`);
  }
  await studentRepository.remove(id);
};

export const validateGroupId = async (id: string): Promise<void> => {
  const groupExists = await groupService.exists(id);
  if (!groupExists) {
    throw new ValidationException(`Group with id ${id} doesn't exists.`);
  }
};
