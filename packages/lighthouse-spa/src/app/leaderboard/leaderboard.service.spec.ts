import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { LeaderboardCategory } from './enum';
import { ListLHLeaderboard } from './leaderboard.gql';

import { LeaderboardService } from './leaderboard.service';
import { mockLeaderboardData } from './mock-leaderboard';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ApolloTestingModule],
    teardown: { destroyAfterEach: false }
});
    service = TestBed.inject(LeaderboardService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expect and answer', fakeAsync(() => {
    service
      .listLHLeaderboard(LeaderboardCategory.ACCESSIBILITY)
      .subscribe((leaderboard) => {
        const data = leaderboard.data.listLHLeaderboard;
        expect(data.count).toEqual(1);
      });
    flushMicrotasks();
    const op = controller.expectOne(ListLHLeaderboard);
    expect(op.operation.variables.type).toEqual(
      LeaderboardCategory.ACCESSIBILITY
    );

    op.flush({ data: { listLHLeaderboard: mockLeaderboardData } });

    controller.verify();
  }));
});
