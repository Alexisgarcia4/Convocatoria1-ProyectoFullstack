import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Home: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  

  const history = useHistory();



  const iniciarSesion = async () => {

    
    if (correo && contrasena) {
      try {
        const response = await axios.post(
          `http://${localStorage.getItem("url")}:8080/api/usuarios/login`,
          {
            correo,
            contrasena,
          }
        );

        // Verificar si la respuesta fue exitosa
        if (response.status === 200 && response.data.usuario) {
          
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("idUsuario", response.data.usuario.id);
          localStorage.setItem("nombreUsuario", response.data.usuario.nombre);
          localStorage.setItem("correoUsuario", response.data.usuario.correo);

          

          history.replace("/listadoproyectos");
          setCorreo("");
          setContrasena("");
        } else {
          setError("Credenciales incorrectas.");
          setShowAlert(true);
        }
      } catch (err) {
        setError("Error al conectar con el servidor.");
        setShowAlert(true);
      }
    } else {
      setError("Por favor, ingresa tu correo y contraseña.");
      setShowAlert(true);
    }
  };

  

  useEffect(() => {
    let apiUrl = "";

    // Verifica si estamos en un dispositivo móvil/emulador
    if (navigator.userAgent.includes("Android")) {
      apiUrl = `10.0.2.2`;
      localStorage.setItem("url", apiUrl);
    } else {
      apiUrl = `localhost`;
      localStorage.setItem("url", apiUrl);
    }
    
    
  }, []);
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión
            
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Correo</IonLabel>
          <input
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Contraseña</IonLabel>
          <input
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </IonItem>

        <IonButton
        className="botonPrincipal"  
          onClick={iniciarSesion}
          
          expand="block"
        >
          Iniciar Sesión
        </IonButton>

        <IonButton
        className="botonSecundario"  
          
          expand="block"
          
          onClick={() => history.replace("/formulariousuario")}
        >
          Crear Usuario
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={error}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;