import { StudentData } from './student.model';
import * as studentService from './student.service';
import * as studentRepository from './student.repository';
import * as groupService from '../group/group.service';
import mongoose from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { StudentCreateDto } from './dto/StudentCreateDto';
import { StudentUpdateDto } from './dto/StudentUpdateDto';
import { StudentQueryDto } from './dto/query/StudentQueryDto';

describe('Student Service', () => {
  describe('get', () => {
    test('should provide a student', async () => {
      const studentFound = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      jest.spyOn(studentRepository, 'get').mockResolvedValueOnce(studentFound);
      const student = await studentService.get(studentFound._id.toString());
      expect(student.name).toBe(studentFound.name);
      expect(student.surname).toBe(studentFound.surname);
      expect(student.groupId).toBe(studentFound.groupId);
      expect(student.birthDate).toEqual(studentFound.birthDate);
    });
    test('should throw NotFoundException', async () => {
      const studentId = new mongoose.Types.ObjectId();
      jest.spyOn(studentRepository, 'get').mockResolvedValueOnce(null);
      await expect(studentService.get(studentId.toString())).rejects.toThrow(
        `Student with id ${studentId} not found.`,
      );
    });
    test('should throw invalid id', async () => {
      await expect(studentService.get('invalidId')).rejects.toMatchObject({
        errors: expect.arrayContaining(['id invalidId is not valid']),
      });
    });
  });

  describe('create', () => {
    test('should create a student', async () => {
      const studentId = new mongoose.Types.ObjectId().toString();
      const createDto = plainToInstance(
        StudentCreateDto,
        {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          excludeExtraneousValues: true,
        },
      );
      jest.spyOn(studentRepository, 'create').mockResolvedValueOnce(studentId);
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(true);
      const result = await studentService.create(createDto);
      expect(result).toEqual(studentId);
    });
    test('should validate groupId because the group does not exist', async () => {
      const createDto = plainToInstance(
        StudentCreateDto,
        {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          excludeExtraneousValues: true,
        },
      );
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(false);
      await expect(studentService.create(createDto)).rejects.toMatchObject({
        errors: expect.arrayContaining([
          `Group with id ${createDto.groupId} doesn't exists.`,
        ]),
      });
    });
  });

  describe('update', () => {
    test('should update a student', async () => {
      const studentId = new mongoose.Types.ObjectId().toString();
      const updateDto = plainToInstance(
        StudentUpdateDto,
        {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          excludeExtraneousValues: true,
        },
      );
      jest.spyOn(studentRepository, 'update').mockResolvedValueOnce();
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(true);
      await studentService.update(studentId, updateDto);
      expect(studentRepository.update).toHaveBeenCalledTimes(1);
    });
    test('should validate groupId because the group does not exist', async () => {
      const studentId = new mongoose.Types.ObjectId().toString();
      const updateDto = plainToInstance(
        StudentUpdateDto,
        {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          excludeExtraneousValues: true,
        },
      );
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(false);
      await expect(
        studentService.update(studentId, updateDto),
      ).rejects.toMatchObject({
        errors: expect.arrayContaining([
          `Group with id ${updateDto.groupId} doesn't exists.`,
        ]),
      });
    });
    test('should validate studentId because it is not valid', async () => {
      const studentId = 'studentId-is-not-valid';
      const updateDto = plainToInstance(
        StudentUpdateDto,
        {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          excludeExtraneousValues: true,
        },
      );
      await expect(
        studentService.update(studentId, updateDto),
      ).rejects.toMatchObject({
        errors: expect.arrayContaining([`id ${studentId} is not valid`]),
      });
    });
  });

  describe('listByGroupId', () => {
    test('should return list of students', async () => {
      const groupId = new mongoose.Types.ObjectId().toString();
      const students = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Alice',
          surname: 'Smith',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1995-07-15'),
        },
      ];
      jest.spyOn(studentRepository, 'filter').mockResolvedValueOnce(students);
      const result = await studentService.listByGroupId(groupId);
      expect(result).toHaveLength(2);
    });
    test('should return an empty list', async () => {
      const groupId = new mongoose.Types.ObjectId().toString();
      jest.spyOn(studentRepository, 'filter').mockResolvedValueOnce([]);
      const result = await studentService.listByGroupId(groupId);
      expect(result).toHaveLength(0);
    });
    test('should validate groupId because it is not valid', async () => {
      const groupId = 'groupId-is-not-valid';
      await expect(studentService.listByGroupId(groupId)).rejects.toMatchObject(
        {
          errors: expect.arrayContaining([`id ${groupId} is not valid`]),
        },
      );
    });
  });

  describe('search', () => {
    test('should return list of students by query', async () => {
      const students = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        }
      ];
      const query = plainToInstance(StudentQueryDto, {
        groupId: new mongoose.Types.ObjectId().toString(),
        name: 'John',
        surname: 'Doe',
      });
      jest.spyOn(studentRepository, 'filter').mockResolvedValueOnce(students);
      const result = await studentService.search(query);
      expect(result).toHaveLength(1);
    });
    test('should return an empty list', async () => {
      const query = plainToInstance(StudentQueryDto, {
        groupId: new mongoose.Types.ObjectId().toString(),
        name: 'John',
        surname: 'Doe',
      });
      jest.spyOn(studentRepository, 'filter').mockResolvedValueOnce([]);
      const result = await studentService.search(query);
      expect(result).toHaveLength(0);
    });
    test('should validate groupId because it is not valid', async () => {
      const groupId = 'groupId-is-not-valid';
      await expect(
        studentService.search(
          plainToInstance(StudentQueryDto, {
            groupId,
          }),
        ),
      ).rejects.toMatchObject({
        errors: expect.arrayContaining([`id ${groupId} is not valid`]),
      });
    });
  });

  describe('remove', () => {
    test('should remove a student by id', async () => {
      jest.spyOn(studentRepository, 'remove').mockResolvedValueOnce();
      await studentService.remove(new mongoose.Types.ObjectId().toString());
      expect(studentRepository.remove).toHaveBeenCalledTimes(1);
    });
    test('should validate id because it is not valid', async () => {
      const studentId = 'studentId-is-not-valid';
      await expect(studentService.remove(studentId)).rejects.toMatchObject({
        errors: expect.arrayContaining([`id ${studentId} is not valid`]),
      });
    });
  });
});
