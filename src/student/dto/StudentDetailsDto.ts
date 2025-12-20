import { StudentAddressDto } from './address/StudentAddressDto';
import { Expose, Transform } from 'class-transformer';

export class StudentDetailsDto {
  @Expose()
  name?: string;

  @Expose()
  surname?: string;

  @Expose()
  @Transform((params) => params.obj.groupId.toString())
  groupId?: string;

  @Expose()
  birthDate?: Date;

  @Expose()
  phoneNumbers?: string[];

  @Expose()
  address?: StudentAddressDto;
}
