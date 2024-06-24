import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    cpassword: '',
    role: 'user',
  };

  constructor(private service: ServiceService, private router: Router) {}

  passwordError: string = '';
  emailError: string = '';
  succesfulRegistry: string = '';
  existingUser: string = '';
  showPassword: boolean = false;

  validatePassword(password: string, cpassword: string): boolean {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;
    if (cpassword === password) {
      if (!passwordPattern.test(password)) {
        this.passwordError =
          'Password must be 8-12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*_=+-).';
        return false;
      }
    } else {
      this.passwordError = 'Las contraseñas no coinciden';
      return false;
    }

    this.passwordError = '';
    return true;
  }

  validateEmail(email: string): boolean {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!EMAIL_REGEX.test(email)) {
      this.emailError = 'Porfavor introduzca un correo válido';
      return false;
    }
    this.emailError = '';
    return true;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.validateEmail(this.user.email)) {
      if (this.validatePassword(this.user.password, this.user.cpassword)) {
        this.service.register(this.user).subscribe(
          (response) => {
            console.log('User registered successfully', response);
            this.succesfulRegistry =
              'User registration succesfull, please continue to login';
            // this.router.navigate(['/login'])
          },
          (error) => {
            console.error('There was an error during the registration', error);
            this.existingUser = error.error.message;
          }
        );
      } else {
        console.log('Password validation failed');
      }
    } else {
      console.log('Email validation failed');
    }
  }
}
