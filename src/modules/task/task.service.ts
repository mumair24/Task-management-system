import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ETask } from './entities/task.entity';
import { EUser } from '../user/entities/user.entity';
import { CreateTaskDto } from './dtos/task.dto';
import { UserRole } from '../user/utils/user.roles';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(ETask) private readonly taskRepository: Repository<ETask>,
    @InjectRepository(EUser) private readonly userRepository: Repository<EUser>,
  ) {}

  async createTask(req_user: any, dto: CreateTaskDto): Promise<ETask> {
    try {
      if (req_user.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'You do not have permission to create tasks.',
        );
      }

      const user = await this.userRepository.findOne({
        where: {
          uid: dto.assignedTo,
        },
      });

      const _task = new ETask({
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assignedTo: user,
      });
      const task = await this.taskRepository.save(_task);

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the task',
      );
    }
  }

  async getAllTasks(
    req_user: any,
    page: number = 1,
    limit: number = 10
): Promise<{ data: ETask[]; total: number }> {
    try {
        const skip = (page - 1) * limit;
        const whereCondition =
            req_user.role === UserRole.ADMIN ? {} : { assignedTo: { id: req_user.id } };

        const [data, total] = await this.taskRepository.findAndCount({
            where: whereCondition,
            relations: ['assignedTo'],
            skip,
            take: limit,
        });

        return { data, total };
    } catch (error) {
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
}


  async getTaskById(req_user: any, id: string): Promise<ETask> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: id },
        relations: ['assignedTo'],
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (
        req_user.role !== UserRole.ADMIN &&
        task.assignedTo.id !== req_user.uid
      ) {
        throw new ForbiddenException(
          'You are not authorized to view this task.',
        );
      }

      return task;
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }
  }

  async updateTask(
    req_user: any,
    id: string,
    dto: CreateTaskDto,
  ): Promise<ETask> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['assignedTo'],
      });

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      if (
        req_user.role !== UserRole.ADMIN &&
        task.assignedTo.id !== req_user.uid
      ) {
        throw new ForbiddenException(
          'You are not authorized to update this task.',
        );
      }
      task.title = dto.title ?? task.title;
      task.description = dto.description ?? task.description;
      task.status = dto.status ?? task.status;
      if (dto.assignedTo) {
        task.assignedTo = await this.userRepository.findOne({ where: { uid: dto.assignedTo } });
      }
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  async deleteTask(req_user: any, id: string): Promise<void> {
    try {
      if (req_user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only admins can delete tasks.');
      }

      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      await this.taskRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}
