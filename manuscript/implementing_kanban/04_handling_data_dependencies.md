# Gestionado Dependencias de Datos

Hasta ahora hemos desarrollado una aplicación que mantiene las notas en el `localStorage`. Para hacer algo más parecido a Kanban necesitamos modelar el concepto de `Carril`. Un `Carril` es algo que debe ser capaz de almacenar muchas notas y conocer su orden. Una forma de modelar esto es simplemente crear un `Carril` que contenga un array de identificadores de `Nota`.

Sin embargo, esta relación puede invertirse. Una `Nota` puede tener referencia a un `Carril` utilizando un identificador y almacenando cuál es su posición dentro del `Carril`. En nuestro caso vamos a utilizar el primer enfoque ya que permite reordenar con más facilidad.

## Definiendo `Carriles`

Como hicimos anteriormente, podemos utilizar la idea de tener dos componentes aquí. Habrá un componente de más alto nivel (en este caso `Carriles`) y otro de más bajo nivel (`Carril`). El componente de más alto nivel se encargará de la ordenación de los carriles. Un `Carril` se renderizará a sí mismo y tendrá las reglas de manipulación básicas.

Al igual que con `Notas`, vamos a necesitar un conjunto de acciones. De momento es suficiente con crear nuevos carriles así que podemos crear la acción correspondiente como sigue:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions('create');
```

Además vamos a necesitar un `LaneStore` (almacén de carriles) y un método para poder crearlos. La idea es muy similar al `NoteStore` que teníamos anteriormente. La función `create` añadirá un nuevo carril a la lista de carriles. Tras ello, el cambio se propagará a los listeners (es decir, a `FinalStore` y sus componentes).

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    // Si no hay notas creamos un array vacío
    lane.notes = lane.notes || [];

    this.setState({
      lanes: this.lanes.concat(lane)
    });
  }
}
```

Para unir `LaneStore` con nuestra aplicación usaremos `setup`:

**app/components/Provider/setup.js**

```javascript
import storage from '../../libs/storage';
import persist from '../../libs/persist';
import NoteStore from '../../stores/NoteStore';
leanpub-start-insert
import LaneStore from '../../stores/LaneStore';
leanpub-end-insert

export default alt => {
  alt.addStore('NoteStore', NoteStore);
leanpub-start-insert
  alt.addStore('LaneStore', LaneStore);
leanpub-end-insert

  persist(alt, storage(localStorage), 'app');
}
```

También necesitaremos un contenedor en el que mostrar nuestros carriles:

**app/components/Lanes.jsx**

```javascript
import React from 'react';
import Lane from './Lane';

export default ({lanes}) => (
  <div className="lanes">{lanes.map(lane =>
    <Lane className="lane" key={lane.id} lane={lane} />
  )}</div>
)
```

Finalmente crearemos un pequeño esqueleto para `Carril` con el que asegurarnos que nuestra aplicación no se cuelga cuando conectamos `Carriles` con ella. Más adelante moveremos aquí mucha de la lógica que ahora está presente en `App`:

**app/components/Lane.jsx**

```javascript
import React from 'react';

export default ({lane, ...props}) => (
  <div {...props}>{lane.name}</div>
)
```

## Conectando `Carriles` con `App`

El paso siguiente es hacer hueco para `Carriles` en `App`. Simplemente reemplazaremos las referencias a `Notas` por `Carriles` y configuraremos las acciones de carriles y su almacén, lo que significa que mucho código antiguo desaparecerá. Cambia `App` por el código siguiente:

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import Lanes from './Lanes';
import LaneActions from '../actions/LaneActions';

const App = ({LaneActions, lanes}) => {
  const addLane = () => {
    LaneActions.create({
      id: uuid.v4(),
      name: 'New lane'
    });
  };

  return (
    <div>
      <button className="add-lane" onClick={addLane}>+</button>
      <Lanes lanes={lanes} />
    </div>
  );
};

