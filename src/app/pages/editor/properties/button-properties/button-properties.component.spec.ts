import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonPropertiesComponent} from './button-properties.component';

xdescribe('ButtonSettingsComponent', () => {
  let component: ButtonPropertiesComponent;
  let fixture: ComponentFixture<ButtonPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
