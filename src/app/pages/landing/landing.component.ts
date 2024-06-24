import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {


  AboutMe = ()=>{
    this.router.navigate(['/about'])
  }


  constructor(private config: NgbCarouselConfig, private router:Router) {
		// customize default values of carousels used by this component tree
		config.interval = 2000;
		config.wrap = false;
		config.keyboard = false;
		config.pauseOnHover = false;
  }
}
