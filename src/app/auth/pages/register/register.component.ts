import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    email: [ '', [ Validators.required ] ],
    password: [ '', [ Validators.required, Validators.minLength(6) ] ],
    fullName: [ '', [ Validators.required, Validators.minLength(15) ] ]
  });


  onSubmitRegister() {
    const { email = '', password = '', fullName = '' } = this.registerForm.value;

    this.authService.registerUser(email!, password!, fullName!).subscribe(res => {
      if( res ) this.router.navigateByUrl('/');
    })
  }

}
