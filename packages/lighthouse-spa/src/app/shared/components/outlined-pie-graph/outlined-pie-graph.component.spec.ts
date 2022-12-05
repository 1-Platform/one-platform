import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { OutlinedPieGraphComponent } from './outlined-pie-graph.component';

describe('OutlinedPieGraphComponent', () => {
  let component: OutlinedPieGraphComponent;
  let fixture: ComponentFixture<OutlinedPieGraphComponent>;
  const mockName = 'pwa';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [OutlinedPieGraphComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlinedPieGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default score', () => {
    expect(component.score).toBe(0);
  });

  it('should have name', fakeAsync(() => {
    component.name = mockName;
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(mockName);
  }));

  it('should show red on score below 49', fakeAsync(() => {
    component.score = 40;
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const graph = el.querySelector('.gauge-circle-chart.low .gauge-circle');
    expect(graph).toBeTruthy();
  }));

  it('should show red on score below 90', fakeAsync(() => {
    component.score = 60;
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const graph = el.querySelector('.gauge-circle-chart.average .gauge-circle');
    expect(graph).toBeTruthy();
  }));

  it('should show red on score above 90', fakeAsync(() => {
    component.score = 92;
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const graph = el.querySelector('.gauge-circle-chart.best .gauge-circle');
    expect(graph).toBeTruthy();
  }));
});
