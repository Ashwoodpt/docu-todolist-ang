import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TodoFiltersComponent } from './todo-filters.component'
import { By } from '@angular/platform-browser'
import { FilterType } from 'src/app/todos/models/todos.models'

describe('todo-filters component testing', () => {
  let component: TodoFiltersComponent
  let fixture: ComponentFixture<TodoFiltersComponent>
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoFiltersComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoFiltersComponent)
    component = fixture.componentInstance
    component.filter = 'all'
  })

  it('should initialize', () => {
    expect(component).toBeTruthy()
  })

  it('button should invoke changeFilterHandler with correct filter data', () => {
    const changeFilterHandlerSpy = spyOn(component, 'changeFilterHandler')
    const button = fixture.nativeElement.querySelector('button')
    button.click()
    expect(changeFilterHandlerSpy).toHaveBeenCalledOnceWith('active')
  })

  it('changeFilterEvent should emit a new event when button is pressed', () => {
    const changeFilterEventSpy = spyOn(component.changeFilterEvent, 'emit')
    const button = fixture.nativeElement.querySelector('button')
    button.click()
    expect(changeFilterEventSpy).toHaveBeenCalledOnceWith('active')
  })

  it('buttons should recieve completed class when filter type corresponds', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'))
    buttons.forEach(button => {
      const type = button.nativeElement.innerHTML.trim().toLowerCase()
      component.filter = type
      fixture.detectChanges()
      expect(button.nativeElement.classList).toContain('completed')
    })
  })

  it('buttons should NOT recieve completed class if filter does not correspond', () => {
    const possibleFilterTypes: FilterType[] = ['all', 'completed', 'active']
    component.filter = possibleFilterTypes[Math.floor(Math.random() * 3)]
    const buttons = fixture.debugElement.queryAll(By.css('button'))
    buttons.forEach(button => {
      const type = button.nativeElement.innerHTML.trim().toLowerCase()
      if (type === component.filter) {
        if (type === 'all') component.filter = 'completed'
        if (type === 'completed') component.filter = 'active'
        if (type === 'active') component.filter = 'all'
      }
      fixture.detectChanges()
      expect(button.nativeElement.classList).not.toContain('completed')
    })
  })
})
