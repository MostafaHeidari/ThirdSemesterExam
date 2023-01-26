import {Injectable, OnInit} from '@angular/core';
import axios from 'axios';
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError} from "rxjs";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import jwtDecode from "jwt-decode";

// customAxios is made as customize variable for http request
export const customAxios = axios.create({
  baseURL: 'http://localhost:5001'
})

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  pets: Pets[] = []; //is used in html pets line 71
  userName: any; //is used in app html line 46


  constructor(private matSnackbar: MatSnackBar,
              private router: Router) {
    customAxios.interceptors.response.use( //Hvis man adder pet står der Successful
      response => {
        if (response.status == 201) {
          this.matSnackbar.open("Successful", undefined, {duration: 2000})
        }
        return response;
      }, rejected => { //Hvis man adder pet og det er fejl står der Something went wrong
        if (rejected.response.status >= 400 && rejected.response.status < 500) {
          matSnackbar.open(rejected.response.data);
        } else if (rejected.response.status > 499) {
          this.matSnackbar.open("Something went wrong", "error", {duration: 3000})
        }
        catchError(rejected);
      }
    );
    customAxios.interceptors.request.use(
      async config => {
        if (localStorage.getItem('token')) { //returner token i local storage
          config.headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`//det her bliver tretuneret
          }
        }

        return config;
      },
      error => { //hvis forkert token kommer der fejl
        Promise.reject(error)
      });
  }


  getPets() {//getPets method is created
    customAxios.get<Pets[]>('Pets').then(success => {
      console.log(success);
      this.pets = success.data;
    }).catch(e => {
      console.log(e);
    })
    console.log('now were are executing this');
  }

  //delete function is used in html pets line 155
  async deletePets(id: any) {
    const httpsResult = await customAxios.delete('Pets/'+id);
    this.pets = this.pets.filter(p => p.id != httpsResult.data.id)
  }

  //updatePets function is used in html pets line 125
  async updatePets(id: number, dto: { Description: string; Email: string; Address: string; price: number; Zipcode: number; City: string; DogBreeds: string; Image: string; Name: string, Id?: number}) {
    dto.Id = id;
    const httpResult = await customAxios.put<Pets>('Pets/'+id, dto);
    this.pets.push(httpResult.data);
  }


  //login function is used in html login line 19
  async login(dto: any) {
    customAxios.post<string>('auth/login', dto).then(successResult => {
      localStorage.setItem('token', successResult.data); //Token gets in local storage
      let t = jwtDecode(successResult.data) as User; // can acees data as user

      this.userName = t.email; //userName is from line 19 in this file

      //router is from line 23 in this file
      this.router.navigate(['./pets'])

      //matSnackbar is from line 22 in this file
      this.matSnackbar.open("Welcome to Webshop. It is simple with a few functionality", undefined, {duration: 3000})
    })
  }

  //addPets function is used in html pet line 19
  async addPets(dto: { Description: string; Email: string; Address: string; price: number; Zipcode: number; City: string; DogBreeds: string; Image: string; Name: string }) {
    const httpResult = await customAxios.post<Pets>('pets', dto);
    this.pets.push(httpResult.data)
  }


  //is used in html login line 24
  async register(param: { role: string; password: any; email: any }) {
    customAxios.post('auth/register', param).then(successResult => {
      localStorage.setItem('token', successResult.data); //Token gets in local storage

      //router is from line 23 in this file
      this.router.navigate(['./pets'])

      //matSnackbar is from line 22 in this file
      this.matSnackbar.open("You have been registered", undefined, {duration: 3000});
    })
  }
}

// Used in pet.html line 73-86
interface Pets {
  id: number,
  name: string,
  price: number,
  description: string,
  dogBreeds: string,
  address: string,
  zipcode:number,
  city: string,
  email: string,
  image: string,
  expanded: boolean
}

interface User {
  email: string //used in this file on line 83
}


@Injectable({providedIn: 'root'})
export class MyResolver implements Resolve<any> {
  constructor(private http: HttpService) {
  }

//resolve is used on line 30 in app modulle. Resolve er den fetcher data uden refresh
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    await this.http.getPets(); //getPets is from line 55 in this file
    return true;
  }
}
