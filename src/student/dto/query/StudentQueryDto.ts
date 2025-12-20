import { BaseQueryDto } from '../../../common/dto/BaseQueryDto';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class StudentQueryDto extends BaseQueryDto {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  surname?: string;

  @Expose()
  @IsString()
  @IsOptional()
  groupId?: string;
}
