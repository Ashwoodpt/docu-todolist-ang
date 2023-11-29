import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NotifyComponent } from './notify.component'
import { NotificationService } from 'src/app/core/services/notification.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { By } from '@angular/platform-browser'
import { BehaviorSubject } from 'rxjs'
import { Notify } from 'src/app/core/models/notify.models'

describe('notify component testing', () => {
  let component: NotifyComponent
  let fixture: ComponentFixture<NotifyComponent>
  let notificationService: NotificationService

  const mockNotify$: BehaviorSubject<Notify | null> = new BehaviorSubject<Notify | null>(null)

  const mockErrorNotification: Notify = { severity: 'error', message: 'error message' }
  const mockSuccessNotification: Notify = { severity: 'success', message: 'sucess message' }
  const fakeNotificationService = jasmine.createSpyObj('NotificationService', ['clear'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifyComponent],
      providers: [
        {
          provide: NotificationService,
          useValue: { ...fakeNotificationService, notify$: mockNotify$ },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(NotifyComponent)
    component = fixture.componentInstance
    notificationService = TestBed.inject(NotificationService)
  })

  it('should initialize', () => {
    expect(component).toBeDefined()
  })

  it('notify$ should be subscribe to NotificationService.notify$ after initialization', () => {
    component.ngOnInit()
    expect(component.notify$).toEqual(notificationService.notify$)
  })

  it('notification-item element should have notification-item-success class when shown notification is of a success', () => {
    notificationService.notify$.next(mockSuccessNotification)
    fixture.detectChanges()
    const notificationItem = fixture.nativeElement.querySelector('.notification-item')
    expect(notificationItem.classList).toContain('notification-item-success')
  })

  it('notification-item element should have notification-item-error class when shown notification is of an error', () => {
    notificationService.notify$.next(mockErrorNotification)
    fixture.detectChanges()
    const notificationItem = fixture.nativeElement.querySelector('.notification-item')
    expect(notificationItem.classList).toContain('notification-item-error')
  })

  describe('closeNotification method testing', () => {
    it('closeNotification method should invoke clear method of Notification service when invoked', () => {
      component.closeNotification()
      expect(notificationService.clear).toHaveBeenCalledTimes(1)
    })
    it('closeNotification method should be invoked when the button is clicked', () => {
      notificationService.notify$.next(mockErrorNotification)
      fixture.detectChanges()
      const closeNotificationSpy = spyOn(component, 'closeNotification')
      const closeButton = fixture.debugElement.query(By.css('button')).nativeElement
      closeButton.dispatchEvent(new Event('click'))
      fixture.detectChanges()
      expect(closeNotificationSpy).toHaveBeenCalledTimes(1)
    })
  })
})
