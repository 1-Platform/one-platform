import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule( {
      imports: [
        HttpClientModule
      ],
      providers: [
        Apollo
      ]
    });
    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
