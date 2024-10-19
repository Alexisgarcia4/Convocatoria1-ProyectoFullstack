import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonAlert,
  IonImg, // Importamos IonImg para mostrar la imagen
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";

const ListadoTareas: React.FC = () => {
  const history = useHistory();
  const { idProyecto } = useParams<{ idProyecto: string }>(); // Recibimos el ID del proyecto desde la URL

  const [tareas, setTareas] = useState([]); // Estado para almacenar las tareas obtenidas del backend
  const [filtroPrioridad, setFiltroPrioridad] = useState(""); // Estado para el filtro de prioridad
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado (hecha o pendiente)
  const [ordenFecha, setOrdenFecha] = useState("asc"); // Estado para el orden de las fechas (ascendente o descendente)
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta de eliminación
  const [tareaAEliminar, setTareaAEliminar] = useState<number | null>(null); // Estado para almacenar la tarea a eliminar
  const [mensajeError, setMensajeError] = useState(""); // Estado para mostrar mensajes de error
  const token = localStorage.getItem("token"); // Obtenemos el token almacenado en el localStorage para autenticación

  // Función para obtener las tareas del backend
  const obtenerTareas = async () => {
    try {
      const response = await axios.get(
        `http://${localStorage.getItem(
          "url"
        )}:8080/api/tareas/proyecto/${idProyecto}?prioridad=${filtroPrioridad}&hecha=${filtroEstado}&orden=${ordenFecha}`
      );
      setTareas(response.data); // Guardamos las tareas en el estado
      setMensajeError(""); // Reiniciamos el mensaje de error en caso de éxito
    } catch (error) {
      console.error("Error al obtener las tareas", error);
      setMensajeError("Tareas no encontradas con esos filtros"); // Mostramos mensaje de error
    }
  };

  // Función para definir el color del título según la prioridad de la tarea
  const colorFondo = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "red";
      case "media":
        return "blue";
      case "baja":
        return "green";
      default:
        return "";
    }
  };

  // obtener las tareas cuando cambian los filtros o el proyecto
  useEffect(() => {
    obtenerTareas(); // Llamamos a obtenerTareas cuando cambian los filtros o el idProyecto
  }, [filtroEstado, filtroPrioridad, ordenFecha, idProyecto]);

  // Función para eliminar una tarea
  const eliminarTarea = async (id: number) => {
    try {
      await axios.delete(
        `http://${localStorage.getItem("url")}:8080/api/tareas/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añadir el token en la solicitud de eliminación
          },
        }
      );
      console.log(`Tarea con id ${id} eliminada correctamente.`);
      obtenerTareas(); 
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
    }
  };

  // Función para mostrar el mensaje de confirmación antes de eliminar una tarea
  const confirmarEliminarTarea = (id: number) => {
    setTareaAEliminar(id); // Guardamos el id de la tarea a eliminar
    setShowAlert(true); // Mostramos la alerta
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Tareas de {localStorage.getItem("nombreUsuario")}
          </IonTitle>
          <ProfileMenu />
        </IonToolbar>

        
        

       
        <IonToolbar>
          
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginBottom: "5px",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>
              Prioridad
            </span>
            <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>Estado</span>
            <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>Fecha</span>
          </div>

          
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
           
            <IonItem
              style={{
                "--background": "#34495e",
                color: "#ffffff",
                borderRadius: "5px",
                maxWidth: "90px",
                "--padding-start": "10px",
              }}
            >
              <IonSelect
                value={filtroPrioridad}
                onIonChange={(e) => setFiltroPrioridad(e.detail.value)}
                
                style={{ color: "#ffffff", fontSize: "0.7rem" }}
              >
                <IonSelectOption value="">Todas</IonSelectOption>
                <IonSelectOption value="alta">Alta</IonSelectOption>
                <IonSelectOption value="media">Media</IonSelectOption>
                <IonSelectOption value="baja">Baja</IonSelectOption>
              </IonSelect>
            </IonItem>

           
            <IonItem
              style={{
                "--background": "#34495e",
                color: "#ffffff",
                borderRadius: "5px",
                maxWidth: "90px",
                "--padding-start": "10px",
              }}
            >
              <IonSelect
                value={filtroEstado}
                onIonChange={(e) => setFiltroEstado(e.detail.value)}
                
                style={{ color: "#ffffff", fontSize: "0.7rem" }}
              >
                <IonSelectOption value="">Todos</IonSelectOption>
                <IonSelectOption value="true">Hecha</IonSelectOption>
                <IonSelectOption value="false">Pendiente</IonSelectOption>
              </IonSelect>
            </IonItem>

            
            <IonItem
              style={{
                "--background": "#34495e",
                color: "#ffffff",
                borderRadius: "5px",
                maxWidth: "90px",
                "--padding-start": "10px",
              }}
            >
              <IonSelect
                value={ordenFecha}
                onIonChange={(e) => setOrdenFecha(e.detail.value)}
                
                style={{ color: "#ffffff", fontSize: "0.7rem" }}
              >
                <IonSelectOption value="asc">Asc</IonSelectOption>
                <IonSelectOption value="desc">Des</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      <IonButton
              className="botonPrincipal"
              expand="block"
              onClick={() => {
                history.replace(`/creartarea/${idProyecto}`);
              }}
            >
              Crear Tarea
            </IonButton>
        {/* Mostrar mensaje de error o las tareas */}
        {mensajeError ? (
          <p style={{ textAlign: "center" }}>{mensajeError}</p> // Mostrar mensaje de error si no se encuentran tareas
        ) : tareas.length > 0 ? (
          tareas.map((tarea) => (
            <IonCard key={tarea.id}>
              <IonCardHeader>
                <IonCardTitle
                  style={{
                    color: colorFondo(tarea.prioridad), 
                    fontWeight: "bold",
                  }}
                >
                  {tarea.nombre}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{tarea.mensaje}</p>
                <p><strong>Prioridad:</strong> {tarea.prioridad}</p>
                <p><strong>Estado:</strong> {tarea.hecha ? "Hecha" : "Pendiente"}</p>

                {/* Mostrar la foto de la tarea si existe */}
                {tarea.foto && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <IonImg
                    className="imagen"
                    src={`http://${localStorage.getItem("url")}:8080/${tarea.foto.replace(/\\/g, '/')}`}  // Aseguramos que la URL apunta al servidor
                      alt={`Foto de la tarea ${tarea.id}`}
                      
                    />
                    
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center",gap: "2rem"  ,marginTop:"1rem"}}>
                {/* Botón para editar la tarea */}
                <IonButton

                 className="botonA"
                  size="small"
                  fill="outline"
                  onClick={() =>
                    history.replace(`/editartarea/${tarea.id}/${idProyecto}`)
                  }
                >
                  Editar
                </IonButton>
                {/* Botón para eliminar la tarea */}
                <IonButton
                className="botonE"
                size="small"
                  color="danger"
                  fill="outline"
                  onClick={() => confirmarEliminarTarea(tarea.id)}
                >
                  Eliminar
                </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No se encontraron tareas</p> // Mostrar mensaje si no hay tareas
        )}

        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Confirmar eliminación"}
          message={"¿Estás seguro de que quieres eliminar esta tarea?"}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => setShowAlert(false),
            },
            {
              text: "Eliminar",
              handler: () => {
                if (tareaAEliminar !== null) {
                  eliminarTarea(tareaAEliminar); // Eliminar la tarea si se confirma
                  setTareaAEliminar(null); // Reiniciar el estado de tareaAEliminar
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ListadoTareas;
