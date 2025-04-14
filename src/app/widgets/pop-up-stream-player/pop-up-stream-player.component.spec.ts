import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpStreamPlayerComponent } from './pop-up-stream-player.component';

describe('PopUpStreamPlayerComponent', () => {
  let component: PopUpStreamPlayerComponent;
  let fixture: ComponentFixture<PopUpStreamPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpStreamPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpStreamPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
