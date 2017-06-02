# Borrado de `Notas`

Una forma sencilla de permitir el borrado de notas consiste en mostrar un botón con una "x" en cada `Nota`. Cuando este botón sea pulsado, simplemente deberemos borrar la nota en cuestión de la estructura de datos. Tal y como hicimos antes podemos comenzar añadiendo borradores, éste puede ser un buen lugar en el que separar el concepto de `Nota` del componente `Notas`.

A menudo trabajarás de esta forma con React. Generarás componentes de los que más adelante te darás cuenta que están compuestos por otros componentes que pueden ser extraidos. Este proceso de separación es fácil, y a veces puede incluso incrementar el rendimiento de tu aplicación puesto que la estás optimizando al renderizar partes más pequeñas.

## Separación de `Nota`

Para mantener una lista de `Nota` que mantengan el mismo aspecto podemos modelarla utilizando un `div` de este modo:

**app/components/Note.jsx**

```javascript
import React from 'react';

export default ({task}) => <div>{task}</div>;
```

Recuerda que esta declaración es equivalente a:

```javascript
import React from 'react';

export default (props) => <div>{props.task}</div>;
```

Como puedes ver, destructurar reduce la cantidad de ruido del código y permite que la implementación sea simple.

Para hacer que nuestra aplicación utilice el nuevo componente tenemos que hacer cambios también en `Notas`:

**app/components/Notes.jsx**

```javascript
import React from 'react';
leanpub-start-insert
import Note from './Note';
leanpub-end-insert

export default ({notes}) => (
  <ul>{notes.map(note =>
leanpub-start-delete
    <li key={note.id}>{note.task}</li>
leanpub-end-delete
leanpub-start-insert
    <li key={note.id}><Note task={note.task} /></li>
leanpub-end-insert
  )}</ul>
)
```

La aplicación debe tener el mismo aspecto que ya tenía antes de hacer los cambios, pero hemos hecho hueco para poder meter más cosas más adelante.

## Añadir un Esqueleto para la Llamada a `onDelete`

Necesitamos extender las capacidades de `Nota` para capturar la intención de borrarla incluyendo una acción que se ejecute al llamar a `onDelete`. Presta atención al siguiente código:

**app/components/Note.jsx**

```javascript
import React from 'react';

leanpub-start-delete
export default ({task}) => <div>{task}</div>;
leanpub-end-delete
leanpub-start-insert
export default ({task, onDelete}) => (
  <div>
    <span>{task}</span>
    <button onClick={onDelete}>x</button>
  </div>
);
leanpub-end-insert
```

Deberias ver una pequeña "x" después de cada nota:

![Notas con controles de borrado](images/react_06.png)

Todavía no harán nada, arreglarlo es el siguiente paso.

## Comunicar el Borrado a `App`

Ahora que tenemos los controles que necesitamos podemos comenzar a pensar en cómo conectarlos con los datos de `App`. Para poder borrar una `Nota` necesitamos conocer su id. Tras ello podremos implementar la lógica que se encarga de borrarlas en `App`. Para que te hagas una idea, queremos encontrarnos en una situación como la siguiente:

![flujo de `onDelete`](images/bind.png)

T> La `e` representa un evento DOM al que deberias acostumbrarte. Podemos hacer cosas como parar la propagación de eventos con él. Esto se volverá más útil a medida que queramos tener más control sobre el comportamiento de la aplicación.

T> [bind](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Function/bind) nos permite definir el contexto de la función (el primer parámetro) y los argumentos (el resto de parámetros). Esta técnica se conoce con el nombre de **aplicación parcial**.

Para conseguir todo esto vamos a necesitar una nueva propiedad en `Notas`. También necesitaremos enlazar con `bind` el identificador de cada nota con la llamada a `onDelete` para hacer obrar la magia. Aquí tienes la implementación completa de `Notas`:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';

leanpub-start-delete
export default ({notes}) => (
  <ul>{notes.map(note =>
    <li key={note.id}><Note task={note.task} /></li>
  )}</ul>
)
leanpub-end-delete
leanpub-start-insert
export default ({notes, onDelete=() => {}}) => (
  <ul>{notes.map(({id, task}) =>
    <li key={id}>
      <Note
        onDelete={onDelete.bind(null, id)}
        task={task} />
    </li>
  )}</ul>
)
leanpub-end-insert
```

He definido un valor de retorno ficticio para evitar que nuestro código falle si no se proporciona un `onDelete`. Otra buena manera de conseguirlo es mediante el uso de `propTypes`, tal y como se muestra en el capítulo *Tipado con React*.

Ahora que tenemos las cosas en su lugar podemos usarlas con `App`:

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';

export default class App extends React.Component {
  constructor(props) {
    ...
  }
  render() {
    const {notes} = this.state;

    return (
      <div>
        <button onClick={this.addNote}>+</button>
leanpub-start-delete
        <Notes notes={notes} />
leanpub-end-delete
leanpub-start-insert
        <Notes notes={notes} onDelete={this.deleteNote} />
leanpub-end-insert
      </div>
    );
  }
  addNote = () => {
    ...
  }
leanpub-start-insert
  deleteNote = (id, e) => {
    // Dejar de procesar eventos para poder editar
    e.stopPropagation();

    this.setState({
      notes: this.state.notes.filter(note => note.id !== id)
    });
  }
leanpub-end-insert
}
```

Deberías poder borrar notas una vez hayas refrescado el navegador. Anticipándome al futuro he añadido la linea extra `e.stopPropagation()`. La idea subyacente es la de indicar al DOM que tiene que dejar de procesar eventos. En resumidas cuentas, vamos a evitar que se lancen otros eventos desde cualquier sitio que puedan afectar a la estructura si estamos borrando notas.

## Conclusión

Trabajar con React a menudo es esto: identificar los componentes y flujos en base a tus necesidades. Aquí hemos necesitado modelar una `Nota` y hemos diseñado un flujo que nos permite tener el control sobre ella en el lugar correcto.

Todavía nos falta implementar una funcionalidad con la que terminar la primera parte del Kanban. La edición es la funcionalidad más difícil de todas. Una forma de implementarla es mediante un *editor en línea*. Implementar un componente adecuado ahora nos ayudará a ahorrar tiempo cuando tengamos que editar algo más. Antes de continuar con la implementación vamos a echar un vistazo más en detalle a los componentes de React para entender mejor qué tipo de funcionalidad nos pueden dar.
