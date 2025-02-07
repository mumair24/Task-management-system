import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';
import { FirebaseAuthStrategy } from './auth/firebase-auth.strategy';

const firebaseProvider = {
    provide: 'FIREBASE',
      useFactory: (configService: ConfigService) => {
        const firebaseConfig = {
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        };

        return admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });
      },
      inject: [ConfigService],
}

@Module({
  imports: [ConfigModule],
  providers: [
    firebaseProvider,
    FirebaseService,
    FirebaseAuthStrategy
  ],
  exports: ['FIREBASE', FirebaseService],
})
export class FirebaseModule {}
