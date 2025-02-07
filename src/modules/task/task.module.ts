import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ETask } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { EUser } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ETask, 
      EUser
    ])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
