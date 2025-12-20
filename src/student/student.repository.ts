import Student, { StudentData } from './student.model';
import { StudentCreateDto } from './dto/StudentCreateDto';
import { StudentUpdateDto } from './dto/StudentUpdateDto';
import { StudentQueryDto } from './dto/query/StudentQueryDto';

export const get = async (id: string): Promise<StudentData | null> => {
  return Student.findById(id).lean();
};

export const create = async (
  studentData: StudentCreateDto,
): Promise<string> => {
  const student = await new Student(studentData).save();

  return student._id.toString();
};

export const update = async (
  id: string,
  studentData: StudentUpdateDto,
): Promise<void> => {
  await Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: studentData,
    },
  );
};

export const filter = async (
  query: StudentQueryDto,
): Promise<StudentData[]> => {
  const { name, surname, groupId } = query;
  return Student.find({
    ...(name && { name }),
    ...(surname && { surname }),
    ...(groupId && { groupId }),
  })
    .skip(query.skip)
    .limit(query.limit);
};

export const remove = async (id: string): Promise<void> => {
  await Student.findByIdAndDelete(id);
};
