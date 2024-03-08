import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSettingsComponent } from './widget-settings.component';

describe('WidgetSettingsComponent', () => {
  let component: WidgetSettingsComponent;
  let fixture: ComponentFixture<WidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
