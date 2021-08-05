import { Injectable } from '@nestjs/common';
import { auth } from '../firebase';

@Injectable()
export class AuthService {
  login(email: string, password: string): Promise<string> {
    const res = auth
      .signInWithEmailAndPassword(email, password)
      .then(() => 'yes')
      .catch(() => 'no');

    return res;
  }

  signup(email: string, password: string): Promise<string> {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => 'yes')
      .catch(() => 'no');
  }

  getUser() {
    return auth.currentUser;
  }

  signOut() {
    return auth.signOut();
  }

  resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  async editPassword(password: string): Promise<string> {
    const user = auth.currentUser;
    return await user
      .updatePassword(password)
      .then(() => 'yes')
      .catch(() => 'no');
  }
}
