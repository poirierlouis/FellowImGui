import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableRowPropertiesComponent} from './table-row-properties.component';

xdescribe('TableRowPropertiesComponent', () => {
  let component: TableRowPropertiesComponent;
  let fixture: ComponentFixture<TableRowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableRowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
