import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { ProjectType } from '../../../common/enums/project-type.enum';
import { UserProject } from '../../users/entities';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
  })
  type: ProjectType;

  @Column()
  logo: string;

  @Column()
  price: number;

  @Column({ unique: true })
  contractAddress: string;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects: UserProject[];
}
