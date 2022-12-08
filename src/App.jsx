import React, { useCallback } from 'react'
import './App.css'
import Header from './Components/Header'
import Main from './Components/Main'
import { nanoid } from 'nanoid'
import Task from './Components/Task'

export const ThemeContext = React.createContext(null)

function App() {
  const [doList , setDoList] = React.useState([])
  const [filteredTasks , setFilteredTasks] = React.useState(tasksFiltered())
  const [count , setCount] = React.useState(0)
  const [theme , setTheme] = React.useState(window.localStorage.getItem('theme') || 'light')

  function tasksFiltered(){
    const storedTasks = JSON.parse(localStorage.getItem('Tasks'))
    if(storedTasks){
      return storedTasks
    }
  }

  React.useEffect(()=>{
    localStorage.setItem('Tasks' , JSON.stringify(filteredTasks))
  } , [doList])

  const themeToggle = ()=>{
       window.localStorage.setItem('theme' , theme === 'light' ? 'dark' : 'light')
       setTheme(window.localStorage.getItem('theme'))
  }

  React.useEffect(()=>{
      document.body.style.backgroundColor = theme === 'dark' ?  'hsl(235, 21%, 11%)' : 'hsl(0, 0%, 98%)'
  }, [theme])

  function keyHandler(e) {
      if(e.target.value !== ''){
          if(e.keyCode === 13){
              const tasks = {
                  id : nanoid(),
                  task : e.target.value,
                  completed: false
              }
              setDoList(prev => [...prev, tasks])
              setFilteredTasks(prev => [...prev , tasks])
              e.target.value = ''
      }
      }else{
          return
      }
  }
  React.useEffect(()=>{
    let counter = 0
    doList.map((t)=> {
      t.completed ? counter = counter + 1 : counter
    })
    setCount(counter)
  })

  function onChange(event){
    const checkedBox = doList.map((tsks) => {
      if(event.target.id === tsks.id){
        return {
          ...tsks,
          [event.target.name]: event.target.checked
        }
      }
      return tsks
    })
    setDoList(checkedBox)
  }
  function deleteHandling(id){
    setDoList(doList.filter((detletedTasks) => detletedTasks.id != id ))
    setFilteredTasks(doList.filter((detletedTasks) => detletedTasks.id != id ))
  }
  function completedTasks(){
    setDoList(doList.filter((detletedTasks) => !detletedTasks.completed))
    setFilteredTasks(doList.filter((detletedTasks) => !detletedTasks.completed ))
  }
  function taskFilter(event){
    if(event.target.textContent == 'All'){
      setFilteredTasks(doList)
    }else if (event.target.textContent == "Active"){
      const activeTasks = doList.filter(tsk => !tsk.completed)
      setFilteredTasks(activeTasks)
    }else if(event.target.textContent == 'Completed'){
      const completedTasks = doList.filter(tsk => tsk.completed)
      setFilteredTasks(completedTasks)
    }
  }

  const allTasks =filteredTasks.map(tsk=> {
    return (
        <Task  onDelete = {deleteHandling} doTask = {tsk.task} completed = {tsk.completed} key={tsk.id} id = {tsk.id} change = {onChange} />
    )
})

  return (
    <ThemeContext.Provider value={{theme , themeToggle}}>
      <div id={theme}>
        <Header /> 
        <Main theme = {theme} toggleTheme = {themeToggle} completion = {completedTasks} keyHandler= {keyHandler} counter = {doList.length - count} sort = {taskFilter}>
          {allTasks}
        </Main>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
