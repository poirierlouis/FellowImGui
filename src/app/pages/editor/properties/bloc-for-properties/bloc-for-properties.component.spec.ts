import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BlocForPropertiesComponent} from './bloc-for-properties.component';

describe('BlocForPropertiesComponent', () => {
  let component: BlocForPropertiesComponent;
  let fixture: ComponentFixture<BlocForPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocForPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlocForPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