export default connect(({lanes}) => ({
  lanes
}), {
  LaneActions
})(App)
```

Si pruebas esta implementación en el navegador verás que no hace mucho. Deberías poder añadir nuevos carriles en el Kanban y poder ver el texto "New lane" (nuevo carril) pero eso es todo. Para recuperar la funcionalidad que teníamos con las notas tendremos que centrarnos en modelar `Carril` más adelante.

## Modelando `Carril`

`Carril` mostrará un nombre y `Notas` asociadas. El ejemplo que sigue tiene muchos cambios desde nuestra implementación inicial de `App`. Cambia el contenido del fichero y déjalo como sigue:

**app/components/Lane.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import Notes from './Notes';

const Lane = ({
  lane, notes, NoteActions, ...props
}) => {
  const editNote = (id, task) => {
    NoteActions.update({id, task, editing: false});
  };
  const addNote = e => {
    e.stopPropagation();

    const noteId = uuid.v4();

    NoteActions.create({
      id: noteId,
      task: 'New task'
    });
  };
  const deleteNote = (noteId, e) => {
    e.stopPropagation();

    NoteActions.delete(noteId);
  };
  const activateNoteEdit = id => {
    NoteActions.update({id, editing: true});
  };

  return (
    <div {...props}>
      <div className="lane-header">
        <div className="lane-add-note">
          <button onClick={addNote}>+</button>
        </div>
        <div className="lane-name">{lane.name}</div>
      </div>
      <Notes
        notes={notes}
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
};

export default connect(
  ({notes}) => ({
    notes
  }), {
    NoteActions
  }
)(Lane)
```

Si ejecutas la aplicación e intentas añadir notas nuevas verás que algo va mal. Cada nota que añades es compartida por todos los carriles. Si se modifica una nota, los otros carriles se modifican también.

![Duplicar notas](images/kanban_01.png)

El motivo de por qué ocurre esto es sencillo. Nuestro `NoteStore` es un singleton, lo que significa que todos los componentes que estén escuchando `NoteStore` recibirán los mismos datos. Necesitamos resolver este problema de alguna manera.

## Haciendo que `Carriles` sea el Responsable de `Notas`

Ahora mismo nuestro `Carril` sólo contiene un array de objetos. Cada uno de estos objetos conoce su *id* y su *nombre*. Vamos a necesitar algo más sotisficado.

Cada `Carril` necesita saber qué `Notas` le pertenecen. Si un `Carril` contiene un array de identificadores de `Nota` podrá filtrar y mostrar sólo las `Notas` que le pertenecen. En breve implementaremos un esquema que permita esto.

### Entendiendo `attachToLane` (añadir al carril)

Cuando añadimos una nueva `Nota` al sistema usando `addNote`, debemos asegurarnos que está asociada a un `Carril`. Esta asociación puede ser modelada mediante un método, como por ejemplo `LaneActions.attachToLane({laneId: <id>, noteId: <id>})`. He aquí un ejemplo de cómo podría funcionar.

```javascript
const addNote = e => {
  e.stopPropagation();

  const noteId = uuid.v4();

  NoteActions.create({
    id: noteId,
    task: 'New task'
  });
  LaneActions.attachToLane({
    laneId: lane.id,
    noteId
  });
}
```

Esta es sólo una forma de gestionar `noteId`. Podemos llevar la lógica de generación a `NoteActions.create` y devolver el identificador generado desde allí. Podemos hacerlo mediante una [Promesa](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), lo cual puede ser muy útil si añadimos un backend a nuestra implementación. Así es como quedaría:

```javascript
const addNote = e => {
  e.stopPropagation();

  NoteActions.create({
    task: 'New task'
  }).then(noteId => {
    LaneActions.attachToLane({
      laneId: lane.id,
      noteId: noteId
    });
  })
}
```

Hemos declarado una dependencia clara entre `NoteActions.create` y `LaneActions.attachToLane`. Esto podría ser una alternativa válida si, especialmente, quieres llevar la implementación más lejos.

T> Puedes modelar el API usando parámetros de forma posicional y terminar teniendo `LaneActions.attachToLane(laneId, note.id)`. Yo prefiero pasar el objeto porque se lee bien y no hay que tener cuidado con el orden.

T> Otra forma de gestionar el problema de la dependencia puede ser utilizar una característica del dispacher de Flux conocida como [waitFor](http://alt.js.org/guide/wait-for/). Es mejor evitarlo si puedes. Además, gestores de estado como Redux hacen que sea redundante. Usar `Promesas` como antes nos puede ayudar.

### Configurando `attachToLane`

Para comenzar debemos añadir `attachToLane` a las acciones como hicimos antes:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'attachToLane'
);
```

Para poder implementar `attachToLane` tenemos que buscar un carril que coincida con el identificador del carril que hemos recibido y asociarle el identificador de la nota. Es más, cada nota sólo debe pertenecer a un carril cada vez. Podemos hacer una pequeña comprobación:

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  ...
leanpub-start-insert
  attachToLane({laneId, noteId}) {
    this.setState({
      lanes: this.lanes.map(lane => {
        if(lane.notes.includes(noteId)) {
          lane.notes = lane.notes.filter(note => note !== noteId);
        }

        if(lane.id === laneId) {
          lane.notes = lane.notes.concat([noteId]);
        }

        return lane;
      })
    });
  }
leanpub-end-insert
}
```

