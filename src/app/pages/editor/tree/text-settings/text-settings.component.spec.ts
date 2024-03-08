import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSettingsComponent } from './text-settings.component';

describe('TextSettingsComponent', () => {
  let component: TextSettingsComponent;
  let fixture: ComponentFixture<TextSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
