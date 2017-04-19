# Implementado Arrastrar y Soltar

Nuestra aplicación de Kanban es casi utilizable. Tiene un buen aspecto y cierta funcionalidad básica. En este capítulo integraremos la funcionalidad de arrastrar y soltar utilizando [React DnD](https://gaearon.github.io/react-dnd/).

Al terminar este capítulo deberías ser capaz de arrastrar notas entre carriles. Aunque parezca sencillo implica realizar algo de trabajo por nuestra parte ya que tendremos que anotar los componentes de la forma correcta y crear la lógica necesaria.

## Configurando eact DnD

Para comenzar necesitaremos conectar React DnD con nuestro proyecto. Vamos a utilizar un backend de arrastrar y soltar basado en el de HTML5. Existen backends específicos para testing y [tacto](https://github.com/yahoo/react-dnd-touch-backend).

Para configurarlo, necesitaremos utilizar el decorador `DragDropContext` y facilitarle el backend de HTML5. Voy a utilizar `compose` de redux para evitar revestimientos innecesarios y mantener el código más limpio:

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
leanpub-start-insert
import {compose} from 'redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
leanpub-end-insert
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

leanpub-start-delete
export default connect(({lanes}) => ({
  lanes
}), {
  LaneActions
})(App)
leanpub-end-delete
leanpub-start-insert
export default compose(
  DragDropContext(HTML5Backend),
  connect(
    ({lanes}) => ({lanes}),
    {LaneActions}
  )
)(App)
leanpub-end-insert
```

Tras este cambio la aplicación debería tener el mismo aspecto de antes, pero ahora estamos preparados para añadir la funcionalidad.

## Permitiendo que las Notas sean Arrastradas

Permitir que las notas puedan ser arrastradas es un buen comienzo. Antes de ello, necesitamos configurar una constante de tal modo que React DnD sepa que hay distintos tipos de elementos arrastrables. Crea un fichero con el que poder indicar que quieres mover elementos de tipo `Nota` como sigue:

**app/constants/itemTypes.js**

```javascript
export default {
  NOTE: 'note'
};
```

Esta definición puede ser extendida más adelante incluyendo nuevos tipos, como `CARRIL`, al sistema.

A continuación necesitamos decirle a nuestra `Nota` que es posible arrastrarla. Esto se puede conseguir usando la anotación `DragSource`. Modifica `Nota` con la siguiente implementación:

**app/components/Note.jsx**

```javascript
import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const Note = ({
  connectDragSource, children, ...props
}) => {
  return connectDragSource(
    <div {...props}>
      {children}
    </div>
  );
};

const noteSource = {
  beginDrag(props) {
    console.log('begin dragging note', props);

    return {};
  }
};

export default DragSource(ItemTypes.NOTE, noteSource, connect => ({
  connectDragSource: connect.dragSource()
}))(Note)
```

Deberías ver algo como esto en la consola del navegador al tratar de mover una nota:

```bash
begin dragging note Object {className: "note", children: Array[2]}
```

Ser capaz sólo de mover notas no es suficiente. Necesitamos anotarlas para que puedan ser soltadas. Esto nos permitirá lanzar cierta lógica cuando tratemos de soltar una nota encima de otra.

W> Observa que React DnD no soporta perfectamente recarga en caliente. Puede que necesites refrescar el navegador para ver los mensajes de log que esperas.

## Permitiendo a las Notas que Detecten Notas que Pasan por Encima

Podemos anotar notas de tal modo que detecten que otra nota les está pasando por encima de un modo similar al anterior. En este caso usaremos la anotación `DropTarget`:

**app/components/Note.jsx**

```javascript
import React from 'react';
leanpub-start-delete
import {DragSource} from 'react-dnd';
leanpub-end-delete
leanpub-start-insert
import {compose} from 'redux';
import {DragSource, DropTarget} from 'react-dnd';
leanpub-end-insert
import ItemTypes from '../constants/itemTypes';

const Note = ({
leanpub-start-delete
  connectDragSource, children, ...props
leanpub-end-delete
leanpub-start-insert
  connectDragSource, connectDropTarget,
  children, ...props
leanpub-end-insert
}) => {
leanpub-start-delete
  return connectDragSource(
leanpub-end-delete
leanpub-start-insert
  return compose(connectDragSource, connectDropTarget)(
leanpub-end-insert
    <div {...props}>
      {children}
    </div>
  );
};

const noteSource = {
  beginDrag(props) {
    console.log('begin dragging note', props);

    return {};
  }
};

leanpub-start-insert
const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();

    console.log('dragging note', sourceProps, targetProps);
  }
};
leanpub-end-insert

leanpub-start-delete
export default DragSource(ItemTypes.NOTE, noteSource, connect => ({
  connectDragSource: connect.dragSource()
}))(Note)
leanpub-end-delete
leanpub-start-insert
export default compose(
  DragSource(ItemTypes.NOTE, noteSource, connect => ({
    connectDragSource: connect.dragSource()
  })),
  DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Note)
leanpub-end-insert
```

Si pruebas a arrastrar una nota por encima de otra deberías ver mensajes como el siguiente en la consola:

```bash
dragging note Object {} Object {className: "note", children: Array[2]}
```

Ambos decoradores nos dan acceso a las propiedades de `Nota`. En este caso estamos usando `monitor.getItem()` para acceder a ellas en `noteTarget`. Esta es la clave para hacer que todo funcione correctamente.

## Desarrollando el API `onMove` para `Notas`

Ahora que podemos mover las notas podemos comenzar a definir la lógica. Se necesitan los siguientes pasos:

1. Capturar el identificador de `Nota` en `beginDrag`.
2. Capturar el identificador de la `Nota` objetivo `hover`.
3. Lanzar la llmada a `hover` cuando se ejecute `onMove` par que podamos incluir la lógica en algún sitio. `LaneStore` puede ser el mejor lugar para ello.

Siguiendo la idea anterior podemos pasar el identificador de la `Nota` mediante una propiedad. También necesitaremos crear un esqueleto para la llamada a `onMove` y definir `LaneActions.move` y `LaneStore.move`.

### Aceptando `id` y `onMove` en `Note`

Podemos aceptar las propiedades `id` y `onMove` en `Note` como sigue:

**app/components/Note.jsx**

```javascript
...

const Note = ({
  connectDragSource, connectDropTarget,
leanpub-start-delete
  children, ...props
leanpub-end-delete
leanpub-start-insert
  onMove, id, children, ...props
leanpub-end-insert
}) => {
  return compose(connectDragSource, connectDropTarget)(
    <div {...props}>
      {children}
    </div>
  );
};

leanpub-start-delete
const noteSource = {
  beginDrag(props) {
    console.log('begin dragging note', props);

    return {};
  }
};
leanpub-end-delete
leanpub-start-insert
const noteSource = {
  beginDrag(props) {
    return {
      id: props.id
    };
  }
};
leanpub-end-insert

leanpub-start-delete
const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();

    console.log('dragging note', sourceProps, targetProps);
  }
};
leanpub-end-delete
leanpub-start-insert
const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};
leanpub-end-insert

