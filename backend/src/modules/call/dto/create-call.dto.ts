import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsNotEmpty, 
  MinLength, 
  MaxLength,
  IsPositive,
  ArrayUnique
} from 'class-validator';

export class CreateCallDto {
  @IsString()
  @IsNotEmpty({ message: 'Call title is required' })
  @MinLength(3, { message: 'Call title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Call title must not exceed 200 characters' })
  title: string;

  @IsNumber({}, { message: 'User ID must be a valid number' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;

  @IsOptional()
  @IsArray({ message: 'Tag IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each tag ID must be a valid number' })
  @IsPositive({ each: true, message: 'Each tag ID must be a positive number' })
  @ArrayUnique({ message: 'Tag IDs must be unique' })
  tagIds?: number[];
}