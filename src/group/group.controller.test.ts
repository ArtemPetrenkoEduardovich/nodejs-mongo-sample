import request from 'supertest';
import mongoose from 'mongoose';
import * as groupService from './group.service';
import app from '../app';
import {
  GROUP_NAME_LENGTH_LESS_THAN_2,
  GROUP_START_YEAR_LESS_THAN_2020,
} from './group.errorCodes';

describe('Group Controller', () => {
  describe('GET /api/groups', () => {
    test('Should return list of groups', async () => {
      const id1 = new mongoose.Types.ObjectId().toString();
      const id2 = new mongoose.Types.ObjectId().toString();
      const group1 = {
        _id: id1,
        name: 'Group-1',
        startYear: 2020,
      };
      const group2 = {
        _id: id2,
        name: 'Group-5',
        startYear: 2025,
      };
      const responseBody = [
        {
          ...group1,
        },
        {
          ...group2,
        },
      ];
      jest.spyOn(groupService, 'list').mockResolvedValueOnce([group1, group2]);
      const response = await request(app).get('/api/groups');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(responseBody);
    });
    test('Should return an empty list', async () => {
      jest.spyOn(groupService, 'list').mockResolvedValueOnce([]);
      const response = await request(app).get('/api/groups');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/groups', () => {
    test('Should create a group', async () => {
      const body = {
        name: 'Group',
        startYear: 2025,
      };
      const id = new mongoose.Types.ObjectId().toString();
      jest.spyOn(groupService, 'create').mockResolvedValueOnce(id);
      const response = await request(app).post('/api/groups').send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: id.toString() });
    });
    test('Should throw 400. startYear less than 2020', async () => {
      const body = {
        name: 'Group',
        startYear: 2019,
      };

      const response = await request(app).post('/api/groups').send(body);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [GROUP_START_YEAR_LESS_THAN_2020],
      });
    });
    test('Should throw 400. groupName less than 2 symbols', async () => {
      const body = {
        name: 'G',
        startYear: 2020,
      };

      const response = await request(app).post('/api/groups').send(body);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [GROUP_NAME_LENGTH_LESS_THAN_2],
      });
    });
  });
});
