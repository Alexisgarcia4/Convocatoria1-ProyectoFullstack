import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAlert,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons"; 
import axios from "axios";
import { useHistory } from "react-router-dom";
import ProfileMenu from '../components/ProfileMenu';

const ListadoProyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [proyectoAEliminar, setProyectoAEliminar] = useState<number | null>(null);
  const history = useHistory();
  const token = localStorage.getItem("token");

  
  const obtenerProyectos = async () => {
    const idUsuario = localStorage.getItem("idUsuario");
    try {
      const response = await axios.get(
        `http://${localStorage.getItem("url")}:8080/api/proyectos/usuario/${idUsuario}`
      );
      setProyectos(response.data);
    } catch (error) {
      setAlertMessage("Error al obtener los proyectos. Inténtalo más tarde.");
      setShowAlert(true);
    }
  };

 
  const eliminarProyecto = async (idProyecto: number) => {
    
    try {
      await axios.delete(`http://${localStorage.getItem("url")}:8080/api/proyectos/${idProyecto}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token en la solicitud de eliminación
        },
      });
      obtenerProyectos(); 
      setAlertMessage("Proyecto eliminado exitosamente.");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Error al eliminar el proyecto. Inténtalo más tarde.");
      setShowAlert(true);
    }
  };

  
  useEffect(() => {
    obtenerProyectos();
  }, []);

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: "1.2rem" }}>
            Proyectos de {localStorage.getItem("nombreUsuario")}
          </IonTitle>
          
          <ProfileMenu />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
       
        <IonButton
        className="botonPrincipal"  
          expand="block"
          onClick={() => history.replace("/crearproyecto")}
        >
          Crear Proyecto
        </IonButton>

        {/* Lista de proyectos usando IonCard */}
        {proyectos.length>0? proyectos.map((proyecto) => (
            <IonCard key={proyecto.id}>
              <IonCardHeader>
                <IonCardTitle>{proyecto.nombre}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{proyecto.descripcion}</p>
                <div style={{ display: "flex", justifyContent: "space-between" ,marginTop:"1rem"}}>
                 
                  <IonButton
                  className="botonA"
                  size="small"
                    onClick={() => history.replace(`/listadotareas/${proyecto.id}`)}
                    fill="outline"
                    
                  >
                    Tareas
                  </IonButton>

                  
                  <IonButton
                  className="botonA"
                  size="small"
                    onClick={() => history.replace(`/editarproyecto/${proyecto.id}`)}
                    fill="outline"
                    
                  >
                    Editar
                  </IonButton>

                  
                  <IonButton
                  className="botonE"
                  
                  size="small"
                    onClick={() => setProyectoAEliminar(proyecto.id)}
                    fill="outline"
                    color="danger"
                  >
                    Eliminar
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        : <h1 style={{ textAlign: "center" }}>No hay Proyectos</h1>}
        

        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={proyectoAEliminar !== null} 
          onDidDismiss={() => setProyectoAEliminar(null)} 
          header="Confirmación"
          message="¿Estás seguro de que deseas eliminar este proyecto?"
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => setProyectoAEliminar(null),
            },
            {
              text: "Eliminar",
              handler: () => {
                if (proyectoAEliminar !== null) {
                  eliminarProyecto(proyectoAEliminar); 
                }
              },
            },
          ]}
        />

        {/* Alerta para mostrar mensajes (por ejemplo, éxito o error al eliminar) */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Mensaje"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ListadoProyectos;
