import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideogameComponent } from './view-videogame.component';

describe('ViewVideogameComponent', () => {
  let component: ViewVideogameComponent;
  let fixture: ComponentFixture<ViewVideogameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewVideogameComponent]
    });
    fixture = TestBed.createComponent(ViewVideogameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
