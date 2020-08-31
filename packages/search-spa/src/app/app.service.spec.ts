import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule( {
      imports: [
        HttpClientModule,
        HttpLinkModule
      ],
      providers: [
        Apollo
      ]
    } );
    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
