import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { mockAuditWebsite, mockAuditWebsiteInput, mockAutorun } from './mock-playground';
import { AuditWebsite, Autorun } from './playground.gql';

import { PlaygroundService } from './playground.service';

describe('PlaygroundService', () => {
  let service: PlaygroundService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(PlaygroundService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('AuditWebsite mutation', fakeAsync(() => {
    service
      .auditWebsite(mockAuditWebsiteInput.property)
      .subscribe((auditId) => {
        expect(auditId).toEqual(mockAuditWebsite.data);
      });
    flushMicrotasks();
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(AuditWebsite.definitions);
      return true;
    });
    expect(op.operation.variables.property).toEqual(
      mockAuditWebsiteInput.property
    );

    op.flush({ data: mockAuditWebsite.data });

    controller.verify();
  } ) );

  it('Autorun subscription', fakeAsync(() => {
    service
      .autorun()
      .subscribe((doc) => {
        expect(doc).toEqual(mockAutorun.data.autorun);
      });
    flushMicrotasks();
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(Autorun.definitions);
      return true;
    });

    op.flush({ data: mockAutorun.data });

    controller.verify();
  }));
});
