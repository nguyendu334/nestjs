import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../constants/role.constants';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn('timestamp')
  createdAt: Date;

  @UpdateDateColumn('timestamp')
  updatedAt: Date;

  @BeforeInsert()
  private hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}
