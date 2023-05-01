import React, { useState, useEffect, useRef } from 'react'
import Joi from 'joi';


export default function App() {

  // validation
  const Joi = require('joi');
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    address: Joi.string().required(),
  })

  // focuss
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current.focus();
  }, [])


  // maintain a reference to each user element in the DOM
  // scroll
  const userRefs = useRef({});
  const lastUserRef = useRef(null);

  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
  })
  const [users, setUsers] = useState([])
  const [update, setUpdate] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [search, setSearch] = useState('')

// scroll
  useEffect(() => {
    if (lastUserRef.current) {
      lastUserRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [users]);

  // localstorage
  useEffect(() => {
    let storedUserData = localStorage.getItem('userKey')
    if (storedUserData) {
      setUsers(JSON.parse(storedUserData))
    }


  }, [])

  // computed Properity for inputValue
  const getInputValue = (e) => {
    let myUser = { ...user }
    myUser[e.target.id] = e.target.value
    setUser(myUser)
  }

  const addUser = (e) => {
    e.preventDefault()

    // validate user data using Joi
    const { error } = schema.validate(user);
    console.log(schema.validate(user));
    // seterror validate
    if (error) {
      console.log(error.details[0].message);
      setError(error.details[0].message)
      return;
    }

    let newUser = { ...user, id: new Date().getTime() }
    let userString = JSON.stringify([...users, newUser])
    localStorage.setItem('userKey', userString)

    if (update) {
      // update
      const newUsers = [...users]
      Object.assign(newUsers[activeIndex], user)
      setUsers([...newUsers])
      setUpdate(false)
      setError(null)

    } else {
      // add user
      setUsers([...users, newUser])
      setError(null)

      // scroll to the newly added user

      if (filteredUsers.length > 0) {
        const lastUser = filteredUsers[filteredUsers.length - 1];
        lastUserRef.current = userRefs.current[lastUser.id];
      }
      
    }
    setUser({ name: "", email: "", address: "" });
  }


  // delete task (done)
  // const deleteUser = (index) => {
  //   const dataAfterDelete = [...users]
  //   dataAfterDelete.splice(index, 1)
  //   localStorage.setItem('userKey', JSON.stringify(dataAfterDelete))
  //   setUsers(dataAfterDelete)
  // }



  // delete task
  const deleteUser = (id) => {
    const newUsers = [...users]
    let dataAfterDelete = newUsers.filter((user) => user.id !== id);
    if (window.confirm("r u sure u want to delete")) {
      localStorage.setItem('userKey', JSON.stringify(dataAfterDelete));
      setUsers(dataAfterDelete);
    }
  }

  const editUser = (index) => {
    const editUser = users[index]
    let myUser = { ...user }
    myUser = {
      name: editUser.name,
      email: editUser.email,
      address: editUser.address,
    }
    setUser(myUser)
    setActiveIndex(index)
    setUpdate(true)
  }


  // search
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.address.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <>
      <div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form onSubmit={addUser} className='bg-light px-5 py-4 rounded-4 my-5 shadow'>
                <h1 className='pb-2 bg-secondary bg-gradient text-center w-50 mx-auto'>Crud App</h1>
                <div className="form-group my-3">
                  <label className='py-2 fw-bold' htmlFor="name">Name</label>
                  <input type="text" className='form-control' value={user.name} id='name' onChange={getInputValue}
                    ref={inputRef}
                  />
                </div>
                <div className="form-group my-3">
                  <label className='py-2 fw-bold' htmlFor="email">Email</label>
                  <input type="email" className='form-control' value={user.email} id='email' onChange={getInputValue} />
                </div>
                <div className="form-group my-3">
                  <label className='py-2 fw-bold' htmlFor="address">Address</label>
                  <input type="text" className='form-control' value={user.address} id='address' onChange={getInputValue} />
                </div>

                {/* conditionally render error message */}
                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {error}
                  </div>
                )}
                <button className='btn btn-secondary bg-gradient form-control my-4'>{update ? "Update" : "Add"}</button>
              </form>

              <div className="form-group mb-5 mt-3 d-flex align-items-center flex-column">
                <label htmlFor="search" className='py-1 my-2 bg-info px-2 rounded-top'>Search</label>
                <input type="text" className='form-control  w-50' placeholder='Search' id='search' value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <table className="table table-border ">
                <thead>
                  <tr className='bg-secondary bg-gradient'>
                    <th>index</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Adress</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index} className='' ref={(el) => (userRefs.current[user.id] = el)}>
                      <td>{index}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      <td><button className='btn btn-info' onClick={() => { editUser(index) }}>Edit</button></td>
                      <td><button className='btn btn-danger' onClick={() => { deleteUser(user.id) }}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



