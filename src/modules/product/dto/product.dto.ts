import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @IsEmpty()
  reviews: object[];

  @IsEmpty()
  totalReviews: number;

  @IsEmpty()
  rating: number;
}
