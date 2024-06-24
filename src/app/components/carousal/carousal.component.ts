import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousal',
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.scss']
})
export class CarousalComponent {
	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.interval = 2000;
		config.wrap = false;
		config.keyboard = false;
		config.pauseOnHover = false;
  }
}
