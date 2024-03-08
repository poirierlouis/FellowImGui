import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowSettingsComponent } from './window-settings.component';

describe('WindowSettingsComponent', () => {
  let component: WindowSettingsComponent;
  let fixture: ComponentFixture<WindowSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WindowSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
