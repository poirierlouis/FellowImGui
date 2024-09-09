import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComboPropertiesComponent} from './combo-properties.component';

xdescribe('ComboPropertiesComponent', () => {
  let component: ComboPropertiesComponent;
  let fixture: ComponentFixture<ComboPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComboPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