...
```

Tener esas propiedades no es útil si no pasamos nada a `Notas`. Ese será nuestro siguiente paso.

### Pasando `id` y `onMove` desde `Notes`

Pasar el `id` de una nota y `onMove` es sencillo:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';
import Editable from './Editable';

export default ({
  notes,
  onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {}
}) => (
  <ul className="notes">{notes.map(({id, editing, task}) =>
    <li key={id}>
leanpub-start-delete
      <Note className="note" onClick={onNoteClick.bind(null, id)}>
leanpub-end-delete
leanpub-start-insert
      <Note className="note" id={id}
        onClick={onNoteClick.bind(null, id)}
        onMove={({sourceId, targetId}) =>
          console.log('moving from', sourceId, 'to', targetId)}>
leanpub-end-insert
        <Editable
          className="editable"
          editing={editing}
          value={task}
          onEdit={onEdit.bind(null, id)} />
        <button
          className="delete"
          onClick={onDelete.bind(null, id)}>x</button>
      </Note>
    </li>
  )}</ul>
)
```

Si mueves una nota encima de otra verás mensajes por consola como el siguiente:

```bash
moving from 3310916b-5b59-40e6-8a98-370f9c194e16 to 939fb627-1d56-4b57-89ea-04207dbfb405
```

## Añadiendo Acciones en el Movimiento

