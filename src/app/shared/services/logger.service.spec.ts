import { TestBed } from '@angular/core/testing'
import { LogLevel, LoggerService } from './logger.service'

const mockInfoMessage = 'someInfo'
const mockErrorMessage = 'someWarn'
const mockFileName = 'mockService'
const mockParam = ''

describe('Logger service testing', () => {
  let service: LoggerService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    })
    service = TestBed.inject(LoggerService)
  })

  afterEach(() => {})

  it('Logger service should initialize', () => {
    expect(service).toBeDefined()
  })

  it('Logger service should have logLevel set to info on initialization', () => {
    expect(service.logLevel).toEqual(LogLevel.Info)
  })

  describe('info method testing', () => {
    it('info method should call console info method when invoked', () => {
      const infoSpy = spyOn(console, 'info')
      service.info(mockInfoMessage, mockFileName)
      expect(infoSpy).toHaveBeenCalledOnceWith(
        `%c ${mockFileName}--${mockInfoMessage}`,
        `color: green`,
        mockParam
      )
    })
  })
  describe('warn method testing', () => {
    it('info method should call console info method when invoked', () => {
      const infoSpy = spyOn(console, 'warn')
      service.warn(mockErrorMessage, mockFileName)
      expect(infoSpy).toHaveBeenCalledOnceWith(
        `%c ${mockFileName}--${mockErrorMessage}`,
        `color: orange`,
        mockParam
      )
    })
  })
  describe('error method testing', () => {
    it('info method should call console info method when invoked', () => {
      const infoSpy = spyOn(console, 'error')
      service.error(mockErrorMessage, mockFileName)
      expect(infoSpy).toHaveBeenCalledOnceWith(
        `%c ${mockFileName}--${mockErrorMessage}`,
        `color: red`,
        mockParam
      )
    })
  })
})
