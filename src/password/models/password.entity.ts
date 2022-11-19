import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('reset_password')
export class PasswordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({unique: true})
    token: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

}