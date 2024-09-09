import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WindowPropertiesComponent} from './window-properties.component';

xdescribe('WindowSettingsComponent', () => {
  let component: WindowPropertiesComponent;
  let fixture: ComponentFixture<WindowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
