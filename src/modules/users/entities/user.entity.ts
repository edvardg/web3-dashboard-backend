import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserProject } from './user-project.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ unique: true })
  walletAddress: string;

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  userProjects: UserProject[];
}
