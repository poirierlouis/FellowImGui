import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuItemPropertiesComponent} from './menu-item-properties.component';

describe('MenuItemPropertiesComponent', () => {
  let component: MenuItemPropertiesComponent;
  let fixture: ComponentFixture<MenuItemPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuItemPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
