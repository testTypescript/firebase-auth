import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  signup(email: string, password: string): Promise<string> {
    return admin
      .auth()
      .createUser({
        email: email,
        password: password,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        return userRecord.uid;
      })
      .catch((error) => {
        console.log('Error creating new user:', error.message);
        throw error.message;
      });
  }

  sessionLogin(idToken: string) {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    return admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedClaims) => {
        // In this case, we are enforcing that the user signed in in the last 5 minutes.

        if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
          const cookie = await admin
            .auth()
            .createSessionCookie(idToken, { expiresIn: expiresIn });

          const user = await admin.auth().getUser(decodedClaims.sub);

          return { cookie: cookie, user: user };
        } else {
          throw 'UNAUTHORIZED REQUEST';
        }
      });
  }

  verify(sessionCookie: string) {
    return admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */);
  }

  sessionLogout(sessionCookie: string) {
    return admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(function (decodedClaims) {
        return admin.auth().revokeRefreshTokens(decodedClaims.sub);
      });
  }

  editProfile(uid: string, password: string) {
    return admin.auth().updateUser(uid, {
      password: password,
    });
  }
}
