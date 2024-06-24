import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuValue:boolean=false;
  menu_icon:string ='bi bi-list';

  constructor( private router:Router) {
		
  }



  openMenu(){
    this.menuValue =! this.menuValue ;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
   closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }
  AboutMe = ()=>{
    this.router.navigate(['/about'])
    console.log("hola");
    
  }

  Login = ()=>{
    this.router.navigate(['/login'])
  }

  Games = ()=>{
    this.router.navigate(['/games'])
  }


}
