import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectablePropertiesComponent} from './selectable-properties.component';

describe('SelectablePropertiesComponent', () => {
  let component: SelectablePropertiesComponent;
  let fixture: ComponentFixture<SelectablePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectablePropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectablePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
