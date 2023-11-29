import { TestBed } from '@angular/core/testing'
import { NotificationService } from './notification.service'

describe('notification service test', () => {
  let service: NotificationService
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    })
    service = TestBed.inject(NotificationService)
  })

  it('notification service should init', () => {
    expect(service).toBeDefined()
  })

  it('notify$ should be created with null value', () => {
    expect(service.notify$.value).toBeNull()
  })

  describe('handleError method testing', () => {
    it('handleError method should call notify$.next', () => {
      const notifyNextSpy = spyOn(service.notify$, 'next')
      service.handleError('mock')
      expect(notifyNextSpy).toHaveBeenCalledOnceWith({ severity: 'error', message: 'mock' })
      notifyNextSpy.calls.reset()
    })
  })
  describe('handleSuccess method testing', () => {
    it('handleSuccess method should call notify$.next', () => {
      const notifyNextSpy = spyOn(service.notify$, 'next')
      service.handleSuccess('mock')
      expect(notifyNextSpy).toHaveBeenCalledOnceWith({ severity: 'success', message: 'mock' })
      notifyNextSpy.calls.reset()
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
  })
})
