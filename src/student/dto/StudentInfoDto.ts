import { Expose, Transform } from 'class-transformer';

export class StudentInfoDto {
  @Expose()
  @Transform((params) => params.obj._id)
  _id!: string;

  @Expose()
  @Transform(({ obj }) => `${obj.name} ${obj.surname}`)
  fullName!: string;

  @Expose()
  @Transform((params) => params.obj.groupId.toString())
  groupId!: string;
}
