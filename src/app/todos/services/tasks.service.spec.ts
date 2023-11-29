import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TasksService } from './tasks.service'
import { TestBed } from '@angular/core/testing'
import { GetTasksResponse, Task, UpdateTaskRequest } from '../models/tasks.models'
import { environment } from 'src/environments/environment'
import { CommonResponseType } from 'src/app/core/models/core.models'
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum'
import { HttpResponse } from '@angular/common/http'

const todoId = 'fakeTodoListId'

const mockResponse: GetTasksResponse = {
  items: [
    {
      id: '61b0388b-90ec-4760-af4e-9dbc85fc2657',
      title: 'df',
      description: '',
      todoListId: 'b7a11ad0-2c76-4d4a-a4ce-39a2105a660f',
      order: -1,
      status: 0,
      priority: 1,
      startDate: '',
      deadline: '',
      addedDate: '2023-11-27T12:49:40.24',
      completed: false,
    },
    {
      id: '4b92201f-a223-4161-8f9e-6a862f7025de',
      title: 'dszv',
      description: '',
      todoListId: 'b7a11ad0-2c76-4d4a-a4ce-39a2105a660f',
      order: 0,
      status: 0,
      priority: 1,
      startDate: '',
      deadline: '',
      addedDate: '2023-11-27T12:48:24.983',
      completed: true,
    },
  ],
  totalCount: 2,
  error: '',
}

const title = 'fake tittle'

const taskId = 'someid'

const mockTask: Task = {
  id: taskId,
  title: title,
  todoListId: todoId,
  order: 3,
  addedDate: '2023-11-27T07:41:04.363',
  description: 'some desc',
  completed: false,
  status: 0,
  priority: 0,
  startDate: '',
  deadline: '',
}

const mockTaskUpdate: UpdateTaskRequest = {
  title: 'new title',
  description: 'new and shiny desc',
  completed: true,
  deadline: '',
  priority: 0,
  status: 0,
  startDate: '',
}

const mockUpdatedTask: Task = {
  id: taskId,
  title: 'new title',
  todoListId: todoId,
  order: 3,
  addedDate: '2023-11-27T07:41:04.363',
  description: 'new and shiny desc',
  completed: true,
  status: 0,
  priority: 0,
  startDate: '',
  deadline: '',
}

const successfulResponse: CommonResponseType<{ item: Task }> = {
  data: {
    item: mockTask,
  },
  resultCode: ResultCodeEnum.success,
  messages: [],
}

describe('tasks service test', () => {
  let service: TasksService
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksService],
      imports: [HttpClientTestingModule],
    })

    service = TestBed.inject(TasksService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('tasks service should init', () => {
    expect(service).toBeDefined()
  })

  it('should initialize with empty tasks$', () => {
    expect(service.tasks$.getValue()).toEqual({})
  })

  describe('getTasks method tests', () => {
    it('getTasks method should invoke GET method of httpService', () => {
      service.getTasks(todoId)
      const { request } = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      expect(request.method).toEqual('GET')
    })

    it('getTasks method should update tasks$ when request is successful', () => {
      service.getTasks(todoId)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      req.flush(mockResponse)
      expect(service.tasks$.value[todoId]).toEqual(mockResponse.items)
    })

    it('getTasks method should NOT set the tasks$ if the request was unsuccessful', () => {
      service.getTasks(todoId)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      req.error(new ErrorEvent('404'))
      expect(service.tasks$.value[todoId]).toBeFalsy()
    })
  })

  describe('addTask method tests', () => {
    it('addTask should invoke POST method of httpService', () => {
      service.addTask(todoId, title)
      const { request } = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      expect(request.method).toEqual('POST')
    })

    it('addTasks should update tasks$ with new task if the request was successful', () => {
      service.tasks$.next({ [todoId]: [] })
      service.addTask(todoId, title)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      req.flush(successfulResponse)
      expect(service.tasks$.getValue()).toEqual({ [todoId]: [mockTask] })
    })

    it('addTasks should not update tasks$ if the request was unsuccessful', () => {
      service.tasks$.next({ [todoId]: [] })
      service.addTask(todoId, title)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`
      )
      req.error(new ErrorEvent('404'))
      expect(service.tasks$.getValue()).toEqual({ [todoId]: [] })
    })
  })

  describe('deleteTask method tests', () => {
    it('deleteTask should invoke DELETE method of httpService', () => {
      service.deleteTask(todoId, taskId)
      const { request } = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
      )
      expect(request.method).toEqual('DELETE')
    })

    it('deleteTask should update the tasks$ if the request was successful', () => {
      const successfulResponse = new HttpResponse({
        status: 200,
      })
      service.tasks$.next({ [todoId]: [mockTask] })
      service.deleteTask(todoId, taskId)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
      )
      req.event(successfulResponse)
      expect(service.tasks$.getValue()).toEqual({ [todoId]: [] })
    })

    it('deleteTask should NOT update the tasks$ if the request was unsuccessful', () => {
      service.tasks$.next({ [todoId]: [mockTask] })
      service.deleteTask(todoId, taskId)
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
      )
      req.error(new ErrorEvent('404'))
      expect(service.tasks$.getValue()).toEqual({ [todoId]: [mockTask] })
    })

    describe('updateTask tests', () => {
      it('updateTask should invoke PUT method of httpClient', () => {
        service.tasks$.next({ [todoId]: [mockTask] })
        service.updateTask(todoId, taskId, mockTaskUpdate)
        const { request } = httpTestingController.expectOne(
          `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
        )
        expect(request.method).toEqual('PUT')
      })

      it('updateTask should update tasks$ if the request was successful', () => {
        service.tasks$.next({ [todoId]: [mockTask] })
        service.updateTask(todoId, taskId, mockTaskUpdate)
        const req = httpTestingController.expectOne(
          `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
        )
        req.flush(successfulResponse)
        expect(service.tasks$.getValue()).toEqual({ [todoId]: [mockUpdatedTask] })
      })

      it('updateTask should NOT update the tasks$ if the request was unsuccessful', () => {
        service.tasks$.next({ [todoId]: [mockTask] })
        service.updateTask(todoId, taskId, mockTaskUpdate)
        const req = httpTestingController.expectOne(
          `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`
        )
        req.error(new ErrorEvent('404'))
        expect(service.tasks$.getValue()).toEqual({ [todoId]: [mockTask] })
      })
    })
  })
})
