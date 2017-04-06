# Editando los Carriles

![Kanban board](images/kanban_05.png)

Todavia tenemos mucho trabajo por hacer para conseguir que esto sea un Kanban real como el que se muestra ahí arriba. La aplicación todavía carece de algo de lógica y de estilo. Es en eso en lo que nos vamos a centrar ahora.

El componente `Editable` que implementamos antes nos será útil ahora. Podremos usarlo para que sea posible cambiar el nombre de los carriles. La idea es la misma que para las notas.

También debemos hacer que sea posible eliminar carriles. Para ello necesitaremos añadir un control en el UI e incluir algo de lógica. De nuevo, la idea es similar a lo de antes.

## Implementando la Edición de Nombres de `Carril`

Para editar el nombre de un `Carril` necesitaremos algo de lógica y puntos de enganche con el UI. `Editable` puede encargarse del UI, la lógica nos dará algo más de trabajo. Para comenzar, deja `LaneHeader` como sigue:

**app/components/LaneHeader.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
leanpub-start-insert
import Editable from './Editable';
leanpub-end-insert

export default connect(() => ({}), {
  NoteActions,
  LaneActions
})(({lane, LaneActions, NoteActions, ...props}) => {
  const addNote = e => {
    ...
  };
leanpub-start-insert
  const activateLaneEdit = () => {
    LaneActions.update({
      id: lane.id,
      editing: true
    });
  };
  const editName = name => {
    LaneActions.update({
      id: lane.id,
      name,
      editing: false
    });
  };
leanpub-end-insert

  return (
leanpub-start-delete
    <div className="lane-header" {...props}>
leanpub-end-delete
leanpub-start-insert
    <div className="lane-header" onClick={activateLaneEdit} {...props}>
leanpub-end-insert
      <div className="lane-add-note">
        <button onClick={addNote}>+</button>
      </div>
leanpub-start-delete
      <div className="lane-name">{lane.name}</div>
leanpub-end-delete
leanpub-start-insert
      <Editable className="lane-name" editing={lane.editing}
        value={lane.name} onEdit={editName} />
leanpub-end-insert
    </div>
  );
})
```

La interfaz deusuario debería tener el mismo aspecto tras este cambio. Todavía necesitamos implementar `LaneActions.update` para hacer que esto funcione.

Igual que antes, tenemos que hacer cambios en dos sitios, en la definición de la acción y en `LaneStore`. Aquí tenemos la parte de la acción:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'update', 'attachToLane', 'detachFromLane'
);
```

Para añadir la lógica que falta, modifica `LaneStore` de este modo. La idea es la misma que la de `NoteStore`:

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    ...
  }
leanpub-start-insert
  update(updatedLane) {
    this.setState({
      lanes: this.lanes.map(lane => {
        if(lane.id === updatedLane.id) {
          return Object.assign({}, lane, updatedLane);
        }

        return lane;
      })
    });
  }
leanpub-end-insert
  ...
}
```

Tras estos cambios deberías ser capaz de editar los nombres de los carriles. El borrado de carriles es una buena característica con la que seguir.

## Implementando el Borrao de `Carril`

El borrado de carriles en un problema parecido. Necesitamos poner más cosas en la interfaz de usuario, añadir una acción y asociarle lógica.

La interfaz del usuario es un lugar natural en el que comenzar. A menudo es una buena idea añadir algunos `console.log` en ciertos lugares para estar seguro de que los manejadores se ejecutan cuando esperas. Puede ser incluso mejor que escribas tests para ellos. De este modo acabarás con una especificación ejecutable. Aquí tienes un esqueleto con el que poder borrar carriles:

**app/components/LaneHeader.jsx**

```javascript
...

