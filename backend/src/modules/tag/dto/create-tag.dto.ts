import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  MinLength, 
  MaxLength,
  Matches 
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'Tag name is required' })
  @MinLength(2, { message: 'Tag name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Tag name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, {
    message: 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores'
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Description must not exceed 200 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex color (e.g. #FF0000 or #F00)'
  })
  color?: string;
}