# Implementando `NoteStore` y `NoteActions`

Ahora que hemos movido todo lo relacionado con la gestión de los datos al lugar correcto podemos centrarnos en implementar las partes que faltan - `NoteStore` (Almacén de Notas) y `NoteActions` (Acciones sobre las Notas). Ambas encapsularán tanto los datos de la aplicación como la lógica.

No importa qué gestor de estados acabes usando, siempre encontrarás equivalencias en los demás. En Redux puedes usar acciones que provocarán un cambio de estado mediante un reductor. En MobX puedes modelar una acción en una clase ES6. La idea es que manipules los datos dentro de la clase y que ésto provoque que MobX refresque los componentes cuando sea necesario.

La idea aquí es similar: configuraremos acciones que acabarán invocando métodos en el estado que modificarán este estado. Cuando el estado cambia las vistas se actualizan. Para comenzar podemos implementar un `NoteStore` y definir la lógica para manipularlo. Una vez hayamos hecho eso, habremos migrado nuestra aplicación a la arquitectura Flux.

## Configurando un `NoteStore`

De momento mantenemos el estado de la aplicación en `App`. El primer paso para llevarlo a Alt es definir un almacén y utilizar el estado desde allí. Esto romperá con la lógica de nuestra aplicación de forma temporal ya que necesitamos llevar el estado también a Alt. Sin embargo, crear este almacén inicial es un buen paso para cumplir con nuestro objetivo.

Para configurar un almacén necesitamos llevar a cabo tres pasos. Necesitaremos configurarlo, conectarlo con Alt en el `Proveedor` y, finalmente, conectarlo con `App`.

Los almacenes se modelan en Alt usando clases ES6. Aqui tienes una implementación mínima modelada con nuestro estado actual.

**app/stores/NoteStore.js**

```javascript
import uuid from 'uuid';

export default class NoteStore {
  constructor() {
    this.notes = [
      {
        id: uuid.v4(),
        task: 'Apender React'
      },
      {
        id: uuid.v4(),
        task: 'Hacer la Colada'
      }
    ];
  }
}
```

El siguiente paso es conectar el almacén con el `Proveedor`. Es aquí donde el módulo `setup` se vuelve útil:

**app/components/Provider/setup.js**

```javascript
leanpub-start-delete
export default alt => {}
leanpub-end-delete
leanpub-start-insert
import NoteStore from '../../stores/NoteStore';

export default alt => {
  alt.addStore('NoteStore', NoteStore);
}
leanpub-end-insert
```

Podemos ajustar `App` para consumir los datos desde el almacén y así comprobar que lo que hemos hecho funciona. Esto romperá la lógica que tenemos, pero lo arreglaremos en la próxima sección. Cambia `App` como sigue para hacer que `notas` esté disponible:

**app/components/App.jsx**

```javascript
...

class App extends React.Component {
leanpub-start-delete
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Aprender React'
        },
        {
          id: uuid.v4(),
          task: 'Hacer la Colada'
        }
      ]
    }
  }
leanpub-end-delete
  render() {
leanpub-start-delete
    const {notes} = this.state;
leanpub-end-delete
leanpub-start-insert
    const {notes} = this.props;
leanpub-end-insert

    return (
      <div>
leanpub-start-delete
        {this.props.test}
leanpub-end-delete
        <button className="add-note" onClick={this.addNote}>+</button>
        <Notes
          notes={notes}
          onNoteClick={this.activateNoteEdit}
          onEdit={this.editNote}
          onDelete={this.deleteNote}
          />
      </div>
    );
  }
  ...
}

leanpub-start-delete
export default connect(() => ({
  test: 'test'
}))(App)
leanpub-end-delete
leanpub-start-insert
export default connect(({notes}) => ({
  notes
}))(App)
leanpub-end-insert
```

Si refrescas la aplicación verás exactamente lo mismo que antes. Esta vez, sin embargo, estaremos consumiendo los datos desde nuestro almacén. Como resultado nuestra lógica está rota. Esto es algo que tendremos que arreglar más adelante mientras definimos `NoteActions` y llevamos la manipulación del estado a `NoteStore`.

T> Dado que `App` no dependerá más del estado, es posible convertirlo a un componente basado en funciones. A menudo la mayoría de tus componentes estarán basados en funciones precisamente por esta razón. Si no estás utilizando estado o referencias es seguro convertirlos a funciones.

## Entendiendo las Acciones

Las acciones son uno de los conceptos principales de la arquitectura Flux. Para ser exactos, es una buena idea separar **acciones** de **creadores de acciones**. A menudo estos términos son intercambiables, pero hay una diferencia considerable.

