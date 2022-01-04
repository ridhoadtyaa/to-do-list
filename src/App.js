import './App.css';
import { FaPlus, FaTrashAlt, FaRegEdit } from 'react-icons/fa';
import { BsXLg, BsClipboardCheck, BsClipboardX } from 'react-icons/bs';
import { useEffect, useState } from 'react';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [edited, setEdited] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    document.title = 'ToDoList';
  })

  const taskChangeHandler = (e) => {
    setTask(e.target.value);
  }

  const submitHandler = (e) => {
    e.preventDefault();

    if(task === '') {
      setAlert(true);
      return;
    }

    if(!edited) {
      setTasks([...tasks, {
        id: Date.now(),
        name: task,
        date: new Date().toISOString().slice(0,10)
      }]);
    } else {
      tasks[taskIndex].name = task;
      setEdited(false);
    }

    setTask('');
    setAlert(false);
  }

  const findTaskById = (id) => tasks.find(task => task.id === id);
  const findCompletedTaskById = (id) => completed.find(c => c.id === id);

  const removeHandler = (id) => {
    
    const filterTask = tasks.filter(task => task !== findTaskById(id));

    setTasks(filterTask);
  }

  const taskDoneHandler = (id) => {
    const findTask = findTaskById(id);
    removeHandler(id);

    setCompleted([...completed, findTask]);
  }

  const taskNotDoneHandler = (id) => {
    const findCompletedTask = findCompletedTaskById(id);
    const filterCompletedTask = completed.filter(c => c !== findCompletedTask);
    
    setCompleted(filterCompletedTask);
    setTasks([...tasks, findCompletedTask]);
  }

  const editTaskHandler = (id) => {
    const findTask = findTaskById(id);
    const taskIndex = tasks.findIndex(task => task.id === id);

    setTaskIndex(taskIndex);
    setTask(findTask.name);
    setEdited(true);
  }

  const cancleEditHandler = () => {
    setTask('');
    setEdited(false);
  }

  return (
    <div className="app container">
      <h2 className='text-center mb-5 text-white'>ToDoList</h2>
      <div className="row d-flex justify-content-center">
        <div className="col-8">
          <form onSubmit={submitHandler}>
            <div className="mb-3 d-flex">
              <input type="text" className="form-control" name='task' placeholder="Add a task" value={task} onChange={taskChangeHandler} autoFocus />
              <button className="btn btn-pink ms-3" type='submit'>{edited ? <FaRegEdit /> : <FaPlus className='text-dark m-0' />}</button>
              {
                edited && <button className='btn btn-pink ms-2' title='Cancel Edit' onClick={cancleEditHandler}><BsXLg /></button>
              }
            </div>
          </form>
          {
            alert && <p className='text-danger'>The task field cannot be empty</p>
          }

          <p className='text-white mt-5'>Task - {tasks.length}</p>
          {
            tasks.length ? (
              tasks.map(task => (
                <div className="task d-flex justify-content-between align-items-center" key={task.id}>
                    <div>
                      <p className="text-white">{task.name}</p>
                      <small className='text-muted'>{task.date}</small>
                    </div>
                    <div>
                      <button className='btn btn-pink' title='Done' onClick={() => taskDoneHandler(task.id)}><BsClipboardCheck /></button>
                      <button className='btn btn-pink ms-2' title='Delete' onClick={() => removeHandler(task.id)}><FaTrashAlt /></button>
                      <button className='btn btn-pink ms-2' title='Edit' onClick={() => editTaskHandler(task.id)}><FaRegEdit /></button>
                    </div>
                  </div>
              ))
            ) : <p className='text-center text-white'>Tasks don't exist yet...</p>
          }


          <p className='text-white mt-5'>Completed - {completed.length}</p>
          {
              completed.length ? (
                completed.map(c => (
                  <div className="task d-flex justify-content-between align-items-center" key={c.id}>
                    <div>
                      <p className="text-white">{c.name}</p>
                      <small className="text-muted">{c.date}</small>
                    </div>
                    <div>
                      <button className='btn btn-pink' title='Not Done' onClick={() => taskNotDoneHandler(c.id)}><BsClipboardX /></button>
                    </div>
                  </div>
                ))
              ) : <p className='text-center text-white'>No tasks have been completed...</p>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
