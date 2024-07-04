import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from './user.entity';

@Entity()
@Index(['user', 'project'], { unique: true })
export class UserProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookmarked: boolean;

  @ManyToOne(() => User, (user: User) => user.userProjects)
  @Index()
  user: User;

  @ManyToOne(() => Project, (project: Project) => project.userProjects)
  project: Project;
}
