import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { User } from '../shared/interfaces/user.interface';
import { AuthService } from '../shared/services/auth.service';
import { filter, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public form!: FormGroup;
  public loading: boolean = false;
  public messageInfo!: string;

  public get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }

  public get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }

  public get error$(): Observable<string> {
    return this.auth.error$;
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter((params: Params) => !!params['loginAgain'] && params['loginAgain'] === 'true')
    ).subscribe(() => {
      this.messageInfo = 'Please login';
    });

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required, Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required, Validators.minLength(6)
      ])
    })
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.loading = true;
    this.auth.login(user).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
    })
  }
}
