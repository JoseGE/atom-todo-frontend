# ATOM FE CHALLENGE - ANGULAR

## Comentarios sobre el desarrollo

### Informacion funcional

Aplicativo util para el registro y gestion de tareas de forma simple y facil.

Funcionalidades logradas:

1. Autenticacion

- Uso de JWT
- Registro de nuevo correo

2. Registro y edición de tarea
3. Listado de tareas
4. Cambio de estatus de tareas
5. Eliminacion de tareas

### Decisión de estructura

Se opto por screaming architecture para tener una estructura que permita entender directamente que hace cada componente en vez de especificar lo que es. Ademas al igual que en el backend se sigue el vertial slicing para agrupar de forma optima las funcionalidades segun su "dominio", en este caso tenemos 'task-management' y 'user-auth'

### Posible ruptura de desacoplamiento

El enfoque principal fue evitar todo lo posible la dependencia entre features. Por un momento con el guard e interceptor podria requerir acoplar 'user-auth' al shared para el uso del servicio de autenticacion. Creo que con la implementacion de una interfaz y la creacion del TOKEN de injeccion fue una buena decision para evitar acoplar user-auth a shared directamente.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
