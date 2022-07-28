import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('number', { default: 0 })
  price: number;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true, default: [] })
  @Type(() => Review)
  reviews: Review[] = [];

  @Column('number', { default: 0 })
  @Min(0)
  @Max(5)
  rating: number;

  @Column('number', { default: 0 })
  totalReviews: number;

  @CreateDateColumn('timestamp')
  createdAt: Date;

  @UpdateDateColumn('timestamp')
  updatedAt: Date;
}

@Entity()
class Review {
  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column('timestamp')
  createdAt: Date;
}
