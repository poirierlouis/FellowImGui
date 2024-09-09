import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CheckboxPropertiesComponent} from "./checkbox-properties.component";

xdescribe('CheckboxPropertiesComponent', () => {
  let component: CheckboxPropertiesComponent;
  let fixture: ComponentFixture<CheckboxPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CheckboxPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
