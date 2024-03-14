import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputTextPropertiesComponent} from './input-text-properties.component';

describe('InputTextPropertiesComponent', () => {
  let component: InputTextPropertiesComponent;
  let fixture: ComponentFixture<InputTextPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputTextPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
