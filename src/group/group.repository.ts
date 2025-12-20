import Group, { GroupData } from './group.model';
import { GroupCreateDto } from './dto/GroupCreateDto';

export const list = async (): Promise<GroupData[]> => {
  return Group.find({}).lean();
};

export const create = async ({
  name,
  startYear,
}: GroupCreateDto): Promise<string> => {
  const group = await new Group({
    name,
    startYear,
  }).save();
  return group._id.toString();
};

export const exists = async (id: string): Promise<boolean> => {
  return !!(await Group.exists({
    _id: id,
  }));
};
