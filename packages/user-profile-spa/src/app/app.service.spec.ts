import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';

import { HttpClientModule } from '@angular/common/http';

import { Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

describe('AppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpLinkModule
      ],
      providers: [
        AppService,
        Apollo
      ]
    });
  });

  it('should be created', inject([AppService], (service: AppService) => {
    expect(service).toBeTruthy();
  }));
});
