import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalPropertiesComponent} from './modal-properties.component';

describe('ModalPropertiesComponent', () => {
  let component: ModalPropertiesComponent;
  let fixture: ComponentFixture<ModalPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
