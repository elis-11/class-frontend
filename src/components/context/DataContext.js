import { createContext, useEffect, useState } from "react";
import usersData from "../../data/users.json";
import teachersData from "../../data/teachers.json";
import studentsData from "../../data/students.json";
import todosData from "../../data/todos.json";
export const Context = createContext();

export const DataContext = (props) => {
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log("Use Effect running...");

    const fetchData = async () => {
      let response = await fetch(`${API_URL}/users`);
      const usersApi = await response.json();
      setUsers(usersApi);

      // LOAD TEACHERS
      response = await fetch(`${API_URL}/teachers`);
      const teachersApi = await response.json();
      console.log(teachersApi);
      setTeachers(teachersApi); // fill teachers into state and update DOM

      // TODO: LOAD STUDENTS...
      //load STUDENTS
      response = await fetch(`${API_URL}/students`);
      const studentsApi = await response.json();
      console.log(studentsApi);
      setStudents(studentsApi);

      response = await fetch(`${API_URL}/todos`);
      const todosApi = await response.json();
      console.log(todosApi);
      setTodos(todosApi);
    };

    fetchData();
  }, []); // just run it ONCE after first render

  const [users, setUsers] = useState(usersData);
  const [teachers, setTeachers] = useState(teachersData);
  const [students, setStudents] = useState(studentsData);
  const [todos, setTodos] = useState(todosData);

  // 1. add data to API first !
  // 2. if successful => also add item to STATE (=> frontend data)
  const addTeacher = async (teacherNew) => {
    console.log(teacherNew);

    // make POST request at API to CREATE new Item and RETURN new item with created ID!
    const response = await fetch(`${API_URL}/teachers`, {
      method: "POST",
      body: JSON.stringify(teacherNew), // SEND data to create in API => API will create the ID for us!
      headers: {
        "Content-Type": "application/json",
      },
    });
    const teacherNewApi = await response.json();
    console.log(teacherNewApi);

    setTeachers([...teachers, teacherNewApi]);
  };

  const editTeacher = async (id, teacherData) => {
    // update teacher at API
    await fetch(`${API_URL}/teachers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(teacherData), // SEND data to create in API => API will create the ID for us!
      headers: {
        "Content-Type": "application/json",
      },
    });

    // update teacher in FRONTEND STATE
    const updateTeacher = teachers.map((teacher) =>
      teacher._id === id ? { ...teacher, ...teacherData } : teacher
    );
    setTeachers(updateTeacher);
  };

  const deleteTeacher = async (id) => {
    // 1. delete at API
    // 2. if successful => we delete also in frontend STATE
    await fetch(`${API_URL}/teachers/${id}`, {
      method: "DELETE",
    });

    // delete also in frontend state
    const deleteTeacher = teachers.filter((teacher) => teacher._id !== id);
    setTeachers(deleteTeacher);
  };
//! Students
  const addStudent = async (studentNew) => {
    console.log(studentNew);

    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      body: JSON.stringify(studentNew),
      headers: { "Content-Type": "application/json" },
    });
    const studentNewApi = await response.json();
    console.log(studentNewApi);

    setStudents([...students, studentNewApi]);
  };

  const editStudent = async (id, studentData) => {
    await fetch(`${API_URL}/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(studentData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updateStudent = students.map((student) =>
      student._id === id ? { ...student, studentData } : student
    );
    setStudents(updateStudent);
  };
  
  const deleteStudent = async (id) => {
    await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
    });

    const deleteItem = students.filter((student) => student._id !== id);
    setStudents(deleteItem);
  };

  const sharedData = {
    users,
    setUsers,
    teachers,
    setTeachers,
    students,
    setStudents,
    todos,
    setTodos,
    addTeacher,
    editTeacher,
    deleteTeacher,
    addStudent,
    editStudent,
    deleteStudent,
  };

  // rendering component
  return (
    <Context.Provider value={sharedData}>{props.children}</Context.Provider>
  );
};
