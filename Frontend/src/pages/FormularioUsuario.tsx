import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const FormularioUsuario: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  // Validación de correo
  const validarCorreo = (correo: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(correo).toLowerCase());
  };

  const crearUsuario = async () => {
    
   
    if (nombre && correo && contrasena) {
      if (!validarCorreo(correo)) {
        setError('Por favor, ingresa un correo válido.');
        setShowAlert(true);
        return;
      }
  
      if (contrasena.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setShowAlert(true);
        return;
      }
      
      try {
        const response = await axios.post(`http://${localStorage.getItem("url")}:8080/api/usuarios`, {
          nombre,
          correo,
          contrasena,
        });

        if (response.status === 201) {
          setShowAlert(true);
          setError('Usuario creado con éxito.');
          setTimeout(() => {
            history.replace('/home'); 
          }, 2000);
        } else {
          setError('Error al crear el usuario. Inténtalo nuevamente.');
          setShowAlert(true);
        }
      } catch (err: any) {
        // Comprobar si el error es debido a que el correo ya está en uso
        if (err.response && err.response.status === 400 && err.response.data.message === "El correo ya está en uso.") {
            setError('El correo ya está en uso. Por favor, elige otro.');
          } else {
            setError('Error al conectar con el servidor.');
          }
          setShowAlert(true);
        }
      } else {
        setError('Por favor, completa todos los campos.');
        setShowAlert(true);
      }
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
       
        
          <IonItem>
            <IonLabel position="floating">Nombre</IonLabel>
            <input
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Correo</IonLabel>
            <input
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <input
              style={{ marginTop: '1.5rem', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </IonItem>

          <IonButton  onClick={crearUsuario} className="botonPrincipal"  expand="block">
            Crear Usuario
          </IonButton>
        

       
        <IonButton
          className="botonSecundario" 
          expand="block"
          
          onClick={() => history.replace('/home')}
        >
          Volver a Inicio
        </IonButton>

        {/* Alerta para mostrar mensajes de error o éxito */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Mensaje"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default FormularioUsuario;
