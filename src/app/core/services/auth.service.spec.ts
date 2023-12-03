import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from './auth.service'
import { NotificationService } from './notification.service'
import { LoginRequestData } from '../models/auth.models'
import { environment } from 'src/environments/environment'
import { routes } from 'src/app/app-routing.module'
import { Router } from '@angular/router'
import { HttpResponse } from '@angular/common/http'
import { ResultCodeEnum } from '../enums/resultCode.enum'
import { LoggerService } from 'src/app/shared/services/logger.service'

const invalidCredentialsMock: LoginRequestData = {
  email: 'smthsmthing@gmail.com',
  password: 'somepassword123',
  rememberMe: false,
}

const validCredentialsMock: LoginRequestData = {
  email: 'correctmail@mail.ru',
  password: 'nqwesdaq',
  rememberMe: false,
}

const fakeNotificationService = jasmine.createSpyObj('NotificationService', [
  'handleError',
  'handleSuccess',
  'clear',
])

const fakeLoggerService = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error'])

describe('Auth service test', () => {
  let service: AuthService
  let notificationService: NotificationService
  let httpTestingController: HttpTestingController
  let router: Router
  let loggerService: LoggerService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: NotificationService, useValue: fakeNotificationService },
        { provide: LoggerService, useValue: fakeLoggerService },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
      teardown: { destroyAfterEach: false },
    })

    service = TestBed.inject(AuthService)
    notificationService = TestBed.inject(NotificationService)
    router = TestBed.inject(Router)
    loggerService = TestBed.inject(LoggerService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
    fakeNotificationService.handleError.calls.reset()
    fakeLoggerService.info.calls.reset()
    fakeLoggerService.warn.calls.reset()
    fakeLoggerService.error.calls.reset()
  })

  it('auth service should init', () => {
    expect(service).toBeDefined()
  })

  it('auth service should invoke info method to log about successful initialization', () => {
    expect(loggerService.info).toHaveBeenCalledTimes(1)
  })

  it('auth service should be initialized with auth state being false', () => {
    expect(service.isAuth).toBeFalse()
  })

  describe('login method testing', () => {
    it('login method should invoke post method of httpClient', async () => {
      service.login(invalidCredentialsMock)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      expect(req.request.method).toEqual('POST')
    })

    it('login method should invoke navigate if there are no errors', () => {
      const expectedResponse = new HttpResponse({
        status: 200,
        body: {
          data: { userId: 24083 },
          messages: [],
          fieldsErrors: [],
          resultCode: ResultCodeEnum.success,
        },
      })
      const navigateSpy = spyOn(router, 'navigate')
      service.login(validCredentialsMock)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.event(expectedResponse)
      expect(navigateSpy).toHaveBeenCalledTimes(1)
    })

    it('login method should invoke handleError method of notificationService if credentials are wrong', () => {
      const expectedResponse = new HttpResponse({
        status: 200,
        body: {
          data: {},
          messages: ['Incorrect Email or Password'],
          fieldsErrors: [],
          resultCode: ResultCodeEnum.error,
        },
      })
      service.login(invalidCredentialsMock)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.event(expectedResponse)
      expect(notificationService.handleError).toHaveBeenCalledTimes(1)
    })

    it('login method should invoke handleError method of notificationService if request fails', () => {
      const errorResponse = new ErrorEvent('404')
      service.login(invalidCredentialsMock)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.error(errorResponse)
      expect(notificationService.handleError).toHaveBeenCalledTimes(1)
    })

    it('login method should invoke info method of LoggerService to log about sending the login request', () => {
      fakeLoggerService.info.calls.reset()
      service.login(validCredentialsMock)
      httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('login method should invoke info method of LoggerService to inform that request was successful', () => {
      service.login(validCredentialsMock)
      fakeLoggerService.info.calls.reset()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.flush({ resultCode: ResultCodeEnum.success })
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('login method should invoke error method of Loggerservice if there was an error with login request', () => {
      fakeLoggerService.info.calls.reset()
      const errorResponse = new ErrorEvent('404')
      service.login(invalidCredentialsMock)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.error(errorResponse)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('logout method testing', () => {
    it('logout method should invoke delete method of httpClient', () => {
      service.logout()
      const { request } = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      expect(request.method).toEqual('DELETE')
    })

    it('logout should invoke navigate when request is succesful', () => {
      const expectedResponse = new HttpResponse({
        status: 200,
        body: { data: {}, messages: [], fieldErrors: [], resultCode: ResultCodeEnum.success },
      })
      const navigateSpy = spyOn(router, 'navigate')
      service.logout()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.event(expectedResponse)
      expect(navigateSpy).toHaveBeenCalledTimes(1)
    })

    it('logout should invoke handleError method of notificationService when request fails', () => {
      const errorResponse = new ErrorEvent('test')
      service.logout()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.error(errorResponse)
      expect(notificationService.handleError).toHaveBeenCalledTimes(1)
    })

    it('logout should invoke info method of LoggerService to inform if the request was successful', () => {
      fakeLoggerService.info.calls.reset()
      service.logout()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('logout should invoke error method of Logger service if the request was unsuccessful', () => {
      fakeLoggerService.info.calls.reset()
      const errorEvent = new ErrorEvent('404')
      service.logout()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('me method testing', () => {
    it('me method should invoke get method of httpClient', () => {
      service.me()
      const { request } = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      expect(request.method).toEqual('GET')
    })

    it('me method should set this.isAuth to true if request is successful', () => {
      const expectedResponse = new HttpResponse({
        status: 200,
        body: { data: {}, messages: [], fieldErrors: [], resultCode: ResultCodeEnum.success },
      })
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.event(expectedResponse)
      expect(service.isAuth).toBeTrue()
    })

    it('me method should set isAuth to false if request failed', () => {
      const errorResponse = new ErrorEvent('test')
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.error(errorResponse)
      expect(service.isAuth).toBeFalse()
    })

    it('me method should invoke resolveAuthRequest', () => {
      const expectedResponse = new HttpResponse({
        status: 200,
        body: { data: {}, messages: [], fieldErrors: [], resultCode: ResultCodeEnum.success },
      })
      const resolveAuthRequestSpy = spyOn(service, 'resolveAuthRequest')
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.event(expectedResponse)
      expect(resolveAuthRequestSpy).toHaveBeenCalledTimes(1)
    })

    it('me method should invoke handleError method of notificationService if request fails', () => {
      const errorResponse = new ErrorEvent('test')
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.error(errorResponse)
      expect(notificationService.handleError).toHaveBeenCalledTimes(1)
    })

    it('me method should invoke info method of Logger service to inform about the request being sent', () => {
      fakeLoggerService.info.calls.reset()
      service.me()
      httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('me method should invoke error method of Logger service if request was unsuccessful', () => {
      fakeLoggerService.info.calls.reset()
      const errorEvent = new ErrorEvent('404')
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })

    it('me method should invoke warn method of LoggerService if user was not verified', () => {
      fakeLoggerService.info.calls.reset()
      service.me()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/me`)
      req.flush({ resultCode: ResultCodeEnum.error })
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.warn).toHaveBeenCalledTimes(1)
    })
  })
})
