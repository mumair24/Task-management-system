import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy (Strategy, 'firebase-auth',
) {
  constructor(
    @Inject('FIREBASE')
    private readonly firebase: admin.app.App,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    const firebaseUser: any = await this.firebase.auth().verifyIdToken(token, true).catch((err) => {
        console.error(err);
        throw new UnauthorizedException(err.message);
    });
    if(!firebaseUser) {
        throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}
