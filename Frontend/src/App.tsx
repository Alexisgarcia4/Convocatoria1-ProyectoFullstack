import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import FormularioUsuario from "./pages/FormularioUsuario"; // Página para crear usuario
import ListadoProyectos from "./pages/ListadoProyectos";  // Página de listado de proyectos
import CrearProyecto from "./pages/CrearProyecto";  // Página para crear proyecto
import EditarProyecto from "./pages/EditarProyecto";  // Página para editar proyecto
import ListadoTareas from "./pages/ListadoTareas";  // Página para listar tareas de un proyecto
import CrearTarea from "./pages/CrearTarea";  // Página para crear tarea
import EditarTarea from "./pages/EditarTarea";  // Página para editar tarea
import EditarUsuario from "./pages/EditarUsuario";  // Página de usuario para modificar perfil
import './theme/global.css';  // Importar CSS global

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        
        <Route exact path="/home">
          <Home />
        </Route>

        {/* Ruta para el formulario de registro de usuario */}
        <Route exact path="/formulariousuario">
          <FormularioUsuario />
        </Route>

        {/* Ruta para el listado de proyectos */}
        <Route exact path="/listadoproyectos">
          <ListadoProyectos />
        </Route>

        {/* Ruta para crear un nuevo proyecto */}
        <Route exact path="/crearproyecto">
          <CrearProyecto />
        </Route>

        {/* Ruta para editar un proyecto */}
        <Route exact path="/editarproyecto/:idProyecto">
          <EditarProyecto />
        </Route>

        {/* Ruta para el listado de tareas de un proyecto */}
        <Route exact path="/listadotareas/:idProyecto">
          <ListadoTareas />
        </Route>

        {/* Ruta para crear una nueva tarea */}
        <Route exact path="/creartarea/:idProyecto">
          <CrearTarea />
        </Route>

        {/* Ruta para editar una tarea existente */}
        <Route exact path="/editartarea/:idTarea/:idProyecto">
          <EditarTarea />
        </Route>

        {/* Ruta para modificar los datos del usuario */}
        <Route exact path="/usuario">
          <EditarUsuario />
        </Route>

        {/* Redirigir a /home si la ruta no coincide */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
