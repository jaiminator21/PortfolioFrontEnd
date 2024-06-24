import { Component, OnInit } from '@angular/core';
import { Games } from 'src/app/models/games.model';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrls: ['./videogames.component.scss']
})
export class VideogamesComponent {
  gamesList: Games[] =[];

  constructor(private service: ServiceService){}



  ngOnInit() {
    this.service.getGames().subscribe((res: any) => {
      console.log(res);
    });
  }

}