La lógica de arrastrar y soltar funciona como sigue. Supón que tienes un carril que contiene las notas A, B y C. En caso de que sitúes A detrás de C el carríl contendrá B, C y A. Si tienes otra lista, por ejemplo D, E y F, y movemos A al comienzo de ésta lista, acabaremos teniendo B y C y A, D, E y F.

En nuestro caso tendremos algo de complejidad extra al soltar notas de carril en carril. Cuando movamos una `Nota` sabremos su posición original y la posición que querramos que tenga al final. El `Carril` sabe qué `Notas` le pertenecen por sus ids. Vamos a necesitar decir al `LaneStore` de alguna forma que debe realizar algo de lógica sobre las notas que posee. Un buen punto de partida es definir `LaneActions.move`:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'update', 'delete',
  'attachToLane', 'detachFromLane',
  'move'
);
```

Debemos conectar esta acción con el punto de enganche `onMove` que acabamos de definir:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';
import Editable from './Editable';
leanpub-start-insert
import LaneActions from '../actions/LaneActions';
leanpub-end-insert

export default ({
  notes,
  onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {}
}) => (
  <ul className="notes">{notes.map(({id, editing, task}) =>
    <li key={id}>
      <Note className="note" id={id}
        onClick={onNoteClick.bind(null, id)}
leanpub-start-delete
        onMove={({sourceId, targetId}) =>
          console.log('moving from', sourceId, 'to', targetId)}>
leanpub-end-delete
leanpub-start-insert
        onMove={LaneActions.move}>
leanpub-end-insert
        <Editable
          className="editable"
          editing={editing}
          value={task}
          onEdit={onEdit.bind(null, id)} />
        <button
          className="delete"
          onClick={onDelete.bind(null, id)}>x</button>
      </Note>
    </li>
  )}</ul>
)
```

T> Puede ser una buena idea refactorizar `onMove` y dejarla como propiedad para hacer que el sistema sea más flexible. En nuestra implementaciónm el componente `Notas` está acoplado con `LaneActions`, lo cual no es particularmente útil si quieres poder usarlo en otro contexto.

También debemos definir un esqueleto en `LaneStore` para ver que lo hemos cableado todo correctamente:

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  ...
  detachFromLane({laneId, noteId}) {
    ...
  }
leanpub-start-insert
  move({sourceId, targetId}) {
    console.log(`source: ${sourceId}, target: ${targetId}`);
  }
leanpub-end-insert
}
```

Deberías ver los mismos mensajes de log de antes.

A continuación vamos a añdir algo de lógica para conseguir que esto funcione. Hay dos casos de los que nos tenemos que preocupar: mover notas dentro de un mismo carril y mover notas entre distintos carriles.

## Implementando la Lógica de Arrastrar y Soltar Notas

El movimiento dentro de un mismo carril es complicado. Cuando estás basando las operaciones en ids y haces las operaciones una a una, tienes que tener en cuenta que puede hacer alteraciones en el índice. Como resultado estoy usando [update](https://facebook.github.io/react/docs/update.html) de React para solucionar el problema de una pasada.

Es posible solucionar el caso de mover notas entre carriles usando [splice](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/splice). Primero obtenemos la nota a mover, y después la incorporamos al carril destino. De nuevo, `update` puede ser útil aquí, aunque en este caso `splice` está bien. El siguiente código muestra una posible solución:

**app/stores/LaneStore.js**

```javascript
leanpub-start-insert
import update from 'react-addons-update';
leanpub-end-insert
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  ...
leanpub-start-delete
  move({sourceId, targetId}) {
    console.log(`source: ${sourceId}, target: ${targetId}`);
  }
