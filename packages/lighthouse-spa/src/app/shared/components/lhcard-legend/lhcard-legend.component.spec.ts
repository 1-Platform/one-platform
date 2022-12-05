import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LHCardLegendComponent } from './lhcard-legend.component';

describe('LHCardLegendComponent', () => {
  let component: LHCardLegendComponent;
  let fixture: ComponentFixture<LHCardLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LHCardLegendComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LHCardLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
