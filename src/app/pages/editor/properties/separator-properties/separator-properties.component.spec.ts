import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SeparatorPropertiesComponent} from './separator-properties.component';

describe('SeparatorPropertiesComponent', () => {
  let component: SeparatorPropertiesComponent;
  let fixture: ComponentFixture<SeparatorPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparatorPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SeparatorPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
