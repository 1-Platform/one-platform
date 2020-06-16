import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user-profile-components/user-details/user-details.component';
import { UserAuthDetailsComponent } from './user-profile-components/user-auth-details/user-auth-details.component';
import { HeaderComponent } from './user-profile-components/header/header.component';
import { UserAuthItemComponent } from './user-profile-components/user-auth-details/user-auth-item/user-auth-item.component';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';

describe( 'AppComponent', () =>
{
  beforeEach( async( () =>
  {
    TestBed.configureTestingModule( {
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent,
        UserDetailsComponent,
        UserAuthDetailsComponent,
        UserAuthItemComponent,
        HeaderComponent
      ],
      providers: [
        Apollo
      ]
    } ).compileComponents();
  } ) );

  it( 'should create the app', () =>
  {
    const fixture = TestBed.createComponent( AppComponent );
    const app = fixture.componentInstance;
    expect( app ).toBeTruthy();
  } );
} );
