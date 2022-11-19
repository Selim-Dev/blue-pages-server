import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('privacy-policy')
export class PrivacyPolicy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    page: string

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column()
    content: string;

    
}