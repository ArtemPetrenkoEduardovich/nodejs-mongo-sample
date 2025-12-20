import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Expose } from 'class-transformer';

export class BaseQueryDto {
  @Expose()
  @IsInt()
  @Min(0)
  @IsOptional()
  skip: number = 0;

  @Expose()
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;
}
