import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PopupPropertiesComponent} from './popup-properties.component';

xdescribe('PopupPropertiesComponent', () => {
  let component: PopupPropertiesComponent;
  let fixture: ComponentFixture<PopupPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PopupPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
