import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class StudentAddressDto {
  @Expose()
  @IsString()
  country!: string;

  @Expose()
  @IsString()
  town!: string;

  @Expose()
  @IsString()
  addressString!: string;
}
