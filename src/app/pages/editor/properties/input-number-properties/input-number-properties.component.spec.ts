import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputNumberPropertiesComponent} from './input-number-properties.component';

xdescribe('InputNumberPropertiesComponent', () => {
  let component: InputNumberPropertiesComponent;
  let fixture: ComponentFixture<InputNumberPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumberPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputNumberPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
