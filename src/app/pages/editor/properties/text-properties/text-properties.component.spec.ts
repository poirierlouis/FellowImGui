import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPropertiesComponent } from './text-properties.component';

describe('TextSettingsComponent', () => {
  let component: TextPropertiesComponent;
  let fixture: ComponentFixture<TextPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
