import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressBarPropertiesComponent} from './progress-bar-properties.component';

describe('ProgressBarPropertiesComponent', () => {
  let component: ProgressBarPropertiesComponent;
  let fixture: ComponentFixture<ProgressBarPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProgressBarPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
