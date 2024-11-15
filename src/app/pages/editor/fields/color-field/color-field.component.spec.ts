import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFieldComponent } from './color-field.component';

describe('ColorFieldComponent', () => {
  let component: ColorFieldComponent;
  let fixture: ComponentFixture<ColorFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
