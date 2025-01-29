import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCanvaComponent } from './status-canva.component';

describe('StatusCanvaComponent', () => {
  let component: StatusCanvaComponent;
  let fixture: ComponentFixture<StatusCanvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCanvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCanvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
