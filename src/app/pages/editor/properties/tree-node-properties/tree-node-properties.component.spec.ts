import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TreeNodePropertiesComponent} from './tree-node-properties.component';

xdescribe('TreeNodePropertiesComponent', () => {
  let component: TreeNodePropertiesComponent;
  let fixture: ComponentFixture<TreeNodePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeNodePropertiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TreeNodePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
