import * as groupRepository from './group.repository';
import {
  clearDatabase,
  startMongoContainer,
  stopMongoContainer,
} from '../test/mongo.setup';
import mongoose from 'mongoose';
import Group from './group.model';

describe('Group Repository', () => {
  beforeAll(async () => {
    await startMongoContainer();
  });

  afterAll(async () => {
    await stopMongoContainer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('list', () => {
    test('should provide list of groups', async () => {
      await new Group({
        name: 'Test Group',
        startYear: 2022,
      }).save();
      const groups = await groupRepository.list();
      expect(groups).toHaveLength(1);
      expect(groups[0].name).toBe('Test Group');
      expect(groups[0].startYear).toBe(2022);
    });
    test('should provide an empty list', async () => {
      const groups = await groupRepository.list();
      expect(groups).toHaveLength(0);
    });
  });

  describe('create', () => {
    test('should create group', async () => {
      const groupId = await groupRepository.create({
        name: 'Test Group',
        startYear: 2022,
      });
      expect(groupId).toBeDefined();
    });
    test('should validate startYear (2000 is less than 2020)', async () => {
      await expect(
        groupRepository.create({ name: 'Test Group', startYear: 2000 }),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'Group validation failed: startYear: Path `startYear` (2000) is less than minimum allowed value (2020).',
        ),
        name: 'ValidationError',
      });
    });
    test('should validate name (name should not be empty)', async () => {
      await expect(
        groupRepository.create({ name: '', startYear: 2035 }),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'Group validation failed: name: Path `name` is required.',
        ),
        name: 'ValidationError',
      });
    });
    test('should validate name (name should not be shorter than 2 symbols)', async () => {
      await expect(
        groupRepository.create({ name: 'F', startYear: 2035 }),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'Group validation failed: name: Path `name` (`F`) is shorter than the minimum allowed length (2).',
        ),
        name: 'ValidationError',
      });
    });
    test('should validate missing name field', async () => {
      await expect(
        groupRepository.create({ startYear: 2025 } as any),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'Group validation failed: name: Path `name` is required.',
        ),
        name: 'ValidationError',
      });
    });
    test('should validate missing startYear field', async () => {
      await expect(
        groupRepository.create({ name: 'Test Group' } as any),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'Group validation failed: startYear: Path `startYear` is required.',
        ),
        name: 'ValidationError',
      });
    });
  });

  describe('exists', () => {
    test('should return true when entity exists', async () => {
      const group = await new Group({
        name: 'Test Group',
        startYear: 2022,
      }).save();
      const exists = await groupRepository.exists(group._id.toString());
      expect(exists).toBeTruthy();
    });
    test("should return false when entity doesn't exists", async () => {
      const exists = await groupRepository.exists(
        new mongoose.Types.ObjectId().toString(),
      );
      expect(exists).toBeFalsy();
    });
  });
});
