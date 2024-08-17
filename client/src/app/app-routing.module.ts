import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './Components/contact-list/contact-list.component';
import { ContactDetailsComponent } from './Components/contact-details/contact-details.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './Components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: ContactListComponent },
  {
    path: 'contacts',
    component: ContactListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'contacts/new',
    component: ContactDetailsComponent,
    data: { isNewContact: true },
  },
  { path: 'contacts/:id', component: ContactDetailsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
