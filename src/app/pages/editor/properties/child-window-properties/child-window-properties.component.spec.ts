import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChildWindowPropertiesComponent} from './child-window-properties.component';

xdescribe('ChildWindowPropertiesComponent', () => {
  let component: ChildWindowPropertiesComponent;
  let fixture: ComponentFixture<ChildWindowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildWindowPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChildWindowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
