import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Games } from 'src/app/models/games.model';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrls: ['./videogames.component.scss']
})
export class VideogamesComponent {
  gamesList: Games[] =[];

  constructor(private config: NgbCarouselConfig,private service: ServiceService){
    config.interval = 5000;
		config.wrap = true;
		config.keyboard = false;
		config.pauseOnHover = false;
  }



  ngOnInit() {
    this.service.getGames().subscribe((res: any) => {
      console.log(res);
      this.gamesList = res
    });
  }

}
