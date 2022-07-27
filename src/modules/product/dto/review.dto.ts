import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class reviewDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  rating: number;

  @ApiProperty()
  @IsString()
  comment: string;
}
