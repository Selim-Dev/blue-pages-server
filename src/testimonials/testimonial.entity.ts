import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('testimonial')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  job: string;

  @Column()
  rating: number;

  @Column({ default: true })
  content: string;

  @Column()
  image: string

  @Column()
  image_key: string
}
