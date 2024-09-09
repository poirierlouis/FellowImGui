import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputColorEditPropertiesComponent} from './input-color-edit-properties.component';

xdescribe('InputColorEditPropertiesComponent', () => {
  let component: InputColorEditPropertiesComponent;
  let fixture: ComponentFixture<InputColorEditPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputColorEditPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputColorEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
