import {type ComponentFixture, TestBed} from "@angular/core/testing";

import {Number4FieldComponent} from "./number4-field.component";

describe("MultiIntegerFieldComponent", () => {
  let component: Number4FieldComponent;
  let fixture: ComponentFixture<Number4FieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Number4FieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Number4FieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
