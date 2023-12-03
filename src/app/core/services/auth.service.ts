import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { CommonResponseType } from 'src/app/core/models/core.models'
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum'
import { Router } from '@angular/router'
import { LoginRequestData, MeResponse } from 'src/app/core/models/auth.models'
import { EMPTY } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { NotificationService } from 'src/app/core/services/notification.service'
import { LoggerService } from 'src/app/shared/services/logger.service'

const AuthLoggerFile = 'AuthServiceLog'

@Injectable()
export class AuthService {
  isAuth = false

  resolveAuthRequest: Function = () => {}

  authRequest = new Promise(resolve => {
    this.resolveAuthRequest = resolve
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private loggerService: LoggerService
  ) {
    this.loggerService.info('Auth service was initialized', AuthLoggerFile)
  }
  login(data: LoginRequestData) {
    this.loggerService.info('Auth request sent', AuthLoggerFile)
    this.http
      .post<CommonResponseType<{ userId: number }>>(`${environment.baseUrl}/auth/login`, data)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/'])
          this.loggerService.info('Auth request successful, redirecting...', AuthLoggerFile)
        } else {
          this.notificationService.handleError(res.messages[0])
        }
      })
  }
  logout() {
    this.loggerService.info('Logging out...', AuthLoggerFile)
    this.http
      .delete<CommonResponseType>(`${environment.baseUrl}/auth/login`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/login'])
          this.loggerService.info('Logout successful', AuthLoggerFile)
        }
      })
  }

  me() {
    this.loggerService.info('Verifying the user...', AuthLoggerFile)
    this.http
      .get<CommonResponseType<MeResponse>>(`${environment.baseUrl}/auth/me`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.isAuth = true
          this.loggerService.info('Verified successfuly', AuthLoggerFile)
        } else {
          this.isAuth = false
          this.loggerService.warn('Could not verify, logging out...', AuthLoggerFile)
        }
        this.resolveAuthRequest()
      })
  }
  private errorHandler(err: HttpErrorResponse) {
    this.notificationService.handleError(err.message)
    this.loggerService.error(err.message, AuthLoggerFile)
    return EMPTY
  }
}
