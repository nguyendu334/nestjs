import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class Validate implements PipeTransform<string> {
  transform(value: string): string {
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      throw new NotFoundException('Product not found');
    }
    throw new BadRequestException('Invalid');
  }
}
