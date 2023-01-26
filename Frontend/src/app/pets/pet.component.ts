import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-pets',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss']
})
export class PetComponent {

  constructor(public http: HttpService) {}
  hide = true;
  Pets: any[] = [];
//used propertys for adding pets
  petId: number = 0;
  petName: string = "";
  petPrice: number = 0;
  petDescription: string = "";
  dogBreeds: string = "";
  address: string = "";
  zipcode:number = 0;
  city: string = "";
  email: string = "";
  image: string = "";
// used propertys for updateing pets
  petUpdateName: string = "";
  petUpdatePrice: number = 0;
  petUpdateDescription: string = ""
  dogUpdateBreeds: string = "";
  Updateaddress: string = "";
  Updatezipcode:number = 0;
  Updatecity: string = "";
  Updateemail: string = "";
  Updateimage: string = "";

  toggleExpand(product: any) {
    product.expanded = !product.expanded;
  }

  //startUpdatePet with update property's used in pet html line 162
  startUpdatePet(pet: any){
    this.petId = pet.id;
    this.petUpdateName = pet.name;
    this.petUpdatePrice = pet.price;
    this.Updateimage = pet.image;
    this.dogUpdateBreeds = pet.dogBreeds;
    this.Updateaddress = pet.address;
    this.Updateemail = pet.email;
    this.Updatezipcode = pet.zipcode;
    this.petUpdateDescription = pet.description;
    this.Updatecity = pet.city;
  }

}

