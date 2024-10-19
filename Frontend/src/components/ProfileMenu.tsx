import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const ProfileMenu: React.FC = () => {
  const [showPopover, setShowPopover] = useState(false); // Estado para controlar el popover
  const history = useHistory();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.clear();

    // Redirigir a la página de inicio (home)
    history.replace("/home");
  };

  return (
    <>
      {/* Icono de perfil a la derecha que abre el menú */}
      <IonButtons slot="end">
        <IonButton
          style={{
            "--background": "#2c3e50" /* Color personalizado */,
          }}
          onClick={() => setShowPopover(true)}
        >
          <IonIcon icon={personCircleOutline} style={{ fontSize: "3.5rem" }} />
        </IonButton>
      </IonButtons>

      {/* Menú desplegable (IonPopover) */}
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)} // Cierra el popover cuando se hace clic fuera
      >
        <IonList>
          {/* Opción para modificar usuario */}
          <IonItem
            style={{
              "--background": "#ffffff" /* Color personalizado */,
            }}
            button
            onClick={() => {
              setShowPopover(false); // Cerrar el popover
              history.replace("/usuario"); // Navegar a la página de editar usuario
            }}
          >
            <IonLabel>Modificar Usuario</IonLabel>
          </IonItem>

          {/* Opción para ir a la página de Listado de Proyectos */}
          <IonItem style={{
              "--background": "#ffffff" /* Color personalizado */,
            }}
            button
            onClick={() => {
              setShowPopover(false); // Cerrar el popover
              history.replace("/listadoproyectos"); // Navegar a la página de Listado de Proyectos
            }}
          >
            <IonLabel>Mis Proyectos</IonLabel>
          </IonItem>

          {/* Opción para cerrar sesión */}
          <IonItem style={{
              "--background": "#ffffff" /* Color personalizado */,
            }}
            button
            onClick={() => {
              setShowPopover(false); // Cerrar el popover
              handleLogout(); // Llamar a la función de cerrar sesión
            }}
          >
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </>
  );
};

export default ProfileMenu;
