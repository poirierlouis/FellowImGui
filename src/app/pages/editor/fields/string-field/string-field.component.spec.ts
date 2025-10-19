import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringFieldComponent } from './string-field.component';

describe('StringFieldComponent', () => {
  let component: StringFieldComponent;
  let fixture: ComponentFixture<StringFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
