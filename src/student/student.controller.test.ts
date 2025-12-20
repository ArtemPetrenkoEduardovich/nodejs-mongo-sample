import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import * as studentService from './student.service';
import * as groupService from '../group/group.service';
import { plainToInstance } from 'class-transformer';
import { StudentDetailsDto } from './dto/StudentDetailsDto';
import { NotFoundException } from '../exceptions/NotFoundException';
import { StudentInfoDto } from './dto/StudentInfoDto';

describe('Student Controller', () => {
  describe('GET /api/students/:id', () => {
    test('Should return a student', async () => {
      const id = new mongoose.Types.ObjectId();
      const studentFound = plainToInstance(
        StudentDetailsDto,
        {
          _id: id,
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        },
        { excludeExtraneousValues: true },
      );
      jest.spyOn(studentService, 'get').mockResolvedValueOnce(studentFound);
      const response = await request(app).get(`/api/students/${id.toString()}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: studentFound.name,
          surname: studentFound.surname,
          groupId: studentFound.groupId,
          birthDate: studentFound.birthDate!.toISOString(),
        }),
      );
    });
    test('Should throw 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const errorMessage = `Student with id ${id} not found.`;
      jest
        .spyOn(studentService, 'get')
        .mockRejectedValueOnce(new NotFoundException(errorMessage));
      const response = await request(app).get(`/api/students/${id.toString()}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        errors: errorMessage,
      });
    });
    test('Should throw 400 (invalid id)', async () => {
      const id = 'invalid-id';
      const errorMessage = `id ${id} is not valid`;
      const response = await request(app).get(`/api/students/${id.toString()}`);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [errorMessage],
      });
    });
  });

  describe('POST /api/students', () => {
    test('Should create a student', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const createStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      jest.spyOn(studentService, 'create').mockResolvedValueOnce(id);
      const response = await request(app)
        .post(`/api/students`)
        .send(createStudentDto);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: id });
    });
    test('Should validate groupId and throw 400 (group does not exist)', async () => {
      const createStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(false);
      const response = await request(app)
        .post(`/api/students`)
        .send(createStudentDto);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [`Group with id ${createStudentDto.groupId} doesn't exists.`],
      });
    });
    test('should validate empty name, surname, birthDate, groupId and throw 400', async () => {
      const response = await request(app).post(`/api/students`).send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: expect.arrayContaining([
          'name must be a string',
          'surname must be a string',
          'groupId must be a string',
          'birthDate must be a Date instance',
        ]),
      });
    });
    test('should validate address and throw 400', async () => {
      const response = await request(app)
        .post(`/api/students`)
        .send({
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
          address: {},
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: expect.arrayContaining([
          'country must be a string',
          'town must be a string',
          'addressString must be a string',
        ]),
      });
    });
  });

  describe('PATCH /api/students/:id', () => {
    test('Should update a student', async () => {
      const id = new mongoose.Types.ObjectId();
      const updateStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      jest.spyOn(studentService, 'update').mockResolvedValueOnce();
      const response = await request(app)
        .patch(`/api/students/${id.toString()}`)
        .send(updateStudentDto);
      expect(response.status).toBe(200);
    });
    test('Should validate groupId and throw 400 (group does not exist)', async () => {
      const id = new mongoose.Types.ObjectId();
      const updateStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      jest.spyOn(groupService, 'exists').mockResolvedValueOnce(false);
      const response = await request(app)
        .patch(`/api/students/${id.toString()}`)
        .send(updateStudentDto);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [`Group with id ${updateStudentDto.groupId} doesn't exists.`],
      });
    });
    test('should validate studentId because it is not valid', async () => {
      const id = 'studentId-is-not-valid';
      const updateStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
      };
      const response = await request(app)
        .patch(`/api/students/${id}`)
        .send(updateStudentDto);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: expect.arrayContaining([`id ${id} is not valid`]),
      });
    });
    test('should validate address', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const updateStudentDto = {
        name: 'John',
        surname: 'Doe',
        groupId: new mongoose.Types.ObjectId().toString(),
        birthDate: new Date('1988-01-30'),
        address: {},
      };
      const response = await request(app)
        .patch(`/api/students/${id.toString()}`)
        .send(updateStudentDto);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: expect.arrayContaining([
          'country must be a string',
          'town must be a string',
          'addressString must be a string',
        ]),
      });
    });
  });

  describe('GET /api/students/groupId/:groupId', () => {
    test('Should return list of students', async () => {
      const groupId = new mongoose.Types.ObjectId().toString();
      const students = [
        plainToInstance(StudentInfoDto, {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        }),
        plainToInstance(StudentInfoDto, {
          name: 'Alice',
          surname: 'Smith',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1995-07-15'),
        }),
      ];
      jest
        .spyOn(studentService, 'listByGroupId')
        .mockResolvedValueOnce(students);
      const response = await request(app).get(
        `/api/students/groupId/${groupId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
    test('Should return an empty list', async () => {
      const groupId = new mongoose.Types.ObjectId().toString();
      jest
        .spyOn(studentService, 'listByGroupId')
        .mockResolvedValueOnce([]);
      const response = await request(app).get(
        `/api/students/groupId/${groupId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
    test('Should validate groupId because it is not valid', async () => {
      const groupId = 'groupId-is-not-valid';
      const response = await request(app).get(
        `/api/students/groupId/${groupId}`,
      );
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: expect.arrayContaining([`id ${groupId} is not valid`]),
      });
    });
  });

  describe('POST /api/students/_search', () => {
    test('Should return list of students by query', async () => {
      const students = [
        plainToInstance(StudentInfoDto, {
          name: 'John',
          surname: 'Doe',
          groupId: new mongoose.Types.ObjectId().toString(),
          birthDate: new Date('1988-01-30'),
        }),
      ];
      const query = {
        groupId: new mongoose.Types.ObjectId().toString(),
        name: 'John',
        surname: 'Doe',
      };
      jest
        .spyOn(studentService, 'search')
        .mockResolvedValueOnce(students);
      const response = await request(app).post(
        `/api/students/_search`,
      ).send(query);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
    test('Should return an empty list', async () => {
      const query = {
        groupId: new mongoose.Types.ObjectId().toString(),
        name: 'John',
        surname: 'Doe',
      };
      jest
        .spyOn(studentService, 'search')
        .mockResolvedValueOnce([]);
      const response = await request(app).post(
        `/api/students/_search`,
      ).send(query);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
    test('Should validate groupId because it is not valid', async () => {
      const groupId = 'groupId-is-not-valid';
      const response = await request(app).post(
        `/api/students/_search`,
      ).send({ groupId });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: expect.arrayContaining([`id ${groupId} is not valid`]),
      });
    });
  });

  describe('DELETE /api/students/:id', () => {
    test('Should remove a student by id', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      jest
        .spyOn(studentService, 'remove')
        .mockResolvedValueOnce();
      const response = await request(app).delete(
        `/api/students/${id}`,
      );
      expect(response.status).toBe(204);
    });
    test('Should validate id because it is not valid', async () => {
      const id = 'studentId-is-not-valid';
      const response = await request(app).delete(
        `/api/students/${id}`,
      );
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: expect.arrayContaining([`id ${id} is not valid`]),
      });
    });
  });
});