Ser únicamente capaz de incluir notas en un carril no es suficiente. También vamos a necesitar poder sacarlas, lo cual ocurre cuando borramos notas.

T> En este punto podemos mostrar un mensaje de advertencia cuando tratemos de incluir una nota en un carril que no exista. `console.warn` será tu amigo en este caso.

### Configurando `detachFromLane`

Podemos modelar de forma parecida la operación contraria `detachFromLane` usando un API como el siguiente:

```javascript
LaneActions.detachFromLane({noteId, laneId});
NoteActions.delete(noteId);
```

T> Al igual que con `attachToLane`, podemos modelar el API usando parámetros de forma posicional para dejarlo de este modo: `LaneActions.detachFromLane(laneId, noteId)`.

De nuevo debemos configurar la acción:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'attachToLane', 'detachFromLane'
);
```

La implementación se parece a `attachToLane`. En este caso, borraremos las notas que se puedan encontrar dentro.

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  ...
leanpub-start-insert
  detachFromLane({laneId, noteId}) {
    this.setState({
      lanes: this.lanes.map(lane => {
        if(lane.id === laneId) {
          lane.notes = lane.notes.filter(note => note !== noteId);
        }

        return lane;
      })
    });
  }
leanpub-end-insert
}
```

Dado que tenemos la lógica en su lugar, podemos comenzar la conexión con la interfaz de usuario.

T> Es posible que `detachFromLane` no desvincule nada. Si se detecta este caso puede ser una buena idea usar  `console.warn` para hacer consciente al desarrollador de lo que ocurre.

### Conectando `Carril` con la Lógica

Para hacer que esto funcione necesitamos hacer cambios en un par de sitios:

* Cuando añadimos una nota, necesitamos **vincularla** con el carril actual.
* Cuando borramos una nota, necesitamos **desvincularla** del carril actual.
* Cuando renderizamos un carril necesitamos **seleccionar** las notas que le pertenecen. Es importante renderizar las notas en el orden en el cual pertenezcan al carril. Esto requiere de algo de lógica extra.

Estos cambios implican modificar `Carril` como sigue:

**app/components/Lane.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
leanpub-start-insert
import LaneActions from '../actions/LaneActions';
leanpub-end-insert
import Notes from './Notes';

const Lane = ({
leanpub-start-delete
  lane, notes, NoteActions, ...props
leanpub-end-delete
leanpub-start-insert
  lane, notes, LaneActions, NoteActions, ...props
leanpub-end-insert
}) => {
  const editNote = (id, task) => {
    ...
  };
  const addNote = e => {
    e.stopPropagation();

    const noteId = uuid.v4();

    NoteActions.create({
      id: noteId,
      task: 'New task'
    });
leanpub-start-insert
    LaneActions.attachToLane({
      laneId: lane.id,
      noteId
    });
leanpub-end-insert
  };
  const deleteNote = (noteId, e) => {
    e.stopPropagation();

leanpub-start-insert
    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    });
leanpub-end-insert
    NoteActions.delete(noteId);
  };
  const activateNoteEdit = id => {
    NoteActions.update({id, editing: true});
  };

  return (
    <div {...props}>
      <div className="lane-header">
        <div className="lane-add-note">
          <button onClick={addNote}>+</button>
        </div>
        <div className="lane-name">{lane.name}</div>
      </div>
      <Notes
leanpub-start-delete
        notes={notes}
leanpub-end-delete
leanpub-start-insert
        notes={selectNotesByIds(notes, lane.notes)}
leanpub-end-insert
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
};

leanpub-start-insert
function selectNotesByIds(allNotes, noteIds = []) {
  // `reduce` es un método poderoso que nos permite
  // agrupar datos. Puedes implementar filter` y `map`
  // dentro de él. Nosotros lo estamos usando para
  // concatenar notas cuyos id coincidan
  return noteIds.reduce((notes, id) =>
    // Concatena ids que encajen al resultado
    notes.concat(
      allNotes.filter(note => note.id === id)
    )
  , []);
}
leanpub-end-insert