leanpub-end-delete
leanpub-start-insert
  move({sourceId, targetId}) {
    const lanes = this.lanes;
    const sourceLane = lanes.filter(lane => lane.notes.includes(sourceId))[0];
    const targetLane = lanes.filter(lane => lane.notes.includes(targetId))[0];
    const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
    const targetNoteIndex = targetLane.notes.indexOf(targetId);

    if(sourceLane === targetLane) {
      // las mueve en bloque para evitar complicaciones
      sourceLane.notes = update(sourceLane.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    }
    else {
      // elimina la nota del origen
      sourceLane.notes.splice(sourceNoteIndex, 1);

      // y la mueve al objetivo
      targetLane.notes.splice(targetNoteIndex, 0, sourceId);
    }

    this.setState({lanes});
  }
leanpub-end-insert
}
```

Si pruebas la aplicación ahora verás que puedes arrastrar notas y que el comportamiento debería ser el correcto. Arrastrar a carriles vacíos no funcionará y la presentación puede ser mejorada.

Podría ser mejor si indicásemos la localización de la nota arrastrada de forma más clara. Podemos conseguirlo ocultándola de la lista. React DnD nos dá los puntos de enganche que necesitamos para conseguirlo.

### Indicando Dónde Mover

React DnD tiene una cualidad conocida como monitores de estado. Con ellos podemos usar `monitor.isDragging()` y `monitor.isOver()` para detactar qué `Nota` es la que estamos arrastrando. Podemos configurarlo como sigue:

**app/components/Note.jsx**

```javascript
import React from 'react';
import {compose} from 'redux';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const Note = ({
leanpub-start-delete
  connectDragSource, connectDropTarget,
  onMove, id, children, ...props
leanpub-end-delete
leanpub-start-insert
  connectDragSource, connectDropTarget, isDragging,
  isOver, onMove, id, children, ...props
leanpub-end-insert
}) => {
  return compose(connectDragSource, connectDropTarget)(
leanpub-start-delete
    <div {...props}>
      {children}
    </div>
leanpub-end-delete
leanpub-start-insert
    <div style={{
      opacity: isDragging || isOver ? 0 : 1
    }} {...props}>{children}</div>
leanpub-end-insert
  );
};

...

export default compose(
leanpub-start-delete
  DragSource(ItemTypes.NOTE, noteSource, connect => ({
    connectDragSource: connect.dragSource()
  })),
  DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
leanpub-end-delete
leanpub-start-insert
  DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.NOTE, noteTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }))
leanpub-end-insert
)(Note)
```

Si arrastras una nota por un carril, la nota arrastrada se mostrará en blanco.

Hay un pequeño problema con nuestro sistema. Todavía no podemos arrastrar notas sobre un carril vacío.

## Arrastrando Notas sobre Carriles Vacíos

Para arrastrar notas sobre carriles vaciós necesitamos permitirles el poder recibir notas. Al igual que antes, podemos configurar una lógica basada en `DropTarget` para ello. Antes de nada, necesitamos capturar el hecho de arrastrar en `Carril`:

**app/components/Lane.jsx**

```javascript
import React from 'react';
leanpub-start-insert
import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';
leanpub-end-insert
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import Notes from './Notes';
import LaneHeader from './LaneHeader';

const Lane = ({
leanpub-start-delete
  lane, notes, LaneActions, NoteActions, ...props
leanpub-end-delete
leanpub-start-insert
  connectDropTarget, lane, notes, LaneActions, NoteActions, ...props
leanpub-end-insert
}) => {
  ...

leanpub-start-delete
  return (
leanpub-end-delete
leanpub-start-insert
  return connectDropTarget(
leanpub-end-insert
    ...
  );
};

function selectNotesByIds(allNotes, noteIds = []) {
  ...
}

leanpub-start-insert
const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    // Si el carril destino no tiene notas
    // le damos la nota.
    //
    // `attachToLane` hace la limpieza necesaria
    // por defecto y garantiza que una nota sólo
    // pueda pertenecar a un carril
    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};
leanpub-end-insert

