import { Component } from '@angular/core';
import {HttpService} from "../../services/http.service";


@Component({
  selector: 'app-login'+ 'ngbd-dropdown-basic',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  email: any; //email is used in login.html line 6
  password: any;


//should not be here
  htmlSnippet: string = "<script>alert(\"attempt to hack\")</script><b>other html tag</b>";

  constructor(public http: HttpService) { }
}


