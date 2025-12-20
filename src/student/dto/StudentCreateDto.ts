import 'reflect-metadata';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxDate,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { StudentAddressDto } from './address/StudentAddressDto';

export class StudentCreateDto {
  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  surname!: string;

  @Expose()
  @IsString()
  groupId!: string;

  @Expose()
  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  birthDate!: Date;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @Expose()
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => StudentAddressDto)
  address?: StudentAddressDto;
}
