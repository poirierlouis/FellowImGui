import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuPropertiesComponent} from './menu-properties.component';

describe('MenuPropertiesComponent', () => {
  let component: MenuPropertiesComponent;
  let fixture: ComponentFixture<MenuPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
