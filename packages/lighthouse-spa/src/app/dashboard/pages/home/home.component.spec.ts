import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { PropertyCardComponent } from 'app/dashboard/components/property-card/property-card.component';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { mockListProjects } from 'app/dashboard/mock-dashboard';

import { SharedModule } from 'app/shared/shared.module';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, PropertyCardComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        SharedModule,
        ApolloTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DashboardService);
    fixture.detectChanges();
    spyOn(service, 'listLHProjects').and.returnValue({
      valueChanges: of({ data: mockListProjects, loading: false }),
    });
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show list of projects', () => {
    expect(component.projects).toEqual(
      mockListProjects.listLHProjects as any // graphql type error: using general type of the whole object
    );
    expect(component.isProjectListLoading).toBeFalsy();
  });

  it('should show empty banner', fakeAsync(() => {
    const el: HTMLElement = fixture.nativeElement;
    component.isEmpty = true;
    tick();
    fixture.detectChanges();

    expect(el.textContent).toContain('No data found');
  }));

  it('should should loading state', fakeAsync(() => {
    const el: HTMLElement = fixture.nativeElement;
    component.isProjectListLoading = true;
    component.projects = { count: 0, rows: [] };
    tick();
    fixture.detectChanges();
    expect(el.textContent).not.toContain('No data found');
    expect(el.textContent).toContain('Loading...');
  }));
});
