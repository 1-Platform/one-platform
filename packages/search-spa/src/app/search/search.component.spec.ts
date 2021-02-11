import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { NgPipesModule } from 'ngx-pipes';
import { ResultMock } from '../testing/mocks/result.mock';
import { AppService } from '../app.service';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchSpy;
  const appService = { search: jest.fn() };
  searchSpy = appService.search.mockReturnValue(
    Promise.resolve( ResultMock )
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [
        NgPipesModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AppService, useValue: appService },
        Apollo
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
