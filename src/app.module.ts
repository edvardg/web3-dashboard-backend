import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
