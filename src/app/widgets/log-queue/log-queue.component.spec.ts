import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogQueueComponent } from './log-queue.component';

describe('LogQueueComponent', () => {
  let component: LogQueueComponent;
  let fixture: ComponentFixture<LogQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
