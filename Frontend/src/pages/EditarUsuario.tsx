import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton,IonItem, IonLabel,IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ProfileMenu from '../components/ProfileMenu';

const EditarUsuario: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showAlert, setShowAlert] = useState(false);  // Estado para mostrar la alerta de éxito
  const [errorMessage, setErrorMessage] = useState('');  // Estado para mostrar el mensaje de error
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Estado para mostrar la alerta de confirmación de eliminación
  const history = useHistory();
  const token = localStorage.getItem('token');

  const nombreUsuario = localStorage.getItem('nombreUsuario')||"";
    const correoUsuario = localStorage.getItem('correoUsuario')||"";
  // Obtener los datos del usuario desde localStorage al montar el componente
  useEffect(() => {
    

    
      setNombre(nombreUsuario);
    
   
      setCorreo(correoUsuario);
    
  }, []);

  // Manejar el envío del formulario para modificar nombre y correo
  const modificarNombreCorreo = async () => {
    
    const idUsuario = localStorage.getItem('idUsuario'); // Obtener el ID del usuario
    

    try {
      
      const response = await axios.put(`http://${localStorage.getItem("url")}:8080/api/usuarios/${idUsuario}`, {
        nombre,
        correo,
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token en los encabezados
        },
      });

      if (response.status === 200) {
        
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('correoUsuario', correo);

        
        setShowAlert(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400 && error.response.data.message === "El correo ya está en uso. Por favor, elija otro.") {
        setErrorMessage("El correo ya está en uso. Por favor, elija otro.");
      } else {
        setErrorMessage("Hubo un error al actualizar los datos.");
      }
    }
  };

  // Manejar el envío del formulario para cambiar la contraseña
  const modificarContraseña = async () => {
    
    const idUsuario = localStorage.getItem('idUsuario'); // Obtener el ID del usuario
    
    // Validar que las contraseñas no estén vacías y coincidan
    if (contrasenaNueva && confirmarContrasena && contrasenaNueva === confirmarContrasena) {
      try {
        
        const response = await axios.put(`http://${localStorage.getItem("url")}:8080/api/usuarios/${idUsuario}`, {
          contrasena:contrasenaNueva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añadir el token en los encabezados
          },
        });

        if (response.status === 200) {
          
          setShowAlert(true);
        }
      } catch (error) {
        setErrorMessage("Error al cambiar la contraseña.");
      }
    } else {
      setErrorMessage("Las contraseñas no coinciden o están vacías.");
    }
  };
// Método para eliminar usuario
const eliminarUsuario = async () => {
  const idUsuario = localStorage.getItem('idUsuario'); // Obtener el ID del usuario

  try {
    await axios.delete(`http://${localStorage.getItem("url")}:8080/api/usuarios/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Añadir el token en los encabezados
      },
    });

    // Limpiar localStorage y redirigir al login después de eliminar la cuenta
    localStorage.clear();
    history.replace('/home'); // Redirigir a la página de inicio de sesión
  } catch (error) {
    setErrorMessage("Error al eliminar la cuenta.");
  }
};
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Editar: {nombreUsuario}
          </IonTitle>
           
           <ProfileMenu />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        <IonItem>
        <IonLabel position="floating">Nombre</IonLabel>
            <input
              
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </IonItem>

          <IonItem>
          <IonLabel position="floating">Correo</IonLabel>
            <input
             
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </IonItem>

          <IonButton onClick={modificarNombreCorreo} expand="block" className="botonPrincipal" >
            Guardar Datos
          </IonButton>
        

        {/* Alerta de confirmación de éxito */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Éxito'}
          message={'Los datos han sido actualizados correctamente.'}
          buttons={['OK']}
        />

        {/* Alerta de error */}
        <IonAlert
          isOpen={!!errorMessage}  
          onDidDismiss={() => setErrorMessage('')}
          header={'Error'}
          message={errorMessage}
          buttons={['OK']}
        />

        
        <h3 style={{ marginTop: '2rem' }}>Cambiar Contraseña</h3>
        
        <IonItem>
          <IonLabel position="floating">Nueva Contraseña</IonLabel>
            <input
              
              type="password"
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </IonItem>

          <IonItem>
          <IonLabel position="floating">Confirmar Contraseña</IonLabel>
            <input
              
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </IonItem>

          <IonButton onClick={modificarContraseña} expand="block" className="botonPrincipal" >
            Cambiar Contraseña
          </IonButton>

          <IonButton
         
          onClick={() => setShowDeleteConfirm(true)} // Mostrar confirmación antes de eliminar
          expand="block"
          className="botonElimnar"
          
        >
          Eliminar Cuenta
        </IonButton>
        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={showDeleteConfirm}
          onDidDismiss={() => setShowDeleteConfirm(false)}
          header={'Confirmación'}
          message={'¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowDeleteConfirm(false)
            },
            {
              text: 'Eliminar',
              handler: eliminarUsuario
            }
          ]}
        />

        <IonButton
          expand="block"
          
          className="botonSecundario"
          onClick={() => history.replace('/listadoproyectos')}
        >
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditarUsuario;
