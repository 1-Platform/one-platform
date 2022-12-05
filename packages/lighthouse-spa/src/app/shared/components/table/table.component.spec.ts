import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FloorPipe } from 'app/shared/pipes/floor.pipe';
import { GetDecimalPipe } from 'app/shared/pipes/get-decimal.pipe';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LoaderComponent } from '../loader/loader.component';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        TableComponent,
        EmptyStateComponent,
        LoaderComponent,
        FloorPipe,
        GetDecimalPipe,
    ],
    imports: [],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to change branch', fakeAsync(() => {
    component.isLoading = true;
    component.loadingText = 'Loading...';
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading...');
  }));

  it('should show empty message on empty rows', fakeAsync(() => {
    component.rows = [];
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No data to show');
  }));
});
