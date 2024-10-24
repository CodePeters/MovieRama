import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitMovieComponent } from './submit-movie.component';

describe('SubmitMovieComponent', () => {
  let component: SubmitMovieComponent;
  let fixture: ComponentFixture<SubmitMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
