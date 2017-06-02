# Estructurando Proyectos con React

React no fuerza a tener ninguna estructura de proyecto en particular. Lo bueno de ello es que te permite tener la estructura que mejor se adapte a lo que necesites. Lo malo es que no es posible tener una estructura ideal que funcione en todos los proyectos. Por tanto, voy a darte algo de inspiración que podrás usar cuando pienses en estructuras.

## Un Directorio por Concepto

Nuestra aplicación Kanban tiene una estructura plana como la siguiente:

```bash
├── actions
│   ├── LaneActions.js
│   └── NoteActions.js
├── components
│   ├── App.jsx
│   ├── Editable.jsx
│   ├── Lane.jsx
│   ├── Lanes.jsx
│   ├── Note.jsx
│   └── Notes.jsx
├── constants
│   └── itemTypes.js
├── index.jsx
├── libs
│   ├── alt.js
│   ├── persist.js
│   └── storage.js
├── main.css
└── stores
    ├── LaneStore.js
    └── NoteStore.js
```

Es suficiente para nuestro propósito, pero hay algunas alternativas interesantes:

* Un fichero por concepto - Perfecto para prototipos pequeño. Puedes dividirlo a medida que la aplicación se vaya haciendo más seria.
* Un directorio por componente - Es posible dejar componentes en directorios que pasen a ser de su propiedad. Aunque quizá sea la aproximación más pesada, tiene algunas ventajas interesantes que veremos pronto.
* Un directorio por vista - Esta aproximación se vuelve relevante una vez quieres introducir enrutamiento en tu aplicación.


Hay más alternativas pero éstas cubren los casos más comunes. Siempre hay espacio para hacer ajustes en base a las necesidades de tu aplicación.

## Un Directorio por Componente

Si dejamos nuestros componentes en directorios que pasen a ser de su propiedad podemos acabar teniendo algo como esto:

```bash
├── actions
│   ├── LaneActions.js
│   └── NoteActions.js
├── components
│   ├── App
│   │   ├── App.jsx
│   │   ├── app.css
│   │   ├── app_test.jsx
│   │   └── index.js
│   ├── Editable
│   │   ├── Editable.jsx
│   │   ├── editable.css
│   │   ├── editable_test.jsx
│   │   └── index.js
...
│   └── index.js
├── constants
│   └── itemTypes.js
├── index.jsx
├── libs
│   ├── alt.js
│   ├── persist.js
│   └── storage.js
├── main.css
└── stores
    ├── LaneStore.js
    └── NoteStore.js
```

Puede ser más pesada que la solución que tenemos actualmente. Los ficheros *index.js* sirven de punto de entrada para los componentes. Introducen ruido pero simplifican los imports.

Sin embargo, hay algunos beneficios interesantes de esta aproximación:

* Podemos utilizar tecnologías como los Módulos CSS para aplicar estilos en cada componente de forma independiente.
* Dado que cada componente tiene un pequeño "paquete" de sí mismo, puede ser más sencillo sacarlo del proyecto. De este modo puedes crear componentes genéricos en cualquier lugar y utilizarlos en muchas aplicaciones.
* Podemos definir tests unitarios a nivel de componente. Esto te anima a hacer tests, y todavía podemos hacer tests de alto nivel de la aplicación exactamente igual que antes.

Puede ser interesante tratar de dejar las acciones y los almacenes también en `components`. O pueden seguir un esquema de directorios similar. La ventaja de todo esto es que te permiten definir tests unitarios de una forma similar.

Esta configuración no es suficiente si quieres que la aplicación tenga varias vistas. Necesitamos algo más que nos ayude.

T> [gajus/create-index](https://github.com/gajus/create-index) es capaz de generar los ficheros *index.js* automáticamente a medida que vas desarrollando.

## Un Directorio por Vista

Tener varias vistas es un reto por sí mismo. Para comenzar, debes definir un esquema de enrutamiento. [react-router](https://github.com/rackt/react-router) es una solución popular que cumple este propósito. Además de la definición del esquema, necesitarás definir qué quieres mostrar en cada vista. Puedes tener vistas separadas para la página principal de tu aplicación, otra para el registro, el tablero de Kanban, etc, enlanzándolas con cada ruta.

Estos requisitos implican nuevos conceptos que deben ser introducidos en nuestra estructura. Una forma de lidiar con el enrutado es crear un componente `Routes` que coordine qué vista hay que mostrar en base a la ruta actual. En lugar de `App` podemos tener varias vistas en su lugar. He aquí el aspecto que podría tener una posible estructura:

```bash
├── components
│   ├── Note
│   │   ├── Note.jsx
│   │   ├── index.js
│   │   ├── note.css
│   │   └── note_test.jsx
│   ├── Routes
│   │   ├── Routes.jsx
│   │   ├── index.js
│   │   └── routes_test.jsx
│   └── index.js
...
├── index.jsx
├── main.css
└── views
    ├── Home
    │   ├── Home.jsx
    │   ├── home.css
    │   ├── home_test.jsx
    │   └── index.js
    ├── Register
    │   ├── Register.jsx
    │   ├── index.js
    │   ├── register.css
    │   └── register_test.jsx
    └── index.js
```

La idea es la misma que antes, aunque esta vez tenemos más partes que coordinar. La aplicación comienza desde `index.jsx`, que invocará `Routes`, que decidirá qué vista mostrar, Tras esto el flujo sigue como hasta ahora.

Esta estructura puede escalar mejor, pero también tiene sus límites. Una vez el proyecto comience a crecer puede que quieras introducir nuevos componentes en él. Puede ser natural introducir un concepto, como "funcionalidad", entre las vistas y los componentes.

Por ejemplo, puede que quieras tener un `LoginModal` resultón que se muestre en ciertas vistas sólo si la sesión del usuario ha caducado. Puede estar compuesto por componentes de más bajo nivel. De nuevo, las características comunes pueden ser desplazadas fuera del proyecto como paquetes si ves que tienen potencial para ser reusadas.

## Conclusión

No hay una forma única de estructurar tu proyecto con React. Dicho esto, es uno de esos aspectos en los que merece la pena pensar. Encontrar una estructura que nos ayude merece la pena. Una estructura clara ayuda al mantenimiento y hace que tu proyecto sea más entendible por otros.

Puedes hacer que la estructura evolucione a medida que avanzas. Las estructuras muy pesadas puede que te retrasen. A medida que el proyecto evoluciona, debe hacerlo también su estructura. Es una de esas cosas en las que merece la pena meditar acerca de cómo afecta al desarrollo.
