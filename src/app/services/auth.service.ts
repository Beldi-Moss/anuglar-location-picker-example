import { Injectable } from '@angular/core';
import {first, map} from 'rxjs/internal/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fAuth: AngularFireAuth) { }

  isAuthenticated() {
    return this.fAuth.authState.pipe(first()).toPromise();
  }

  login(email: string, password: string) {
   return this.fAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.fAuth.auth.signOut();
  }
}
