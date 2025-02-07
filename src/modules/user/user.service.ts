import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EUser } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { NodemailerService } from 'src/utils/nodemailer/nodemailer.service';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EUser)
    private readonly repository: Repository<EUser>,
    private firebaseService: FirebaseService,
    private nodemailerService: NodemailerService,
  ) {}

  async createUser(user: UserDto, req_user: any): Promise<EUser> {
    try {
      if (req_user.role === 'admin') {
        const userRecord = await this.firebaseService.createUser(user);

        const resetEmailLink =
          await this.firebaseService.generatePasswordResetLink(user.email);

        await this.firebaseService.setUserClaims(userRecord.uid, user.role);

        const savedUser = this.repository.create({
          uid: userRecord.uid,
          displayName: user.displayName,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          dob: user.dob,
          displayPicture: user.displayPicture,
          phoneNumber: user.phoneNumber,
        });

        const userData = await this.repository.save(savedUser);

        await this.nodemailerService.sendResetPasswordEmail(
          user.email,
          resetEmailLink,
        );

        return userData;
      } else {
        throw new Error('Not Allowed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers(
    req_user: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: EUser[]; total: number; page: number; limit: number }> {
    try {
      if (req_user.role !== 'admin') {
        throw new ForbiddenException('Not allowed to get all users');
      }

      const [users, total] = await this.repository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'DESC' },
      });

      return { data: users, total, page, limit };
    } catch (error) {
      console.error('Error fetching users:', error);

      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching users',
      );
    }
  }

  async getUserById(req_user: any, id: string): Promise<EUser> {
    try {
      if (!id) {
        throw new BadRequestException('Invalid user ID');
      }

      if (req_user.role !== 'admin' && req_user.id !== id) {
        throw new ForbiddenException('Not allowed to get user');
      }

      const user = await this.repository.findOne({ where: { id: id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user!;
    } catch (error) {
      console.error('Error fetching user:', error);

      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching the user',
      );
    }

  }

  async updateUser(
    id: string,
    userDto: UserDto,
    req_user: any,
  ): Promise<EUser> {
    try {
      if (!id || !userDto) {
        throw new BadRequestException('Invalid user ID or update data');
      }

      if (req_user.role !== 'admin') {
        throw new ForbiddenException('Not allowed to update user');
      }

      const existingUser = await this.repository.findOne({ where: { id } });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.repository.update(id, { ...userDto });

      const updatedUser = await this.repository.findOne({ where: { id } });
      return updatedUser!;
    } catch (error) {
      console.error('Error updating user:', error);

      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the user',
      );
    }
  }

  async deleteUser(id: string, req_user: any): Promise<DeleteResult> {
    try {
      if (req_user.role !== 'admin') {
        throw new ForbiddenException('Not allowed to delete user');
      }

      const user = await this.repository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.firebaseService.deleteUser(user.uid);

      return await this.repository.delete({ id });
    } catch (error) {
      console.error('Error deleting user:', error);

      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while deleting the user',
      );
    }
  }
}
