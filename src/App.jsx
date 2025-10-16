import { useRef, useState, useEffect } from 'react'
import './App.css'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";


function App() {

    const handleKeyDown = (event) => {
      if (event.key.length===1){
        inputref.current.focus();
        inputref.current.value = inputref.current.value + event.key;
      }
    }
    


  // document.addEventListener("keydown", handleKeyDown);
  

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const inputref = useRef(null)
  const [showFinished, setshowFinished] = useState(false);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString){
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos)
    }
  }, [])
  
  
  const handleEnterInInput = (event) => {
    if (event.key=="Enter"){
      saveTask()
    }
  }

  const saveToLs = (newTodos) => {;
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }
  
  const saveTask = () => {
    if (todo !== ""){
      let newTodos = [...todos, {todo, id: uuidv4(), isCompleted: false}];
      setTodos(newTodos)
      setTodo("")
      saveToLs(newTodos);
    }
  }
  
  const handleEdit = (event, id) => {
    let index = todos.findIndex(item=> {
      return item.id === id
    })
    setTodo(todos[index].todo);
    // inputref.current.focus();
    document.querySelector(".taskInput").focus();
  
    let newTodos = todos.filter(item=> {
      return item.id!==id
    })
    setTodos(newTodos);
    saveToLs(newTodos);
  }
  
  const handleDelete = (event, id) => {
    if (confirm("Are you sure you want to delete this todo?")){
      let index = todos.findIndex(item=> {
        return item.id === id
      })
      let newTodos = todos.filter(item=> {
        return item.id!==id
      })
      setTodos(newTodos);
      saveToLs(newTodos);
    }
    }

  const handleChange = (event) => {
    setTodo(event.target.value)
  }

  const handleCheckBox = (event) => {
    let id = event.target.name;
    let index = todos.findIndex(item=> {
      return item.id === id
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLs(newTodos);
  }

  const deleteAll = () => {
    if (confirm("Are you sure you want to delete all the tasks?")){
      setTodos([]);
      saveToLs([]);
    }
  }

  const showFinishedChange = () => {
    setshowFinished(!showFinished)
  }


  return (
    <>
    <main className='m-2 md:m-10 md:mx-auto container mx-auto gap-10 flex flex-col border-none rounded-xl p-5 bg-violet-100 h-[98vh] md:h-[87vh] w-[95%] md:w-[50%]'>
      <header className='gap-7 flex flex-col w-full items-center justify-center'>
        <h1 className='text-3xl font-bold text-center'>iTask</h1>
        <div className="controls flex gap-3 justify-center w-full">
          <input placeholder='Your Task' ref={inputref} onKeyDown={(event)=> handleEnterInInput(event)} type="text" onChange={(event)=>handleChange(event)} value={todo}  name="" id="" className='taskInput px-5 py-1 border-none outline-none rounded-full w-[45%] bg-white'/>
          <button disabled={todo.length<=3} onClick={saveTask} className='text-white bg-violet-800 rounded-full px-3 py-2 cursor-pointer transition-transform duration-500 active:scale-70 disabled:bg-violet-600'>Save</button>
        </div>
      <div className='bg-black p-0.5 w-full mt-5'></div>
      </header> 
      <div className='flex gap-3 font-bold text-lg items-center'>
        <input className='appearence-none w-4 h-4' type="checkbox" onChange={showFinishedChange} checked={showFinished} name="" id="" />Show Finished
        </div>
        <div className="tasks w-full flex flex-col overflow-y-scroll gap-3">
          {todos.length===0 && <div>No todos to display</div>}
    {todos.map(item=>{    
      return (showFinished || !item.isCompleted) && <div key={item.id} className="task flex items-center gap-6 justify-between">
          <div className="todotext flex gap-2 items-center w-full">  
          <input onChange={handleCheckBox} type="checkbox" name={item.id} checked={item.isCompleted} id="" />
          <span className={`${item.isCompleted?"text-lg line-through":"text-lg w-full"} flex-wrap`}>{item.todo}</span>
          </div>
          <div className="buttons mx-2 flex gap-2">
          <button onClick={(e)=> {handleEdit(e, item.id)}} className='cursor-pointer bg-violet-800 px-3 py-2 text-white rounded-full transition-transform duration-500 active:scale-70'><FaEdit /></button>
          <button onClick={(e)=> {handleDelete(e, item.id)}} className='cursor-pointer bg-violet-800 px-3 py-2 text-white rounded-full transition-transform duration-500 active:scale-70'><MdDelete /></button>
          </div>
        </div>
    })}
        </div>
    <footer className='flex justify-center items-center'>
      <button onClick={deleteAll} className='text-xl cursor-pointer bg-violet-800 px-5 py-2 text-white rounded-full transition-transform duration-500 active:scale-70'>
        <MdDelete/>
      </button>
    </footer>
    </main>   
    </>
  )
}

export default App
