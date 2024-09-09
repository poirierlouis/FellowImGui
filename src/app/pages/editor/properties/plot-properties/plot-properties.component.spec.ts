import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlotPropertiesComponent} from './plot-properties.component';

xdescribe('PlotLinesPropertiesComponent', () => {
  let component: PlotPropertiesComponent;
  let fixture: ComponentFixture<PlotPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
