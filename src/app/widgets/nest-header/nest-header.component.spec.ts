import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestHeaderComponent } from './nest-header.component';

describe('NestHeaderComponent', () => {
  let component: NestHeaderComponent;
  let fixture: ComponentFixture<NestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
