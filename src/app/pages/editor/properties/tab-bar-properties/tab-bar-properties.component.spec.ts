import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabBarPropertiesComponent} from './tab-bar-properties.component';

describe('TabBarPropertiesComponent', () => {
  let component: TabBarPropertiesComponent;
  let fixture: ComponentFixture<TabBarPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabBarPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TabBarPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
