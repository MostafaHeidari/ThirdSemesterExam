import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import { LoginComponent } from './login/login.component';
 import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {AuthguardService} from "../services/authguard.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MyResolver} from "../services/http.service";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { ContactComponent } from './contact/contact.component';
import { AboutOsComponent } from './about-os/about-os.component';
import {PetComponent} from "./pets/pet.component";


const routes: Routes = [
  {
    path: 'pets', component: PetComponent, canActivate: [AuthguardService], resolve: [MyResolver] //using resolve
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'about-os', component: AboutOsComponent
  },
  {
    path: 'contact', component: ContactComponent
  },
  {
    path: '**', redirectTo: 'login'
  }

]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PetComponent,
     ContactComponent,
    AboutOsComponent,

   ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [MatSnackBar, Overlay],
  bootstrap: [AppComponent]
})
export class AppModule { }
