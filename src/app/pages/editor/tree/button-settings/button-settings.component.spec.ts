import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSettingsComponent } from './button-settings.component';

describe('ButtonSettingsComponent', () => {
  let component: ButtonSettingsComponent;
  let fixture: ComponentFixture<ButtonSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
