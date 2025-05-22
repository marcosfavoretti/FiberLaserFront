import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptActionButtonComponent } from './script-action-button.component';

describe('ScriptActionButtonComponent', () => {
  let component: ScriptActionButtonComponent;
  let fixture: ComponentFixture<ScriptActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriptActionButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
