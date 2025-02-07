import { Controller, Post, Get, Delete, Param, Body, Req, HttpCode, HttpStatus, UseGuards, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { ETask } from "./entities/task.entity";
import { CreateTaskDto } from "./dtos/task.dto";
import { ValidAuthGuard } from "src/middleware/auth/guard/valid.guard";

@ApiTags("Tasks")
@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: "Create a new task" })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: "Task created successfully", type: ETask })
  async createTask(@Req() req: any, @Body() createTaskDto: CreateTaskDto): Promise<ETask> {
    return this.taskService.createTask(req.user, createTaskDto);
  }

  @Get()
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({ status: 200, description: "List of tasks", type: [ETask] })
  async getAllTasks(@Req() req: any): Promise<{data: ETask[], total: number}> {
    return this.taskService.getAllTasks(req.user);
  }

  @Get(":id")
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: "Get task by ID" })
  @ApiResponse({ status: 200, description: "Task found", type: ETask })
  @ApiResponse({ status: 404, description: "Task not found" })
  async getTaskById(@Req() req: any, @Param("id") id: string): Promise<ETask> {
    return this.taskService.getTaskById(req.user, id);
  }

  @Patch(":id")
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: "Update task details" })
  @ApiResponse({ status: 200, description: "Task updated successfully", type: ETask })
  @ApiResponse({ status: 404, description: "Task not found" })
  async updateTask(@Req() req: any, @Param("id") id: string, @Body() updateTaskDto: CreateTaskDto): Promise<ETask> {
    return this.taskService.updateTask(req.user, id, updateTaskDto);
  }

  @Delete(":id")
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: "Delete a task" })
  @ApiResponse({ status: 204, description: "Task deleted successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async deleteTask(@Req() req: any, @Param("id") id: string): Promise<void> {
    return this.taskService.deleteTask(req.user, id);
  }
}
