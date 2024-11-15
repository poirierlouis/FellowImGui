import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeFieldComponent } from './size-field.component';

describe('SizeFieldComponent', () => {
  let component: SizeFieldComponent;
  let fixture: ComponentFixture<SizeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
