import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabItemPropertiesComponent} from './tab-item-properties.component';

xdescribe('TabItemPropertiesComponent', () => {
  let component: TabItemPropertiesComponent;
  let fixture: ComponentFixture<TabItemPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabItemPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabItemPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
