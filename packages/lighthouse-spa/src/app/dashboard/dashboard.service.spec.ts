import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { LeaderboardCategory } from 'app/leaderboard/enum';
import {
  ListLHLeaderboard,
  ListLHProjectBranches,
  ListLHProjects,
  ListLHProjectScores,
} from './dashboard.gql';

import { DashboardService } from './dashboard.service';
import {
  mockLeaderboardAPI,
  mockListProjectBranches,
  mockListProjects,
  mockListProjectScores,
} from './mock-dashboard';

describe('DashboardService', () => {
  let service: DashboardService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ApolloTestingModule],
    teardown: { destroyAfterEach: false }
});
    service = TestBed.inject(DashboardService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listLHProjects query', fakeAsync(() => {
    service.listLHProjects().subscribe((project) => {
      const data = project.data;
      expect(data).toEqual(mockListProjects as any);
    });
    flushMicrotasks();
    const op = controller.expectOne(ListLHProjects);
    expect(op.operation.variables.limit).toEqual(10000);

    op.flush({ data: mockListProjects });

    controller.verify();
  }));

  it('listLHProjectBranches query', fakeAsync(() => {
    service
      .listLHProjectBranches('eef123')
      .valueChanges.subscribe((project) => {
        const data = project.data;
        expect(data).toEqual(mockListProjectBranches);
      });
    flushMicrotasks();
    const op = controller.expectOne(ListLHProjectBranches);
    expect(op.operation.variables.projectId).toEqual('eef123');

    op.flush({ data: mockListProjectBranches });

    controller.verify();
  }));

  it('ListLHProjectScores query', fakeAsync(() => {
    service
      .ListLHProjectScores('eef123', 'one-platform')
      .subscribe((project) => {
        const data = project.data;
        expect(data).toEqual(mockListProjectScores as any);
      });
    flushMicrotasks();
    const op = controller.expectOne(ListLHProjectScores);
    expect(op.operation.variables.projectId).toEqual('eef123');
    expect(op.operation.variables.branch).toEqual('one-platform');

    op.flush({ data: mockListProjectScores });

    controller.verify();
  }));

  it('ListLHLeaderboard query', fakeAsync(() => {
    service
      .listLHLeaderboard(LeaderboardCategory.OVERALL, 'main', 'one-platform')
      .subscribe((project) => {
        const data = project.data;
        expect(data).toEqual(mockLeaderboardAPI as any);
      });
    flushMicrotasks();
    const op = controller.expectOne(ListLHLeaderboard);
    expect(op.operation.variables.type).toEqual(LeaderboardCategory.OVERALL);
    expect(op.operation.variables.projectId).toEqual('one-platform');
    expect(op.operation.variables.branch).toEqual('main');

    op.flush({ data: mockLeaderboardAPI });

    controller.verify();
  }));
});
