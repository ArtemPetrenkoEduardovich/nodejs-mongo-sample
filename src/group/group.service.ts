import { GroupCreateDto } from './dto/GroupCreateDto';
import { GroupDto } from './dto/GroupDto';
import * as groupRepository from './group.repository';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/ValidationException';
import { isIdValid } from '../common/validators/validateDocumentId';

export const list = async (): Promise<GroupDto[]> => {
  const groups = await groupRepository.list();
  return groups.map((group) =>
    plainToInstance(GroupDto, group, { excludeExtraneousValues: true }),
  );
};

export const create = async (
  createDto: GroupCreateDto,
): Promise<string> => {
  return groupRepository.create(createDto);
};

export const exists = async (id: string): Promise<boolean> => {
  if (!isIdValid(id)) {
    throw new ValidationException(`Group id ${id} is invalid`);
  }
  return await groupRepository.exists(id);
};
