import React, { useState } from "react"; // Importación de React y el hook useState para manejar el estado

// Componente TodoList para gestionar una lista de tareas pendientes
const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Rehacer el pedido de Medias", completed: false },
    { id: 2, text: "Revisar correos", completed: true },
    { id: 3, text: "Reorganizar la junta con Apit", completed: false },
    { id: 4, text: "Planificar temp invierno 2025", completed: true },
    { id: 5, text: "Charlas con sponsors", completed: false },
  ]);
  // Estado que almacena las tareas iniciales con su respectiva información

  const [newTask, setNewTask] = useState(""); // Estado para manejar la nueva tarea ingresada por el usuario

  // Función para agregar una nueva tarea a la lista
  const handleAddTask = () => {
    if (newTask.trim() !== "") { // Verifica que la tarea no esté vacía antes de agregarla
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]); // Agrega la nueva tarea a la lista con un ID único
      setNewTask(""); // Limpia el input después de agregar la tarea
    }
  };

  // Función para alternar el estado de completado de una tarea
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Función para eliminar una tarea de la lista
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id)); // Filtra las tareas y excluye la que tiene el ID seleccionado
  };


  return (
    <div className="mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-2 text-[#25396f]">Pendientes</h2>
      <p className="text-sm text-[#25396f] mb-4 uppercase">Tareas a completar</p>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-200"
              />
              <span
                className={`${
                  task.completed ? "line-through text-gray-500" : "text-gray-700"
                }`}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition duration-200"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
          className="flex-1 px-3 py-2 bg-gray-100 border rounded focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 w-full lg:w-auto bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
};

export default TodoList;
