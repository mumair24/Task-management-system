import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractCreateEntityDto } from 'src/utils/database/create-entity.dto';
import { TaskStatus } from '../utils/task.status';

export class CreateTaskDto extends AbstractCreateEntityDto {
  @ApiProperty({ description: 'Title of the task', example: 'Fix login issue', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Detailed description of the task', example: 'Resolve the bug causing login failure', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Current status of the task', example: 'in_progress', enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status has been selected for Task.' })
  status?: TaskStatus;

  @ApiProperty({ description: 'UUID of the user assigned to this task', example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}
