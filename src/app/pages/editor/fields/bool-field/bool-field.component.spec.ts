import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoolFieldComponent } from './bool-field.component';

describe('BoolFieldComponent', () => {
  let component: BoolFieldComponent;
  let fixture: ComponentFixture<BoolFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoolFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoolFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
