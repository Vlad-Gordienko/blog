import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { AuthService } from './shared/services/auth.service';
import { SharedModule } from '../shared/modules/shared.module';
import { AuthGuard } from './shared/services/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: AdminLayoutComponent, children: [
          {path: '', redirectTo: 'login', pathMatch: 'full'},
          {path: 'login', component: LoginPageComponent},
          {path: 'create', component: CreatePageComponent, canActivate: [AuthGuard]},
          {path: 'post-card/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]},
          {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    CreatePageComponent,
    EditPageComponent,
    DashboardPageComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ]
})
export class AdminModule {

}
