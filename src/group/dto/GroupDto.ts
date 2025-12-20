import { Expose, Transform } from 'class-transformer';

export class GroupDto {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  startYear!: number;
}
