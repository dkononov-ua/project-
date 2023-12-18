// auth-google.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private afAuth: AngularFireAuth) { }

  signInWithGoogle() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  // Add other authentication methods as needed
}
