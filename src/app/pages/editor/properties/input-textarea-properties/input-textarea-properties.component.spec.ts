import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputTextareaPropertiesComponent} from './input-textarea-properties.component';

describe('InputTextareaPropertiesComponent', () => {
  let component: InputTextareaPropertiesComponent;
  let fixture: ComponentFixture<InputTextareaPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextareaPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextareaPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
