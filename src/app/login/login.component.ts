import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLoading = false;
  errorMessage;
  form: FormGroup;
  error = false;
  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  async submit() {
    this.showLoading = true;
    let user;
    try {
      await this.authService.login(this.form.value.email.trim(), this.form.value.password.trim());
      user = await this.authService.isAuthenticated();
    } catch (e) {
      this.showLoading = false;
      console.log(e);
      if (e.code === 'auth/wrong-password' ) {
        this.errorMessage = e.message;
      } else if ( e.code === 'auth/user-not-found') {
        this.errorMessage = e.message.split('.')[0];
      } else if ( e.code === 'auth/invalid-email' ) {
        this.errorMessage = e.message;
      }
    }
    if ( user ) {
      this.route.navigateByUrl('/');
    } else {
      this.error = true;
      this.showLoading = false;
    }
  }
}
