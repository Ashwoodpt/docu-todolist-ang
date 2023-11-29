import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthService } from './core/services/auth.service'

const fakeAuthService = jasmine.createSpyObj('AuthService', ['me'])

describe('app component testing', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let authService: AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
  })

  it('should initialize', () => {
    expect(component).toBeDefined()
  })

  it('should invoke me method of AuthService when initialized', () => {
    component.ngOnInit()
    expect(authService.me).toHaveBeenCalledTimes(1)
  })
})
