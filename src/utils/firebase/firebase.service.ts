import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE')
    private readonly firebaseApp: admin.app.App,
  ) {}

  async createUser(user: {
    email: string;
    displayName: string;
    displayPicture?: string;
    role: string;
  }): Promise<admin.auth.UserRecord> {
    try {
      let existingUser: admin.auth.UserRecord | null = null;
      try {
        existingUser = await this.firebaseApp.auth().getUserByEmail(user.email);
      } catch (error) {
        if (error.code !== 'auth/user-not-found') {
          console.error('Error checking user existence:', error);
          throw new InternalServerErrorException(
            'Failed to verify user existence',
          );
        }
      }

      if (existingUser) {
        throw new ConflictException(
          `User with email ${user.email} already exists`,
        );
      }

      const newUser = {
        email: user.email,
        emailVerified: false,
        displayName: user.displayName,
        disabled: false,
        ...(user.displayPicture && { photoURL: user.displayPicture }),
      };

      const userRecord = await this.firebaseApp.auth().createUser(newUser);

      await this.setUserClaims(userRecord.uid, user.role);

      return userRecord;
    } catch (error) {
      console.error('Error creating user in Firebase:', error);

      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async setUserClaims(
    uid: string,
    role: string,
  ): Promise<{ uid: string; role: string }> {
    try {
      await this.firebaseApp.auth().setCustomUserClaims(uid, { role });
      return { uid, role };
    } catch (error) {
      console.error(`Error setting custom claims for user ${uid}:`, error);
      throw new Error(`Failed to set custom claims: ${error.message}`);
    }
  }

  async generatePasswordResetLink(email: string) {
    const link: string = await this.firebaseApp
      .auth()
      .generatePasswordResetLink(email);
    return link;
  }

  async deleteUser(userID: string): Promise<void> {
    try {
      await this.firebaseApp.auth().deleteUser(userID);
      console.log(`Successfully deleted user with ID: ${userID}`);
    } catch (error) {
      console.error('Error deleting user in firebase:', error);
      throw error;
    }
  }
}
