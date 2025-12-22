import * as groupService from './group.service';
import * as groupRepository from './group.repository';
import mongoose from 'mongoose';

describe('Group Service', () => {
  describe('list', () => {
    test('should provide list of groups', async () => {
      const groupsFound = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Group-1',
          startYear: 2020,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Group-2',
          startYear: 2021,
        },
      ];

      jest.spyOn(groupRepository, 'list').mockResolvedValueOnce(groupsFound);

      const groups = await groupService.list();
      expect(groups).toHaveLength(2);
      expect(groups[0].name).toBe('Group-1');
      expect(groups[0].startYear).toBe(2020);
      expect(groups[1].name).toBe('Group-2');
      expect(groups[1].startYear).toBe(2021);
    });
    test('should provide an empty list', async () => {
      jest.spyOn(groupRepository, 'list').mockResolvedValueOnce([]);
      const groups = await groupService.list();
      expect(groups).toHaveLength(0);
    });
  });

  describe('create', () => {
    test('should create group', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      jest.spyOn(groupRepository, 'create').mockResolvedValueOnce(id);
      const groupId = await groupService.create({
        name: 'Test Group',
        startYear: 2025,
      });
      expect(groupId).toEqual(id);
    });
  });

  describe('exists', () => {
    test('should return true when entity exists', async () => {
      jest.spyOn(groupRepository, 'exists').mockResolvedValueOnce(true);
      const exists = await groupService.exists(
        new mongoose.Types.ObjectId().toString(),
      );
      expect(exists).toBeTruthy();
    });
    test("should return false when entity doesn't exists", async () => {
      jest.spyOn(groupRepository, 'exists').mockResolvedValueOnce(false);
      const exists = await groupService.exists(
        new mongoose.Types.ObjectId().toString(),
      );
      expect(exists).toBeFalsy();
    });
    test('should throw an error because of invalid id', async () => {
      await expect(groupService.exists('invalidId')).rejects.toMatchObject({
        errors: expect.arrayContaining(['Group id invalidId is invalid']),
      });
    });
  });
});
