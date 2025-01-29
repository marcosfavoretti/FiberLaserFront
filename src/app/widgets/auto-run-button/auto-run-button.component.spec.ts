import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRunButtonComponent } from './auto-run-button.component';

describe('AutoRunButtonComponent', () => {
  let component: AutoRunButtonComponent;
  let fixture: ComponentFixture<AutoRunButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoRunButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoRunButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
