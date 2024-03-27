import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SliderPropertiesComponent} from './slider-properties.component';

describe('SliderPropertiesComponent', () => {
  let component: SliderPropertiesComponent;
  let fixture: ComponentFixture<SliderPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SliderPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
