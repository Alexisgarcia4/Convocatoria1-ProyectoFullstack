import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonAlert,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonImg, 
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";
import { Camera, CameraResultType } from "@capacitor/camera"; // Importamos Capacitor Camera para capturar la imagen

const CrearTarea: React.FC = () => {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [hecha, setHecha] = useState(false);
  const [showAlert, setShowAlert] = useState(false);  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [foto, setFoto] = useState<File | null>(null); // Estado para la imagen de la tarea
  const history = useHistory();
  const token = localStorage.getItem("token");

  // Validaciones
  const validarNombreTarea = (nombre: string) => {
    if (!nombre) {
      return "El nombre de la tarea es obligatorio.";
    }
    if (nombre.length < 3) {
      return "El nombre de la tarea debe tener al menos 3 caracteres.";
    }
    if (nombre.length > 50) {
      return "El nombre de la tarea no puede exceder los 50 caracteres.";
    }
    return "";
  };

  const validarDescripcion = (mensaje: string) => {
    if (mensaje && mensaje.length > 250) {
      return "La descripción no puede exceder los 250 caracteres.";
    }
    return "";
  };

  // Función para capturar o seleccionar una foto
  const tomarFoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri, // Usamos URI para obtener la ruta del archivo
      });
      
      // Convertir la URI en un objeto File
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
  
      // Generar un nombre único para la imagen, por ejemplo, usando la fecha y hora actual
      const uniqueName = `foto_${new Date().getTime()}.jpg`;
  
      const file = new File([blob], uniqueName, { type: blob.type });
  
      setFoto(file); // Guardamos el archivo de imagen en el estado
    } catch (error) {
      console.error("Error al tomar la foto", error);
    }
  };

  const crearTarea = async () => {
    // Validar nombre
    const nombreError = validarNombreTarea(nombre);
    if (nombreError) {
      setErrorMessage(nombreError);
      setShowAlert(true);
      return;
    }

    // Validar descripción
    const descripcionError = validarDescripcion(mensaje);
    if (descripcionError) {
      setErrorMessage(descripcionError);
      setShowAlert(true);
      return;
    }

    // Crear un objeto FormData para enviar la imagen y otros datos
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("mensaje", mensaje);
    formData.append("prioridad", prioridad);
    formData.append("hecha", hecha.toString());
    formData.append("proyectoId", idProyecto);
    
    if (foto) {
      formData.append("foto", foto); // Añadimos el archivo de imagen solo si existe
    }

    try {
      await axios.post(
        `http://${localStorage.getItem("url")}:8080/api/tareas`,
        formData, // Enviamos los datos como FormData
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añadir el token a los encabezados
            "Content-Type": "multipart/form-data", // Necesario para enviar archivos
          },
        }
      );

      setSuccessMessage("Tarea creada exitosamente.");

      // Redirigir al listado de tareas después de un breve retraso
      setTimeout(() => {
        history.replace(`/listadotareas/${idProyecto}`);
      }, 2000);
    } catch (error: any) {
      // Detectar si el error es debido a que ya existe una tarea con el mismo nombre
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "Ya tienes una tarea con ese nombre en este proyecto."
      ) {
        setErrorMessage(
          "Ya tienes una tarea con ese nombre en este proyecto. Por favor, elige otro."
        );
      } else {
        setErrorMessage("Error al crear la tarea. Inténtalo nuevamente.");
      }
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Crear Tarea {localStorage.getItem("nombreUsuario")}
          </IonTitle>

          <ProfileMenu />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nombre de la Tarea</IonLabel>
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
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </IonItem>

        {/* Selección de Prioridad */}
        <IonItem>
          <IonLabel>Prioridad</IonLabel>
          <IonSelect
            value={prioridad}
            onIonChange={(e) => setPrioridad(e.detail.value)}
          >
            <IonSelectOption value="alta">Alta</IonSelectOption>
            <IonSelectOption value="media">Media</IonSelectOption>
            <IonSelectOption value="baja">Baja</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Selección de Estado */}
        <IonItem>
          <IonLabel>Hecha</IonLabel>
          <IonToggle
            checked={hecha}
            onIonChange={(e) => setHecha(e.detail.checked)}
          />
        </IonItem>

        {/* Botón para capturar o seleccionar foto */}
        <IonButton
          onClick={tomarFoto}
           className="botonPrincipal"
            expand="block"
        >
          Capturar Foto
        </IonButton>

        {/* Mostrar la foto seleccionada */}
        {foto && (
          <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IonImg
             src={URL.createObjectURL(foto)} alt="Foto seleccionada"
              
              className="imagen"
            />
          </div>

          <IonButton onClick={()=>setFoto(null)} expand="block"
            className="botonElimnar">
            Eliminar Foto
          </IonButton>
        </div>
        )}

        <IonButton
          onClick={crearTarea}
           className="botonPrincipal"
            expand="block"
        >
          Crear Tarea
        </IonButton>

        <IonButton
          expand="block"
           className="botonSecundario"
          onClick={() => history.replace(`/listadotareas/${idProyecto}`)}
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

export default CrearTarea;
