import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPlayerComponent } from './stream-player.component';

describe('StreamPlayerComponent', () => {
  let component: StreamPlayerComponent;
  let fixture: ComponentFixture<StreamPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
