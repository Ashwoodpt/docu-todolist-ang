import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Notify } from 'src/app/core/models/notify.models'
import { LoggerService } from 'src/app/shared/services/logger.service'

const notificationLogFile = 'NotificationLog'

@Injectable()
export class NotificationService {
  notify$ = new BehaviorSubject<Notify | null>(null)

  constructor(private loggerService: LoggerService) {
    this.loggerService.info('Notification service initialized', notificationLogFile)
  }
  handleError(message: string) {
    this.notify$.next({ severity: 'error', message })
    this.loggerService.warn('error notification sent to the user', notificationLogFile)
  }

  handleSuccess(message: string) {
    this.notify$.next({ severity: 'success', message })
    this.loggerService.info('success notification sent to the user', notificationLogFile)
  }

  clear() {
    this.notify$.next(null)
    this.loggerService.info('notifications were cleared', notificationLogFile)
  }
}
