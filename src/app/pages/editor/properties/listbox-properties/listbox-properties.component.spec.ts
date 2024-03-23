import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListboxPropertiesComponent} from './listbox-properties.component';

describe('ListboxPropertiesComponent', () => {
  let component: ListboxPropertiesComponent;
  let fixture: ComponentFixture<ListboxPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListboxPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListboxPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
