import React from "react"
import './TaskGrid.css'
import Tasks from './Tasks'
import Task from './Task'
import CreateNew from './CreateNew';
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'


const TaskGrid = ({user}) => {

    const [tasks, setTasks] = useState([])
    const [filterBy, setFilterBy] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/accounts/${user.account.id}/tasks`)
          .then((res) => res.json())
          .then((data) => setTasks(data))
          .catch(console.error);
    }, []);

    function handleFilterClick(x) {
        if(x ==='all'){
            setFilterBy(x);
            setFilter('all')
        }else if(x === user.email){
            setFilterBy(x)
            setFilter('self')
        }else if(x === 'critical'){
            setFilterBy(x)
            setFilter('critical')
        }else{
            setFilterBy(x);
            setFilter('self')
        }  
    }

    tasks?.sort(function (x, y) {     
        let b = x.created_at,         
        a = y.created_at   
        return a === b ? 0 : a > b ? 1 : -1 
    })

    const filteredTasks = tasks?.filter((task) => {
        if(filterBy === 'all' || filterBy === ''){
            return task.status !== 'closed'
        }else if(filterBy === 'critical'){
            return task.priority === 'critical'
        }else{ 
            return task.assigned_to === user.username
            
        }
    });

    const [dot, setDot] =  useState('moderate')
    const [cat, setCat] = useState('version-control')
    const [sub, setSub] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('all')

    const handleSubject = (x) => {
        setSub(x)
    }

    const handleBody = (x) => {
        setBody(x)
    }

    const submitAll = () => {
        if(sub && body){
            if(sub.length > 30){
            setError('Subject character limit = 30')
            }else if (body.length > 2000){
            setError('Description character limit = 2000')
            }else{
                fetch(`/api/tasks`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },

                    body: JSON.stringify({
                        account_id: user.account.id,
                        assigned_to: 'none',
                        category: cat,
                        closed_by: "n/a",
                        created_by: user.email,
                        description: body,
                        priority: dot,
                        status: "new",
                        subject: sub,
                        user_id: user.id
                    })
                }).then(resp => resp.json())
                .then(newTask => {
                    setTasks([...tasks, newTask])
                }) 
                setBody('')
                setSub('')
                setCat('version-control')
                setDot('moderate')
                navigate('/tasks')
            }
        }else if(!sub){
            setError('Subject field required')
        }else if(!body){
            setError('Description field required')
        }
    }

    return(  
        <Routes>
            <Route exact path='/' 
                element={
                    <Tasks 
                        filter={filter}
                        user={user} 
                        handleFilterClick={handleFilterClick} 
                        filteredTasks={filteredTasks}  
                    />
                } 
            />
            <Route path='/:id' 
                element={
                    <Task 
                        user={user} 
                        tasks={tasks} 
                        setFilterBy={setFilterBy}
                    />
                } 
            />
            <Route path="/create-new" 
                element={
                    <CreateNew 
                    dot={dot} 
                    cat={cat} 
                    setDot={setDot} 
                    setCat={setCat} 
                    error={error} 
                    handleBody={handleBody} 
                    handleSubject={handleSubject} 
                    submitAll={submitAll} 
                    />
                } 
            />  
        </Routes>
    )
}

export default TaskGrid