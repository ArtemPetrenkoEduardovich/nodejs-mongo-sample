import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxDate,
  ValidateNested,
} from 'class-validator';
import { StudentAddressDto } from './address/StudentAddressDto';

export class StudentUpdateDto {
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

  @Expose()
  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @Expose()
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => StudentAddressDto)
  address?: StudentAddressDto;
}
