import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatesQueueComponent } from './plates-queue.component';

describe('PlatesQueueComponent', () => {
  let component: PlatesQueueComponent;
  let fixture: ComponentFixture<PlatesQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatesQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatesQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
