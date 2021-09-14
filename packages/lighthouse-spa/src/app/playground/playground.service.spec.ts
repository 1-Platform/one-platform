import { TestBed } from '@angular/core/testing';

import { PlaygroundService } from './playground.service';

describe('PlaygroundService', () => {
  let service: PlaygroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaygroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
