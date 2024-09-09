import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalSliderPropertiesComponent} from './vertical-slider-properties.component';

xdescribe('VerticalSliderPropertiesComponent', () => {
  let component: VerticalSliderPropertiesComponent;
  let fixture: ComponentFixture<VerticalSliderPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalSliderPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalSliderPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
