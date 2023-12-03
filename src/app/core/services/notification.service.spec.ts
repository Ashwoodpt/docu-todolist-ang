import { TestBed } from '@angular/core/testing'
import { NotificationService } from './notification.service'
import { LoggerService } from 'src/app/shared/services/logger.service'

describe('notification service test', () => {
  let service: NotificationService
  let loggerService: LoggerService
  const fakeLoggerService = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error'])
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: LoggerService, useValue: fakeLoggerService }],
    })
    service = TestBed.inject(NotificationService)
    loggerService = TestBed.inject(LoggerService)
  })

  afterEach(() => {
    fakeLoggerService.info.calls.reset()
    fakeLoggerService.error.calls.reset()
    fakeLoggerService.warn.calls.reset()
  })

  it('notification service should init', () => {
    expect(service).toBeDefined()
  })

  it('notify$ should be created with null value', () => {
    expect(service.notify$.value).toBeNull()
  })

  it('notification service should invoke info method of LoggerService to inform about its initialization', () => {
    expect(loggerService.info).toHaveBeenCalledTimes(1)
  })

  describe('handleError method testing', () => {
    it('handleError method should call notify$.next', () => {
      const notifyNextSpy = spyOn(service.notify$, 'next')
      service.handleError('mock')
      expect(notifyNextSpy).toHaveBeenCalledOnceWith({ severity: 'error', message: 'mock' })
      notifyNextSpy.calls.reset()
    })
    it('handleError method should invoke warn method of LoggerService to inform about error notification being sent to the user', () => {
      service.handleError('mock')
      expect(loggerService.warn).toHaveBeenCalledTimes(1)
    })
  })
  describe('handleSuccess method testing', () => {
    it('handleSuccess method should call notify$.next', () => {
      const notifyNextSpy = spyOn(service.notify$, 'next')
      service.handleSuccess('mock')
      expect(notifyNextSpy).toHaveBeenCalledOnceWith({ severity: 'success', message: 'mock' })
      notifyNextSpy.calls.reset()
    })
    it('handleSuccess method should invoke info method of LoggerService to inform about success notification being sent to the user', () => {
      fakeLoggerService.info.calls.reset()
      service.handleSuccess('mock')
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })
  })

  describe('clear method testing', () => {
    it('clear method should call notify$.next', () => {
      const notifyNextSpy = spyOn(service.notify$, 'next')
      service.clear()
      expect(notifyNextSpy).toHaveBeenCalledTimes(1)
      notifyNextSpy.calls.reset()
    })

    it('clear method should reset the notify$ to null', () => {
      service.clear()
      expect(service.notify$.value).toBeNull()
    })

    it('clear method should invoke info method of LoggerService to inform about data being cleared', () => {
      fakeLoggerService.info.calls.reset()
      service.clear()
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })
  })
})