leanpub-start-delete
export default connect(
  ({notes}) => ({
    notes
  }), {
    NoteActions,
    LaneActions
  }
)(Lane)
leanpub-end-delete
leanpub-start-insert
export default compose(
  DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  connect(({notes}) => ({
    notes
  }), {
    NoteActions,
    LaneActions
  })
)(Lane)
leanpub-end-insert
```

Debería ser capaz de poder arrastrar notas a carriles vacios una vez hayas añadido esta lógica.

Nuesta implementación de `attachToLane` hace gran parte del trabajo duro por nosotros. Si no garantizase que una nota sólo puede pertenecer a un carril nuestra lógica debería ser modificada. Es bueno tener este tipo de certezas dentro del sistema de gestión de estados.

### Solucionando el Modo de Edición durante el Arrastre

La implementación actual tiene un pequeño problema. Puedes arrastrar una nota mientras esta está siendo editada. Esto no es conveniente ya que no es lo que la mayoría de la gente espera poder hacer. No puedes, por ejemplo, hacer doble click en la caja de texto para seleccionar todo su contenido.

Por suerte es fácil de arreglar. Necesitamos usar el estado `editing` de cada `Nota` para ajustar su comportamiento. Lo primero que necesitamos es pasar el estado `editing` a una `Nota` individual:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';
import Editable from './Editable';
import LaneActions from '../actions/LaneActions';

export default ({
  notes,
  onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {}
}) => (
  <ul className="notes">{notes.map(({id, editing, task}) =>
    <li key={id}>
      <Note className="note" id={id}
leanpub-start-insert
        editing={editing}
leanpub-end-insert
        onClick={onNoteClick.bind(null, id)}
        onMove={LaneActions.move}>
        <Editable
          className="editable"
          editing={editing}
          value={task}
          onEdit={onEdit.bind(null, id)} />
        <button
          className="delete"
          onClick={onDelete.bind(null, id)}>x</button>
      </Note>
    </li>
  )}</ul>
)
```

Lo siguiente será tenerlo en cuenta a la hora de renderizar:

**app/components/Note.jsx**

```javascript
import React from 'react';
import {compose} from 'redux';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const Note = ({
  connectDragSource, connectDropTarget, isDragging,
leanpub-start-delete
  isOver, onMove, id, children, ...props
leanpub-end-delete
leanpub-start-insert
  isOver, onMove, id, editing, children, ...props
leanpub-end-insert
}) => {
leanpub-start-insert
  // Pass through if we are editing
  const dragSource = editing ? a => a : connectDragSource;
leanpub-end-insert

leanpub-start-delete
  return compose(connectDragSource, connectDropTarget)(
leanpub-end-delete
leanpub-start-insert
  return compose(dragSource, connectDropTarget)(
leanpub-end-insert
    <div style={{
      opacity: isDragging || isOver ? 0 : 1
    }} {...props}>{children}</div>
  );
};

...
```

Este pequeño cambio nos dá el comportamiento que queremos. Si tratas de editar una nota ahora, la caja de texto se comportará como esperas.

Mirando hacia atrás podemos ver que mantener el estado `editing` fuera de `Editable` fue una buena idea. Si no lo hibiésemos hecho así, implementar este cambio habría sido bastante más difícil ya que tendríamos que poder sacar el estado fuera del componente.

¡Por fin tenemos un tablero Kanba que es útil!. Podemos crear carriles y notas nuevas, y también podemos editarlas y borrarlas. Además podemos movar las notas. ¡Objetivo cumplido!

## Conclusión

En este capítulo has visto cómo implementar la funcionalidad de arrastrar y soltar para nuestra pequeña aplicación. Puedes modelar la ordenación de carriles usando la misma técnica. Primero, marcas los carriles como arrastrables y soltables, los ordenas según sus identificadores y, finalmente, añades algo de lógica para hacer que todo funcione. Debería ser más sencillo que lo que hemos hecho con las notas.

Te animo a que hagas crecer la aplicación. La implementación actual debería servir de punto de entrada para hacer algo más grande. Más allá de la implementación de arrastrar y soltar, puedes tratar de añadir más datos al sistema. También puedes hacer algo con el aspecto gráfico. Una opción puede ser usar varias de las aproximaciones de aplicación de estilos que se discuten en el capítulo *Dando Estilo a React*.

Para conseguir que sea difícil romper la aplicación durante el desarrollo, puedes implementar tests como se indica en *Testing React*. *Tipando con React* discute más modos auń de endurecer tu código. Aprender estas aproximaciones puede merecer la pena. A veces es realmente útil diseñar antes los tests de las aplicaciones, ya que es una aporximación valiosa que te permite documentar lo que vas asumiendo a medida que haces la implementación.
