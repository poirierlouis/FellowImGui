import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SameLinePropertiesComponent} from './same-line-properties.component';

xdescribe('SameLinePropertiesComponent', () => {
  let component: SameLinePropertiesComponent;
  let fixture: ComponentFixture<SameLinePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SameLinePropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SameLinePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
