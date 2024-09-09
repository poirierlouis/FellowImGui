import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReadmeComponent} from './readme.component';

xdescribe('ReadmeComponent', () => {
  let component: ReadmeComponent;
  let fixture: ComponentFixture<ReadmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadmeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
