import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogamesComponent } from './videogames.component';

describe('VideogamesComponent', () => {
  let component: VideogamesComponent;
  let fixture: ComponentFixture<VideogamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideogamesComponent]
    });
    fixture = TestBed.createComponent(VideogamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
