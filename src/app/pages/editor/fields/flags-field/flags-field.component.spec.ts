import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagsFieldComponent } from './flags-field.component';

describe('FlagsFieldComponent', () => {
  let component: FlagsFieldComponent;
  let fixture: ComponentFixture<FlagsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagsFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlagsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
