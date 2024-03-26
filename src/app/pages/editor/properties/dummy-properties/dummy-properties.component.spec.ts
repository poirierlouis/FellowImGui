import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DummyPropertiesComponent} from './dummy-properties.component';

describe('DummyPropertiesComponent', () => {
  let component: DummyPropertiesComponent;
  let fixture: ComponentFixture<DummyPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DummyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
