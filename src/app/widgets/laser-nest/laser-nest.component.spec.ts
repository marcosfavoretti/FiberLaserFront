import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaserNestComponent } from './laser-nest.component';

describe('LaserNestComponent', () => {
  let component: LaserNestComponent;
  let fixture: ComponentFixture<LaserNestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaserNestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaserNestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
