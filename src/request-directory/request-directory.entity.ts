import { Directory } from './../directories/directory.entity';
import { User } from "../auth/models/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { City } from "../cities/city.entity";

export enum Status {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected'
}

export enum Type {
  paper = 'paper',
  pdf = 'pdf',
  both = 'both'
}

@Entity('request-directory')
export class RequestDirectory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Status, default: Status.pending })
  status: Status;

  @Column({ type: 'enum', enum: Type })
  type: Status;

  @Column()
  company_name: string;

  @Column()
  email: string;
 

  @Column()
  phone: string;

  @ManyToOne(() => Directory, dir => dir.request_directory, { eager: true,onDelete:'SET NULL'})
  directory: Directory | number;
  @Column({nullable:true})
  directoryId: number;

  @ManyToOne(() => City, city => city.request_directory, { eager: true, cascade: true, orphanedRowAction: 'delete' })
  city: City | number;
  @Column()
  cityId: number;

  @ManyToOne(() => User, req => req.request_directory, { eager: true, cascade: true, orphanedRowAction: 'delete' ,nullable:true})
  user: User | number;
  @Column({nullable:true})
  userId: number;
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",nullable:true })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" ,nullable:true})
  updatedAt: Date;

}
