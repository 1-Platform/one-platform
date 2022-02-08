import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from 'app/dashboard/dashboard.service';
import {
  mockLeaderboardAPI,
  mockListProjectBranches,
  mockListProjectScores,
} from 'app/dashboard/mock-dashboard';
import { TimelineScoreFormaterPipe } from 'app/dashboard/pipes/timeline-score-formater.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { of } from 'rxjs';

import { AnalysisComponent } from './analysis.component';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;
  let service: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent, TimelineScoreFormaterPipe],
      imports: [
        CommonModule,
        RouterTestingModule,
        SharedModule,
        NgxChartsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              name: 'one-platform',
            }),
            params: of({
              id: '1',
            }),
          },
        },
        TitleCasePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DashboardService);
    fixture.detectChanges();
    spyOn(service, 'listLHProjectBranches').and.returnValue({
      valueChanges: of({ data: mockListProjectBranches, loading: false }),
    });
    spyOn(service, 'ListLHProjectScores').and.returnValue(
      of({ data: mockListProjectScores, loading: false })
    );
    spyOn(service, 'listLHLeaderboard').and.returnValue(
      of({ data: mockLeaderboardAPI, loading: false })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the services on mount', () => {
    component.ngOnInit();
    expect(service.listLHProjectBranches).toHaveBeenCalled();
    expect(service.ListLHProjectScores).toHaveBeenCalled();
  });

  it('should set title and scores on mount', () => {
    component.ngOnInit();
    expect(component.title).toEqual('one-platform');
    expect(component.buildScores['one-platform']).toEqual(
      mockListProjectScores.listLHProjectBuilds as any
    );
  });

  it('should sort branches with main and master first', () => {
    const branchesWithMain = [{ branch: 'one-platform' }, { branch: 'main' }];
    const branchesWithoutMain = [
      { branch: 'one-platform' },
      { branch: 'one-platform-2' },
    ];
    expect(component.handlePriorityOrderBranch(branchesWithMain)[0]).toEqual(
      'main'
    );
    expect(component.handlePriorityOrderBranch(branchesWithoutMain)[0]).toEqual(
      'one-platform'
    );
  });

  it('should be able to change branch', fakeAsync(() => {
    component.onToggleBranchSelector(true);
    component.onBranchSelect('one-platform');
    tick();
    fixture.detectChanges();
    expect(component.selectedBranch).toEqual('one-platform');
    expect(component.isBranchContextSelectorOpen).toBeFalsy();
    expect(component.buildScores['one-platform']).toEqual(
      mockListProjectScores.listLHProjectBuilds as any
    );
  }));

  it('should show loading state', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading...');
  });

  it('should show empty state', fakeAsync(() => {
    component.ngOnInit();
    const el: HTMLElement = fixture.nativeElement;
    component.branches = [];
    tick();
    fixture.detectChanges();
    expect(el.textContent).not.toContain('Loading...');
    expect(el.textContent).toContain('No branch found');
  }));
});
