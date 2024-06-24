import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { ServiceService } from 'src/app/service/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Expresión regular para validar el formato del email


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: User = {
    email: '',
    password: '',
    role: 'user',
    token:''
  };

  passwordError: string = '';
  emailError: string = '';
  loginError: string = '';
  sucessfulLogin:string='';
  showCountDown:any= '';
  showPassword: boolean = false;

  constructor(
    private service: ServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;
    if (!passwordPattern.test(password)) {
      this.passwordError = 'Password must be 8-12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*_=+-).';
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

  CountDown(minute:number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let currentSecondtxt: any = "0";

    const timer = setInterval(() => {
      seconds--;
      currentSecondtxt = seconds;
      this.showCountDown = `${currentSecondtxt}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.router.navigate(['/about']);
      }
    }, 1000);
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {
    if (this.validateEmail(this.user.email)) {
      console.log("Email correcto");      
      if ( this.validatePassword(this.user.password)) {
        console.log("Contraseña correcta");
        this.service.login(this.user).subscribe(
          (res) => {
            console.log(res);
            this.loginError = ''
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.user.role);
            localStorage.setItem('role', res.user.username);
            this.sucessfulLogin = `Login succesfull, you will be redirected in`
            this.CountDown(0.2)
            //this.router.navigate(['/lista']);
          },
          (err) => {
            console.error('Hubo un error durante el inicio de sesión', err);
              this.sucessfulLogin = ''
            this.loginError = err.error.message
          }
        );
      } else {
        console.log("Invalid password");
      }
    } else{
      console.log("Invalid email");
    }
  }
}

// Getter para acceder fácilmente a los controles del formulario en el template