Los creadores de acciones son literalmente funciones que *lanzan* acciones. El contenido de la acción será repartido a los almacenes que estén interesados. Puede ser útil pensar en ellos como mensajes dentro de un envoltorio que son repartidos.

Esta división es útil si quieres hacer acciones asíncronas. Puedes, por ejemplo, querer recuperar los datos iniciales de tu tablero Kanban. La operación puede ir bien o ir mal, lo cual te dará tres acciones distintas que lanzar. Puedes lanzar acciones cuando comienzas la consulta y cuando recibes una respuesta.

Todos estos datos son valiosos si te permiten controlar la interfaz del usuario. Puedes mostrar una barra de progreso mientras la consulta se está realizando y actualizar el estado de la aplicación una vez llegan los datos del servidor. Si la consulta falla puedes hacer que el usuario lo sepa.

Este asunto es igual en otros gestores de estados. A menudo modelas una acción como una función que devuelve una función que lanza acciones individuales como puede ser el seguimiento del progreso de las consultas. En un ingenuamente síncrono caso es suficiente con devolver directamente el resultado de la acción.

T> La documentación oficial de Alt cubre las [acciones asíncronas](http://alt.js.org/docs/createActions/) con más detalle.

## Configurando `NoteActions`

Alt tiene un pequeño método de utilidades conocido como `alt.generateActions` que puede generar creadores de acciones simples por nosotros. Estos generadores símplemente enviarán los datos que les pasemos, así que conectaremos estas acciones con los almacenes relevantes. En este caso, estamos hablando del `NoteStore` que definimos anteriormente.

Con respecto a la aplicación, es suficiente con que modelemos las operaciones CRUD básicas (Crear, Leer, Actualizar y Borrar). Podemos saltarnos la lectura ya que es implícita, pero es útil tener las demás disponibles como acciones. Configura `NoteActions` usando `alt.generateActions` como sigue:

**app/actions/NoteActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions('create', 'update', 'delete');
```

Esto no hace mucho por sí mismo, aunque es un buen sitio para conectar las acciones con `App` para poder lanzarlas. Nos empezaremos a preocupar sobre las acciones individuales una vez hagamos que nuestro almacén sea más grande. Modifica `App` del siguiente modo para conectar las acciones:

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';
import connect from '../libs/connect';
leanpub-start-insert
import NoteActions from '../actions/NoteActions';
leanpub-end-insert

class App extends React.Component {
  ...
}

leanpub-start-delete
export default connect(({notes}) => ({
  notes
}))(App)
leanpub-end-delete
leanpub-start-insert
export default connect(({notes}) => ({
  notes
}), {
  NoteActions
})(App)
leanpub-end-insert
```

Esto nos permitirá ejecutar cosas como `this.props.NoteActions.create` para poder lanzar acciones.

## Conectando `NoteActions` con `NoteStore`

Alt facilita un par de formas útiles con las que conectar acciones con almacenes:

* `this.bindAction(NoteActions.CREATE, this.create)` - Enlaza una acción específica con un método específico.
* `this.bindActions(NoteActions)`- Enlaza todas las acciones con métodos por convención. Es decir, la acción `create` se enlazará con un método llamado `create`.
* `reduce(state, { action, data })` - Es posible implementar un método conocido como `reductor`, el cual imita la forma de trabajar de los reductores de Redux. La idea es devolver un nuevo estado basado en el estado actual y unos datos.

Utilizaremos `this.bindActions` en caso de que confiar en la convención sea suficiente. Modifica el almacén como sigue para conectar las acciones y añadir datos iniciales a la lógica:

**app/stores/NoteStore.js**

```javascript
import uuid from 'uuid';
leanpub-start-insert
import NoteActions from '../actions/NoteActions';
leanpub-end-insert

export default class NoteStore {
  constructor() {
leanpub-start-insert
    this.bindActions(NoteActions);
leanpub-end-insert

    this.notes = [
      {
        id: uuid.v4(),
        task: 'Learn React'
      },
      {
        id: uuid.v4(),
        task: 'Do laundry'
      }
    ];
  }
leanpub-start-insert
  create(note) {
    console.log('create note', note);
  }
  update(updatedNote) {
    console.log('update note', updatedNote);
  }
  delete(id) {
    console.log('delete note', id);
  }
leanpub-end-insert
}
```

Para poder verlo en funcionamiento necesitamos conectar nuestras acciones con `App` y adaptar la lógica.

## Migrando `App.addNote` a Flux

`App.addNote` es un buen punto en el que comenzar. El primer paso es lanzar la acción asociada (`NoteActions.create`) desde el método y comprobar si podemos ver algo en la consola del navegador. Si podemos, entonces podemos manipular el estado. Lanza una acción con la siguiente:

**app/components/App.jsx**

```javascript
...

class App extends React.Component {
  render() {
    ...
  }
  addNote = () => {
leanpub-start-delete
    // Es posible escribir esto de forma imperativa, es decir,
    // a través de `this.state.notes.push` y, después,
    // `this.setState({notes: this.state.notes})`.
    //
    // Suelo favorecer el estilo funcional cuando tiene sentido.
    // Incluso cuando es necesario escribir más código, ya que
    // prefiero los beneficios (facilidad para razonar, no
    // efectos colaterales) que trae consigo.
    //
    // Algunas librerias, como Immutable.js, van un paso más allá.
    this.setState({
      notes: this.state.notes.concat([{
        id: uuid.v4(),
        task: 'New task'
      }])
    });
leanpub-end-delete
leanpub-start-insert
    this.props.NoteActions.create({
      id: uuid.v4(),
      task: 'New task'
    });
leanpub-end-insert
  }
  ...
}

...
```

Si refrescas el navegador y pulsas sobre el botón "añadir nota" deberías ver mensajes como el siguiente en la consola del navegador:

```bash
create note Object {id: "62098959-6289-4894-9bf1-82e983356375", task: "New task"}
```

Esto significa que tenemos los datos que necesitamos en el método `create` de `NoteStore`. Aún necesitamos manipular los datos, tras lo cual habremos cerrado el ciclo y deberíamos ver notas nuevas a través de la interfaz de usuario. Aquí Alt tiene un API similar al de React. Considera la siguiente implementación:

**app/stores/NoteStore.js**

```javascript
import uuid from 'uuid';
import NoteActions from '../actions/NoteActions';

export default class NoteStore {
  constructor() {
    ...
  }
  create(note) {
leanpub-start-delete
    console.log('create note', note);
leanpub-end-delete
leanpub-start-insert
    this.setState({
      notes: this.notes.concat(note)
    });
leanpub-end-insert
  }
  ...
}
```

Si intentas añadir una nota, la actualización funcionará. Alt es quien mantiene el estado ahora y la edición se mantiene gracias a la arquitectura que hemos configurado. Todavía tenemos que repetir el proceso para el resto de métodos que faltan para poder completar el trabajo.

## Migrando `App.deleteNote` a Flux

El proceso es exáctamente el mismo para `App.deleteNote`. Necesitamos conectarlo con nuestra acción y adaptar el código. He aquí la parte de `App`:

**app/components/App.jsx**

```javascript
...

class App extends React.Component {
  ...
  deleteNote = (id, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

leanpub-start-delete
    this.setState({
      notes: this.state.notes.filter(note => note.id !== id)
    });
leanpub-end-delete
leanpub-start-insert
    this.props.NoteActions.delete(id);
leanpub-end-insert
  }
  ...
}

...
```

Si refrescas y tratas de borrar una nota verás un mensaje como el siguiente en la consola del navegador:

```bash
delete note 501c13e0-40cb-47a3-b69a-b1f2f69c4c55
```

Para finalizar la migración necesitamos mostrar la lógica de `setState` al método `delete`. Recuerda borrar `this.state.notes` y reemplazarlo simplemente por `this.notes`:

**app/stores/NoteStore.js**

```javascript
import uuid from 'uuid';
import NoteActions from '../actions/NoteActions';

export default class NoteStore {
  ...
  delete(id) {
leanpub-start-delete
    console.log('delete note', id);
leanpub-end-delete
leanpub-start-insert
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
leanpub-end-insert
  }
}
```

Tras este cambio deberías poder borrar notas como antes. Todavía hay un par de métodos que migrar.

## Migrando `App.activateNoteEdit` a Flux

`App.activateNoteEdit` es básicamente una operación de actualización. Necesitamos cambiar el flag `editing` de la nota a `true`, lo cual iniciará el proceso de edición. Como siempre, deberemos migrar `App` primero:

**app/components/App.jsx**

```javascript
...

class App extends React.Component {
  ...
  activateNoteEdit = (id) => {
leanpub-start-delete
    this.setState({
      notes: this.state.notes.map(note => {
        if(note.id === id) {
          note.editing = true;
        }

        return note;
      })
    });
leanpub-end-delete
leanpub-start-insert
    this.props.NoteActions.update({id, editing: true});
leanpub-end-insert
  }
  ...
}

...
```

Si refrescas y tratas de editar una nota verás un mensaje como el siguiente en la consola del navegador:

```bash
update note Object {id: "2c91ba0f-12f5-4203-8d60-ea673ee00e03", editing: true}
```

Todavía necesitamos aplicar el cambio para hacer que esto funcione. La lógica es la misma que la que teniamos anteriormente en `App` con la excepción de que lo hemos generalizado usando `Object.assign`:

**app/stores/NoteStore.js**

```javascript
import uuid from 'uuid';
import NoteActions from '../actions/NoteActions';

export default class NoteStore {
  ...
  update(updatedNote) {
leanpub-start-delete
    console.log('update note', updatedNote);
leanpub-end-delete
leanpub-start-insert
    this.setState({
      notes: this.notes.map(note => {
        if(note.id === updatedNote.id) {
          return Object.assign({}, note, updatedNote);
        }

        return note;
      })
    });
leanpub-end-insert
  }
  ...
}
```

Ahora debería ser posible comenzar a editar notas, aunque si terminas de editarlas verás un error como `Uncaught TypeError: Cannot read property 'notes' of null`. Esto se debe a que nos falta la parte final de la migración: cambiar `App.editNote`.

## Migrando `App.editNote` a Flux

Esta parte final es sencilla. Ya tenemos la lógica que necesitamos, es sólo cuestión de conectar `App.editNote` correctamente con ella. Necesitaremos invocar a nuestro método `update` de una forma adecuada:

**app/components/App.jsx**

```javascript
...

class App extends React.Component {
  ...
  editNote = (id, task) => {
leanpub-start-delete
    this.setState({
      notes: this.state.notes.map(note => {
        if(note.id === id) {
          note.editing = false;
          note.task = task;
        }

        return note;
      })
    });
leanpub-end-delete
leanpub-start-insert
    this.props.NoteActions.update({id, task, editing: false});
leanpub-end-insert
  }
}

...
```

Tras refrescar el navegador deberías ser capaz de modificar tareas de nuevo y la aplicación debería funcionar exactamente igual que antes. Modificar `NoteStore` incluyendo acciones ha provocado una cascada de actualizaciones sobre `App` que han hecho que todo se actualice mediante `setState`, lo que hará que el componente invoque a `render`. Este es el flujo unidireccional de Flux en acción.

Realmente ahora tenemos más código que antes, pero eso no importa. `App` está un poco más limpio y su desarollo es más fácil de continuar como veremos pronto. Lo más importante es que nos hemos apañado para implementar la arquitectura Flux en nuestra aplicación.

T> Nuestra implementación actual es ingenua en el sentido de que no valida parámetros de ninguna forma. Puede ser una buena idea validar la forma de los objetos para evitar problemas durante el desarrollo. [Flow](http://flowtype.org/) facilita una forma gradual de hacerlo. Aparte, puedes hacer tests que prueben el sistema.

### ¿Para qué sirve?

Integrar un gestor de estados supone mucho esfuerzo, pero no es en vano. Ten en cuenta las siguiente preguntas:

1. Supón que quieres almacenar las notas en el `localStorage`. ¿Dónde implementarías esta funcionalidad?. Una aproximación puede ser el módulo `setup` del `Proveedor`.
2. ¿Qué ocurre si tenemos varios componentes que quieran utilizar los datos? Podemos consumirlos usando `connect` y mostrarlos.
3. ¿Qué ocurre si tenemos muchas listas de notas separadas para distintos tipos de tareas?. Podemos crear otro almacén para hacer un seguimiento de esas listas. Ese almacén podrá referenciar las notas por id. Haremos algo parecido en el próximo capítulo.

Adoptar un gestor de estados puede ser útil en el momento en el que tu aplicación React crezca. Esta abstracción tiene el coste de que tienes que escribir más código pero, por otro lado, si lo haces bien, acabarás con algo que será más fácil de razonar y de desarrollar más adelante. Cabe destacar que el flujo unidireccional utilizado por estos sistemas ayudan mucho tanto a la depuración como al testing.

## Conclusión

Hemos visto en este capítulo cómo migrar una aplicación sencilla a una arquitectura Flux. Durante el proceso hemos aprendido más acerca de las **acciones** y los **almacenes** de Flux. Llegados a este punto estamos listos para añadir más funcionalidad a nuestra aplicación. Añadiremos persistencia basada en el `localStorage` a nuestra aplicación y realizaremos una pequeña limpieza por el camino.
