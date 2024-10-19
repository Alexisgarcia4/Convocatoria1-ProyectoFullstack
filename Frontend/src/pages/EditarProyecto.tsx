import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonContent,
  IonButton,
  IonAlert,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";

const EditarProyecto: React.FC = () => {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();
  const idUsuario = localStorage.getItem("idUsuario");
  const token = localStorage.getItem("token");

  const obtenerProyecto = async () => {
    try {
      const response = await axios.get(
        `http://${localStorage.getItem("url")}:8080/api/proyectos/${idProyecto}`
      );
      const proyecto = response.data;
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
    } catch (error) {
      setErrorMessage("Error al obtener los detalles del proyecto.");
      setShowAlert(true);
    }
  };

    // Validaciones
    const validarNombreProyecto = (nombre: string) => {
      if (!nombre) {
        return 'El nombre del proyecto es obligatorio.';
      }
      if (nombre.length < 3) {
        return 'El nombre del proyecto debe tener al menos 3 caracteres.';
      }
      if (nombre.length > 50) {
        return 'El nombre del proyecto no puede exceder los 50 caracteres.';
      }
      const regex = /^[a-zA-Z0-9\s]+$/; // Permitir solo letras, números y espacios
      if (!regex.test(nombre)) {
        return 'El nombre del proyecto solo puede contener letras, números y espacios.';
      }
      return '';
    };
  
    const validarDescripcion = (descripcion: string) => {
      if (descripcion && descripcion.length > 250) {
        return 'La descripción no puede exceder los 250 caracteres.';
      }
      return '';
    };

  const modificarProyecto = async () => {

       // Validar nombre
       const nombreError = validarNombreProyecto(nombre);
       if (nombreError) {
         setErrorMessage(nombreError);
         setShowAlert(true);
         return;
       }
   
       // Validar descripción
       const descripcionError = validarDescripcion(descripcion);
       if (descripcionError) {
         setErrorMessage(descripcionError);
         setShowAlert(true);
         return;
       }

    try {
      await axios.put(`http://${localStorage.getItem("url")}:8080/api/proyectos/${idProyecto}`, {
        nombre,
        descripcion,
        usuarioId: idUsuario,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token a los encabezados
        }
      });

      setSuccessMessage("Proyecto actualizado exitosamente.");

      setTimeout(() => {
        history.replace("/listadoproyectos");
      }, 2000);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "El nombre del proyecto ya está en uso. Por favor, elige otro nombre."
      ) {
        setErrorMessage(
          "El nombre del proyecto ya está en uso. Por favor, elige otro."
        );
      } else {
        setErrorMessage("Error al actualizar el proyecto.");
      }
      setShowAlert(true);
    }
  };

  useEffect(() => {
    obtenerProyecto();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Proyecto de {localStorage.getItem("nombreUsuario")}
          </IonTitle>

          <ProfileMenu />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nombre del Proyecto</IonLabel>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Descripción</IonLabel>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </IonItem>

        <IonButton
          onClick={modificarProyecto}
          expand="block"
           className="botonPrincipal"
        >
          Guardar Cambios
        </IonButton>

        <IonButton
          expand="block"
          className="botonSecundario"  
          onClick={() => history.replace("/listadoproyectos")}
        >
          Volver
        </IonButton>

        {/* Alerta de error */}
        <IonAlert
          isOpen={!!errorMessage}
          onDidDismiss={() => setErrorMessage("")}
          header="Error"
          message={errorMessage}
          buttons={["OK"]}
        />

        {/* Alerta de éxito */}
        <IonAlert
          isOpen={!!successMessage}
          onDidDismiss={() => setSuccessMessage("")}
          header="Éxito"
          message={successMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditarProyecto;
