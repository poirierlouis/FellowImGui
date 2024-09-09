import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CollapsingHeaderPropertiesComponent} from './collapsing-header-properties.component';

xdescribe('CollapsingHeaderPropertiesComponent', () => {
  let component: CollapsingHeaderPropertiesComponent;
  let fixture: ComponentFixture<CollapsingHeaderPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsingHeaderPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CollapsingHeaderPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
