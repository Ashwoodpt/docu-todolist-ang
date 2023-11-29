import { DomainTask, UpdateTaskRequest } from 'src/app/todos/models/tasks.models'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TasksComponent } from './tasks.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { TodosService } from 'src/app/todos/services/todos.service'
import { TasksService } from 'src/app/todos/services/tasks.service'
import { DomainTodo } from 'src/app/todos/models/todos.models'
import { of } from 'rxjs'
import { TaskStatusEnum } from 'src/app/core/enums/taskStatus.enum'
import { FormsModule } from '@angular/forms'
import { TaskComponent } from './task/task.component'

const todoId = 'someid'

const todoId2 = 'someotherid'

const taskId1 = 'someTaskid'

const taskId2 = 'anotherTaskid'

const mockTitle = 'new and shiny title'

const mockTasks: DomainTask = {
  [todoId]: [
    {
      id: taskId1,
      title: 'title1',
      addedDate: 'today',
      completed: false,
      deadline: '',
      description: 'desc',
      order: 1,
      priority: 0,
      startDate: '',
      status: TaskStatusEnum.active,
      todoListId: todoId,
    },
    {
      id: taskId1,
      title: 'another one',
      addedDate: 'yesterday',
      completed: true,
      deadline: '',
      description: 'desc2',
      order: 1,
      priority: 0,
      startDate: '',
      status: TaskStatusEnum.completed,
      todoListId: todoId,
    },
  ],
  [todoId2]: [
    {
      id: taskId2,
      title: 'title2',
      addedDate: 'today',
      completed: false,
      deadline: '',
      description: 'desc',
      order: 1,
      priority: 0,
      startDate: '',
      status: TaskStatusEnum.completed,
      todoListId: todoId2,
    },
  ],
}

const mockTodos: DomainTodo[] = [
  {
    id: todoId,
    title: 'todotitle1',
    addedDate: '',
    order: 1,
    filter: 'all',
  },
  {
    id: todoId2,
    title: 'todotitle2',
    addedDate: '',
    order: 1,
    filter: 'all',
  },
]

const mockNewTask: UpdateTaskRequest = {
  completed: true,
  deadline: '',
  description: 'updated desc',
  priority: 0,
  startDate: '',
  status: TaskStatusEnum.completed,
  title: 'updated title',
}

const changeStatusEvent: { taskId: string; newTask: UpdateTaskRequest } = {
  taskId: taskId1,
  newTask: mockNewTask,
}

describe('tasks component method testing', () => {
  let component: TasksComponent
  let fixture: ComponentFixture<TasksComponent>
  let todosService: TodosService
  let tasksService: TasksService

  beforeEach(async () => {
    const fakeTasksService = jasmine.createSpyObj('TasksService', [
      'addTask',
      'updateTask',
      'deleteTask',
      'getTasks',
    ])
    const fakeTodosService = jasmine.createSpyObj('TodosService', [
      'getTodos',
      'addTodo',
      'deleteTodo',
      'updateTodoTitle',
      'changeFilter',
    ])
    await TestBed.configureTestingModule({
      declarations: [TasksComponent, TaskComponent],
      imports: [FormsModule],
      providers: [
        { provide: TasksService, useValue: { ...fakeTasksService, tasks$: of(mockTasks) } },
        { provide: TodosService, useValue: { ...fakeTodosService, todos$: of(mockTodos) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TasksComponent)
    component = fixture.componentInstance
    tasksService = TestBed.inject(TasksService)
    todosService = TestBed.inject(TodosService)

    component.todoId = todoId
    component.ngOnInit()
  })

  it('Tasks component should initialize', () => {
    expect(component).toBeDefined()
  })

  it('Tasks component should initialize with taskTitle being an empty string', () => {
    expect(component.taskTitle).toEqual('')
  })

  it('Task component should have tasks$ defined after ngOnInit runs', () => {
    expect(component.tasks$).toBeDefined()
  })

  it('Task component should invoke getTask method of TasksService when initialized', () => {
    expect(tasksService.getTasks).toHaveBeenCalledOnceWith(todoId)
  })

  it('Task component should update tasks after recieving them from TasksService', () => {
    component.tasks$?.subscribe(task => {
      expect(task).toEqual(mockTasks[todoId])
      expect(task).not.toEqual(mockTasks[todoId2])
    })
  })

  describe('addTaskHandler method testing', () => {
    it('addTaskHandler method should invoke addTask method of TasksService when inovked', () => {
      component.taskTitle = mockTitle
      component.addTaskHandler()
      expect(tasksService.addTask).toHaveBeenCalledOnceWith(todoId, mockTitle)
    })

    it('addTaskHandler method should set taskTitle to an empty string', () => {
      component.taskTitle = mockTitle
      component.addTaskHandler()
      expect(component.taskTitle).toEqual('')
    })

    it('addTaskHandler method should be invoked when the input is focused and enter key is pressed', () => {
      const addTaskHandlerSpy = spyOn(component, 'addTaskHandler')
      const titleInput = fixture.nativeElement.querySelector('input')
      const enterKeyUpEvent = new KeyboardEvent('keyup', { key: 'Enter' })
      titleInput.focus()
      titleInput.dispatchEvent(enterKeyUpEvent)
      fixture.detectChanges()
      expect(addTaskHandlerSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteTask method testing', () => {
    it('deleteTask method should invoke deleteTask method of TasksService when invoked', () => {
      component.deleteTask(taskId1)
      expect(tasksService.deleteTask).toHaveBeenCalledOnceWith(todoId, taskId1)
    })
  })

  describe('changeTaskStatus method testing', () => {
    it('changeTaskStatus method should invoke updateTask method of TasksService when invoked', () => {
      component.changeTaskStatus(changeStatusEvent)
      expect(tasksService.updateTask).toHaveBeenCalledOnceWith(todoId, taskId1, mockNewTask)
    })
  })
})
