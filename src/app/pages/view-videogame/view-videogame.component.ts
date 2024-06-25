import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-view-videogame',
  templateUrl: './view-videogame.component.html',
  styleUrls: ['./view-videogame.component.scss'],
})
export class ViewVideogameComponent implements OnInit {
  game: any = {};
  id: string = '';
  trailerUrl: SafeResourceUrl = '';

  constructor(
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.service.getGamesById(this.id).subscribe(
      (res) => {
        console.log(res);
        this.game = res;
        if (this.game.trailer) {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.game.trailer);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


}
