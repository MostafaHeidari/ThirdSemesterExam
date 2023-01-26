import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Creating token variable
    let token = localStorage.getItem('token');
    if(token) {
      let decodedToken = jwtDecode(token) as Token; //jwtDecode betyder maskinen læser token
      let currentDate = new Date();
      if(decodedToken.exp) {
        //when the token will expire
        let expiry = new Date(decodedToken.exp*1000);//token expires after 7 days, in backend authication service
        if(currentDate<expiry && decodedToken.role=='Admin') {
          return true;
        }
      }
    }
    this.router.navigate(['login']) //router is created at line 11
    return false;
  }
}

//token propertys and used in this file on line 17
class Token {
  exp?: number;
  role?: string;
}
