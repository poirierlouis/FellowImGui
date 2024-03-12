import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RadioPropertiesComponent} from './radio-properties.component';

describe('RadioPropertiesComponent', () => {
  let component: RadioPropertiesComponent;
  let fixture: ComponentFixture<RadioPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RadioPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
