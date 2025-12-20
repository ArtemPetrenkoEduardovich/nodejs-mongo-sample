import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { MIN_GROUP_START_YEAR, MIN_LENGTH_GROUP_NAME } from '../group.model';
import {
  GROUP_NAME_LENGTH_LESS_THAN_2,
  GROUP_START_YEAR_LESS_THAN_2020,
} from '../group.errorCodes';

export class GroupCreateDto {
  @IsString()
  @MinLength(MIN_LENGTH_GROUP_NAME, { message: GROUP_NAME_LENGTH_LESS_THAN_2 })
  name!: string;

  @IsNumber()
  @Min(MIN_GROUP_START_YEAR, { message: GROUP_START_YEAR_LESS_THAN_2020 })
  startYear!: number;
}
