import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoginComponent } from './login.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthService } from 'src/app/core/services/auth.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'

const validMockData = {
  email: 'testemail@gmail.com',
  password: 'qwerty123',
  rememberMe: false,
}

const invalidMockData = {
  email: 'testsesas',
  password: '12341sda',
  rememberMe: true,
}

const fakeAuthService = jasmine.createSpyObj('AuthService', ['login', 'logout', 'me'])

describe('LoginComponent testing', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let authService: AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
  })

  afterEach(() => {
    fakeAuthService.login.calls.reset()
  })

  it('login component should be created', () => {
    expect(component).toBeDefined()
  })

  it('login component should be initialized with empty form', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: '',
      rememberMe: false,
    })
  })

  describe('email validation testing', () => {
    it('email is invalid if the field is empty', () => {
      expect(component.email?.valid).toBeFalse()
    })

    it('email field should be required', () => {
      expect(component.email?.errors?.['required']).toBeTrue()
    })

    it('email should be valid if the email field value is an email', () => {
      component.email?.setValue('testemail@gmail.com')
      expect(component.email?.valid).toBeTrue()
    })

    it('email should be invalid if the email field value is not an email ', () => {
      component.email?.setValue('azerty')
      expect(component.email?.hasError('pattern')).toBeTrue()
    })

    it('email field should have inputSuccess class if email is valid', () => {
      component.email?.setValue('testemail@gmail.com')
      const emailField = fixture.nativeElement.querySelector('input[type="text"]')
      fixture.detectChanges()
      expect(emailField.classList.contains('inputSuccess')).toBeTrue()
    })

    it('email field should have inputError class if email is invalid', () => {
      component.email?.setValue('asddasdas')
      component.loginForm.markAllAsTouched()
      fixture.detectChanges()
      const emailField = fixture.nativeElement.querySelector('input[type="text"]')
      expect(emailField.classList.contains('inputError')).toBeTrue()
    })

    it('should show an error if email is left empty', () => {
      component.email?.setValue('')
      component.loginForm.markAllAsTouched()
      fixture.detectChanges()
      const errorAlert = fixture.nativeElement.querySelector('div.error')
      expect(errorAlert.firstElementChild.innerHTML).toEqual('Email is required')
    })
    it('should show an error if email pattern is wrong', () => {
      component.email?.setValue('asdsdacaxas')
      component.loginForm.markAllAsTouched()
      fixture.detectChanges()
      const errorAlert = fixture.nativeElement.querySelector('div.error')
      expect(errorAlert.firstElementChild.innerHTML).toEqual('Email incorrect pattern')
    })
  })

  describe('password field testing', () => {
    it('password is invalid if the field is empty', () => {
      component.password?.setValue('')
      expect(component.password?.valid).toBeFalse()
    })

    it('password should be valid if password field value has more that 3 characters', () => {
      component.password?.setValue('qwerty123')
      expect(component.password?.hasError('minlength')).toBeFalse()
    })

    it('password should be invalid if its too short', () => {
      component.password?.setValue('qw')
      expect(component.password?.hasError('minlength')).toBeTrue()
    })

    it('password field should be required', () => {
      expect(component.password?.errors?.['required']).toBeTrue()
    })

    it('password field should have inputSuccess class if password is valid', () => {
      component.password?.setValue('qwerty123')
      const emailField = fixture.nativeElement.querySelector('input[type="password"]')
      fixture.detectChanges()
      expect(emailField.classList.contains('inputSuccess')).toBeTrue()
    })

    it('password field should have inputError class if password is invalid', () => {
      const passwordField = fixture.nativeElement.querySelector('input[type="password"')
      component.password?.setValue('12')
      component.loginForm.markAllAsTouched()
      fixture.detectChanges()
      expect(passwordField.classList.contains('inputError')).toBeTrue()
    })

    it('should show an error if password is empty', () => {
      component.email?.setValue('testemail@gmail.com')
      component.password?.setValue('')
      component.loginForm.markAllAsTouched()
      fixture.detectChanges()
      const errorAlert = fixture.nativeElement.querySelector('div.error')
      expect(errorAlert.firstElementChild.innerHTML).toEqual('Password is required')
    })

    it('should show an error if password is too short', () => {
      component.email?.setValue('testemail@gmail.com')
      component.loginForm.markAllAsTouched()
      component.password?.setValue('as')
      fixture.detectChanges()
      const errorAlert = fixture.nativeElement.querySelector('div.error')
      expect(errorAlert.firstElementChild.innerHTML).toEqual(
        'Password must be at least 3 characters long'
      )
    })
  })

  describe('submit button testing', () => {
    it('submit button should be disabled if credentials are invalid', () => {
      component.loginForm.setValue(invalidMockData)
      fixture.detectChanges()
      const button = fixture.debugElement.query(By.css('button'))
      expect(button.nativeElement.disabled).toBeTrue()
    })

    it('submit button should be active if credentials are valid', () => {
      component.loginForm.setValue(validMockData)
      fixture.detectChanges()
      const button = fixture.debugElement.query(By.css('button'))
      expect(button.nativeElement.disabled).toBeFalse()
    })

    it('submit button click should invoke onLoginSubmit method of LoginComponent if credentials are valid', () => {
      component.loginForm.setValue(validMockData)
      fixture.detectChanges()
      const onLoginSubmitSpy = spyOn(component, 'onLoginSubmit')
      const button = fixture.debugElement.query(By.css('button'))
      button.nativeElement.click()
      expect(onLoginSubmitSpy).toHaveBeenCalledTimes(1)
    })

    it('should invoke login from AuthService when submitting valid data', () => {
      component.loginForm.setValue(validMockData)
      fixture.detectChanges()
      component.onLoginSubmit()
      expect(authService.login).toHaveBeenCalledTimes(1)
    })

    it('should NOT invoke login method from AuthService when submitting invalid data', () => {
      component.loginForm.setValue(invalidMockData)
      fixture.detectChanges()
      component.onLoginSubmit()
      expect(authService.login).toHaveBeenCalledTimes(0)
    })
  })
})
