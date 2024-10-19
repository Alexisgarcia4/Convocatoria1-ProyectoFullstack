import React, { useState, useEffect } from "react";
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
import { Camera, CameraResultType } from "@capacitor/camera"; // Importamos Capacitor Camera para la captura de la imagen
const token = localStorage.getItem("token");

const EditarTarea: React.FC = () => {
  const { idTarea } = useParams<{ idTarea: string }>();
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [hecha, setHecha] = useState(false);
  const [foto, setFoto] = useState<File | null>(null); // Estado para almacenar la foto de la tarea
  const [fotoPrevia, setFotoPrevia] = useState<string | null>(null); // Para la vista previa de la foto
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado para controlar la alerta de confirmación
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();
  const [fotoEliminada, setFotoEliminada] = useState(false); // Estado para controlar si la foto ha sido eliminada

  const obtenerTarea = async () => {
    try {
      const response = await axios.get(
        `http://${localStorage.getItem("url")}:8080/api/tareas/${idTarea}`
      );
      const tarea = response.data;
      setNombre(tarea.nombre);
      setMensaje(tarea.mensaje);
      setPrioridad(tarea.prioridad);
      setHecha(tarea.hecha);
      (tarea.foto&&setFotoPrevia(`http://${localStorage.getItem("url")}:8080/${tarea.foto}`)); // Cargamos la URL de la foto actual)
      
    } catch (error) {
      setErrorMessage("Error al obtener los detalles de la tarea.");
      setShowAlert(true);
    }
  };

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

  // Captura de foto y conversión a File
  const tomarFoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri, // Obtenemos la imagen como URI
      });

      // Convertir la URI en un objeto File
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      const file = new File([blob], `foto_${Date.now()}.jpg`, {
        type: blob.type,
      });
      setFoto(file); // Guardamos la nueva imagen capturada en el estado como File
      setFotoPrevia(URL.createObjectURL(file)); // Para mostrar la vista previa
    } catch (error) {
      console.error("Error al tomar la foto", error);
    }
  };

  const modificarTarea = async () => {
    const nombreError = validarNombreTarea(nombre);
    if (nombreError) {
      setErrorMessage(nombreError);
      setShowAlert(true);
      return;
    }

    const descripcionError = validarDescripcion(mensaje);
    if (descripcionError) {
      setErrorMessage(descripcionError);
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("mensaje", mensaje);
    formData.append("prioridad", prioridad);
    formData.append("hecha", hecha.toString());
    formData.append("proyectoId", idProyecto);

    if (foto) {
      formData.append("foto", foto); // Solo enviamos la foto si hay una nueva seleccionada
    }

    try {
      // Si la foto ha sido eliminada
      if (fotoEliminada) {
        await axios.put(
          `http://${localStorage.getItem(
            "url"
          )}:8080/api/tareas/${idTarea}/eliminarfoto`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Guardar los demás cambios de la tarea
      await axios.put(
        `http://${localStorage.getItem("url")}:8080/api/tareas/${idTarea}`,
        formData, // Enviamos el FormData con la imagen y otros campos
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Indicamos que es una solicitud con archivos
          },
        }
      );

      setSuccessMessage("Tarea actualizada exitosamente.");
      setTimeout(() => {
        history.replace(`/listadotareas/${idProyecto}`);
      }, 2000);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "El nombre ya está en uso para otra tarea en este proyecto. Por favor, elige otro."
      ) {
        setErrorMessage(
          "El nombre ya está en uso para otra tarea en este proyecto. Por favor, elige otro."
        );
      } else {
        setErrorMessage("Error al actualizar la tarea. Inténtalo nuevamente.");
      }
      setShowAlert(true);
    }
  };

  const confirmarEliminarFoto = () => {
    setConfirmDelete(true); // Activamos la alerta de confirmación
  };

  const eliminarFoto = () => {
    setFoto(null); // Quitamos la imagen actual
    setFotoPrevia(null); // Ocultamos la vista previa de la imagen
    setFotoEliminada(true); // Marcamos que la foto ha sido eliminada
    setConfirmDelete(false); // Ocultamos la alerta de confirmación
  };

  useEffect(() => {
    obtenerTarea();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Editar Tarea {localStorage.getItem("nombreUsuario")}
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

        <IonItem>
          <IonLabel>Hecha</IonLabel>
          <IonToggle
            checked={hecha}
            onIonChange={(e) => setHecha(e.detail.checked)}
          />
        </IonItem>

        {!fotoPrevia ? (
          <IonButton
            onClick={tomarFoto}
            className="botonPrincipal"
            expand="block"
          >
            Subir Foto
          </IonButton>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IonImg
                src={fotoPrevia} // Mostramos la vista previa de la foto
               
                className="imagen"
              />
            </div>
            <IonButton
              onClick={tomarFoto}
              className="botonPrincipal"
              expand="block"
            >
              Cambiar Foto
            </IonButton>
            <IonButton
              onClick={confirmarEliminarFoto}
              expand="block"
              className="botonElimnar"
            >
              Eliminar Foto
            </IonButton>
          </div>
        )}

        <IonButton
          onClick={modificarTarea}
          className="botonPrincipal"
          expand="block"
        >
          Guardar Cambios
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          className="botonSecundario"
          onClick={() => history.replace(`/listadotareas/${idProyecto}`)}
        >
          Volver
        </IonButton>

        <IonAlert
          isOpen={!!errorMessage}
          onDidDismiss={() => setErrorMessage("")}
          header="Error"
          message={errorMessage}
          buttons={["OK"]}
        />

        <IonAlert
          isOpen={!!successMessage}
          onDidDismiss={() => setSuccessMessage("")}
          header="Éxito"
          message={successMessage}
          buttons={["OK"]}
        />

        {/* Alerta de confirmación de eliminación de la foto */}
        <IonAlert
          isOpen={confirmDelete}
          onDidDismiss={() => setConfirmDelete(false)}
          header={"Confirmar Eliminación"}
          message={"¿Estás seguro de que deseas eliminar la foto?"}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setConfirmDelete(false);
              },
            },
            {
              text: "Eliminar",
              handler: eliminarFoto, // Llamamos a la función que elimina la foto
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditarTarea;