export default connect(
  ({notes}) => ({
    notes
  }), {
leanpub-start-delete
    NoteActions
leanpub-end-delete
leanpub-start-insert
    NoteActions,
    LaneActions
leanpub-end-insert
  }
)(Lane)
```

Si intentas utilizar la aplicación ahora verás que cada carril es capaz de mantener sus propias notas:

![Separate notes](images/kanban_02.png)

La estructura actual nos permite mantener el singleton y una estructura de datos plana. Lidiar con las referencias es un tanto tedioso, pero es consistente con la arquitectura Flux. Puedes ver el mismo problema en la [implementación con Redux](https://github.com/survivejs-demos/redux-demo). La [implementación con MobX](https://github.com/survivejs-demos/mobx-demo) evita el problema completamente.

T> `selectNotesByIds` pudo haber sido escrita utilizando `map` y `find`. En ese caso podrías haber acabado utilizando `noteIds.map(id => allNotes.find(note => note.id === id));`. Sin embargo, tendrías que haber utilizado el polyfill `find` para que funcione en navegadores viejos.

T> Normalizar los datos puede hacer que `selectNotesByIds` sea trivial. Si estás usando una solución como Redux, la normalización puede hacer fáciles operaciones como ésta.

## Extrayendo `LaneHeader` (Cabecera de Carril) de `Carril`

`Carril` está empezando a ser un componente demasiado grande. Tenemos la oportunidad de partirlo para hacer que nuestra aplicación sea más fácil de mantener. En concreto, la cabecera del carril puede ser un componente por sí mismo. Para comenzar, define `LaneHeader` basándote en el código actual tal y como sigue:

**app/components/LaneHeader.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';

export default connect(() => ({}), {
  NoteActions,
  LaneActions
})(({lane, LaneActions, NoteActions, ...props}) => {
  const addNote = e => {
    e.stopPropagation();

    const noteId = uuid.v4();

    NoteActions.create({
      id: noteId,
      task: 'New task'
    });
    LaneActions.attachToLane({
      laneId: lane.id,
      noteId
    });
  };

  return (
    <div className="lane-header" {...props}>
      <div className="lane-add-note">
        <button onClick={addNote}>+</button>
      </div>
      <div className="lane-name">{lane.name}</div>
    </div>
  );
})
```

Necesitamos conectar el componente que hemos extraido con `Carril`:

**app/components/Lane.jsx**

```javascript
import React from 'react';
leanpub-start-delete
import uuid from 'uuid';
leanpub-end-delete
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import Notes from './Notes';
leanpub-start-insert
import LaneHeader from './LaneHeader';
leanpub-end-insert

const Lane = ({
  lane, notes, LaneActions, NoteActions, ...props
}) => {
  const editNote = (id, task) => {
    NoteActions.update({id, task, editing: false});
  };
leanpub-start-delete
  const addNote = e => {
    e.stopPropagation();

    const noteId = uuid.v4();

    NoteActions.create({
      id: noteId,
      task: 'New task'
    });
    LaneActions.attachToLane({
      laneId: lane.id,
      noteId
    });
  };
leanpub-end-delete
  const deleteNote = (noteId, e) => {
    e.stopPropagation();

    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    });
    NoteActions.delete(noteId);
  };
  const activateNoteEdit = id => {
    NoteActions.update({id, editing: true});
  };

  return (
    <div {...props}>
leanpub-start-delete
      <div className="lane-header">
        <div className="lane-add-note">
          <button onClick={addNote}>+</button>
        </div>
        <div className="lane-name">{lane.name}</div>
      </div>
leanpub-end-delete
leanpub-start-insert
      <LaneHeader lane={lane} />
leanpub-end-insert
      <Notes
        notes={selectNotesByIds(notes, lane.notes)}
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
};

...
```

Tras estos cambios tendremos algo con lo que es un poco más fácil trabajar. Podría haber sido posible mantener todo el código en un único componente. A menudo reflexionarás y te darás cuenta de que hay mejores maneras de dividir tus componentes. A menudo la necesidad de reutilizar o de mejorar el rendimiento serán quienes te fuercen a realizar estas divisiones.

## Conclusión

En este capítulo nos las hemos apañado para resolver el problema de gestión de dependencias de datos. Este problema aparece con frecuencia. Cada gestor de estados tiene su propia manera de lidiar con ello. Las alternativas basadas en Flux y Redux esperan que seas tú quien gestione las referencias. Soluciones como MobX integran la gestión de referencias. La normalización de los datos puede hacer que este tipo de operaciones sean más sencillas.

En el próximo capítulo nos centraremos en añadir una funcionalidad que no tenemos en la aplicación: la edición de carriles. También haremos que la aplicación tenga un mejor aspecto. Por suerte mucha de la lógica que necesitamos ya ha sido desarrollada.