export default connect(() => ({}), {
  NoteActions,
  LaneActions
})(({lane, LaneActions, NoteActions, ...props}) => {
  ...
leanpub-start-insert
  const deleteLane = e => {
    // Evita que se ejecuten los eventos naturales de javascript del componente
    e.stopPropagation();

    LaneActions.delete(lane.id);
  };
leanpub-end-insert

  return (
    <div className="lane-header" onClick={activateLaneEdit} {...props}>
      <div className="lane-add-note">
        <button onClick={addNote}>+</button>
      </div>
      <Editable className="lane-name" editing={lane.editing}
        value={lane.name} onEdit={editName} />
leanpub-start-insert
      <div className="lane-delete">
        <button onClick={deleteLane}>x</button>
      </div>
leanpub-end-insert
    </div>
  );
});
```

De nuevo, necesitamos agrandar nuestra definición de acción:

**app/actions/LaneActions.js**

```javascript
import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'update', 'delete', 'attachToLane', 'detachFromLane'
);
```

Y, para finalizar con la implementación, tenemos que añadir algo de lógica:

**app/stores/LaneStore.js**

```javascript
import LaneActions from '../actions/LaneActions';

export default class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    ...
  }
  update(updatedLane) {
    ...
  }
leanpub-start-insert
  delete(id) {
    this.setState({
      lanes: this.lanes.filter(lane => lane.id !== id)
    });
  }
leanpub-end-insert
  ...
}
```

Si todo ha ido correctamente ahora deberías ser capaz de borrar carriles enteros.

La implementación actual tiene un problema. Aunque estamos borrando las referencias con los carriles, las notas todavía existen. Esto lo podemos arreglar de dos maneras: y creando una papelera donde ir dejando esta basura y borrarla cada cierto tiempo o podemos borrar las notas junto con el carril. Sin embargo, para el ámbito de esta aplicación vamos a dejarlo como está, es una mejora de lo que tendremos que ser conscientes.

## Dando Estilo al Tablero Kanban

El estilo se ha estropeado un poco al añadir `Carriles` a la aplicación. Cambia lo siguiente para que quede un poco mejor:

**app/main.css**

```css
body {
  background-color: cornsilk;

  font-family: sans-serif;
}

leanpub-start-delete
.add-note {
  background-color: #fdfdfd;

  border: 1px solid #ccc;
}
leanpub-end-delete

leanpub-start-insert
.lane {
  display: inline-block;

  margin: 1em;

  background-color: #efefef;
  border: 1px solid #ccc;
  border-radius: 0.5em;

  min-width: 10em;
  vertical-align: top;
}

.lane-header {
  overflow: auto;

  padding: 1em;

  color: #efefef;
  background-color: #333;

  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
}

.lane-name {
  float: left;
}

.lane-add-note {
  float: left;

  margin-right: 0.5em;
}

.lane-delete {
  float: right;

  margin-left: 0.5em;

  visibility: hidden;
}
.lane-header:hover .lane-delete {
  visibility: visible;
}

.add-lane, .lane-add-note button {
  cursor: pointer;

  background-color: #fdfdfd;
  border: 1px solid #ccc;
}

.lane-delete button {
  padding: 0;

  cursor: pointer;

  color: white;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
}
leanpub-end-insert

...
```

Deberías evr algo como esto:

![Styled Kanban](images/kanban_styled.png)

Podemos dejar el CSS en un sólo fichero ya que este es un proyecto pequeño. En caso de que comience a crecer, habrá que considerar el partirlo en varios ficheros. Una forma de hacer esto es extraer el CSS de cada componente y referenciarlo desde él (por ejemplo,  `require('./lane.css')` en `Lane.jsx`). Puedes incluso considerar el utilizar **CSS Modules** para hacer que las CSS funcionen en un ámbito local. Lee el capítulo *Dando Estilo a React* para más información.

## Conclusión

Aunque nuestra aplicación empieza a tener un buen aspecto y tiene una funcionalidad básica todavia carece de una característica vital: aún no podemos mover notas entre carriles. Esto es algo que solucionaremos en el próximo capítulo cuando implementemos el drag and drop.
