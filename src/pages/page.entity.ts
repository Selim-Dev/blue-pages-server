import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;
	
  @Column({ unique: true })
  title_en: string;
  @Column({ unique: true })
  title_ar: string;
  @Column({ unique: true })
  slug: string;

	@Column({type:'text'})
	content: string;

  @Column({ default: true })
  status: boolean;


}
