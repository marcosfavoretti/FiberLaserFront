import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestPreviewComponent } from './nest-preview.component';

describe('NestPreviewComponent', () => {
  let component: NestPreviewComponent;
  let fixture: ComponentFixture<NestPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
