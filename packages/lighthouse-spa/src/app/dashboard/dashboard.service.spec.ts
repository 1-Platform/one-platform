import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import {
  ListLHProjectBranches,
  ListLHProjects,
  ListLHProjectScores,
} from './dashboard.gql';

import { DashboardService } from './dashboard.service';
import {
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
    service.listLHProjects().valueChanges.subscribe((project) => {
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
      .valueChanges.subscribe((project) => {
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
});
