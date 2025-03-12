import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Cargar la lista de usuarios al montar el componente
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al cargar los usuarios:', error));
  }, []);

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        alert(data.message);

        // Actualizar la lista de usuarios después de eliminar
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error eliminando el usuario:', error);
      }
    }
  };

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
