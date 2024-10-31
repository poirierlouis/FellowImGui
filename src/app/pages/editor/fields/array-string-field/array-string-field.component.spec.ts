import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayStringFieldComponent } from './array-string-field.component';

describe('ArrayStringFieldComponent', () => {
  let component: ArrayStringFieldComponent;
  let fixture: ComponentFixture<ArrayStringFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrayStringFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrayStringFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
