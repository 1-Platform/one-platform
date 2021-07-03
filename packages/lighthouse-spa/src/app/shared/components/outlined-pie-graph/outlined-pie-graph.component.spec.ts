import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlinedPieGraphComponent } from './outlined-pie-graph.component';

describe('OutlinedPieGraphComponent', () => {
  let component: OutlinedPieGraphComponent;
  let fixture: ComponentFixture<OutlinedPieGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutlinedPieGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlinedPieGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
