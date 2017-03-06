# Edición de `Notas`

La edición de notas supone un problema similar al del borrado, ya que el flujo de datos es exactamente el mismo. Necesitamos definir qué hacer tras invocar a `onEdit` y hacer una asociación con `bind` al identificador de la nota dentro de `Notas` que está siendo editado.

Lo que hace que este escenario sea más difícil son los requisitos a nivel de interfaz de usuario. No es suficiente con tener un botón, necesitamos encontrar la manera de permitir al usuario introducir un nuevo valor y de persistirlo en el modelo de datos.

Una forma de conseguirlo es mediante la implementación de algo llamado **edición en línea**. La idea es que cuando un usuario pulse sobre una nota se muestre una caja de texto. Cuando el usuario haya terminado la edición, bien pulsando *enter* o bien pulsando fuera del campo (lanzando un evento de tipo blur), capturaremos el valor y lo actualizaremos.

## Implementación de `Editable`

Vamos a contener este comportamiento dentro de un componente conocido como `Editable` con el fin de mantener la aplicación limpia. El componente nos dará un API como el siguiente:

```javascript
<Editable
  editing={editing}
  value={task}
  onEdit={onEdit.bind(null, id)} />
```

Este es un ejemplo de componente **controlado**. Controlaremos explícitamente el estado de la edición desde el exterior del componente, lo cual no sólo nos dará más poder sobre él, sino que nos permitirá que `Editable` sea más sencillo de utilizar.

T> Suele ser buena idea nombrar las llamadas con el prefijo `on`. Esto nos permitirá distinguirlas de otras propiedades y mantener el código un poco más limpio.

### Diseño Controlado vs. Diseño no Controlado

Una forma alternativa de gestionar esto es dejar el control del estado `editing` a `Editable`. Esta **forma no controlada** de diseño puede ser válida si no quieres que el estado de componente pueda ser modificado desde fuera.

Utilizar ambos diseños es posible. Puedes tener un componente controlado que tenga elementos no controlados dentro. En nuestro caso tendremos un diseño no controlado para la caja de texto que `Editable` contendrá en este ejemplo.

`Editable` estará formado por dos partes bien separadas. Por un lado necesitamos mostrar el valor mientras no estamos `editando`, pero por otro querremos mostrar un componente de `Edición` en caso de que estemos `editando`.

Antes de entrar en detalles podemos implementar un pequeño esqueleto y conectarlo con la aplicación, lo que nos dará la estructura básica que necesitaremos para hacer crecer el resto. Para comenzar, haremos una marca en la jerarquía de componentes para hacer que sea más fácil implementar el esqueleto.

T> La documentación oficial de React entra en los [componentes controlados](https://facebook.github.io/react/docs/forms.html) en más detalle.

## Extrayendo el Renderizado de `Nota`

Ahora mismo la `Nota` controla qué se va a renderizar dentro de ella. Podríamos incluir `Editable` dentro de ella y hacer que todo funcione mediante la interfaz `Nota`. A pesar de que podría ser una forma válida de hacerlo, podemos mover la responsabilidad del procesamiento a un nivel superior.

Tener el concepto de `Nota` será especialmente útil cuando queramos llevar la aplicación un paso más allá, así que no hay necesidad de borrarla. En su lugar, podemos darle el control sobre su renderizado a `Notas`.

React tiene una propiedad conocida como `children` que nos permitirá conseguir esto. Modifica `Nota` and `Notas` como se muestra a continuación para llevar el control de renderizado de `Nota` a `Notas`:

**app/components/Note.jsx**

```javascript
import React from 'react';

leanpub-start-delete
export default ({task, onDelete}) => (
  <div>
    <span>{task}</span>
    <button onClick={onDelete}>x</button>
  </div>
);
leanpub-end-delete
leanpub-start-insert
export default ({children, ...props}) => (
  <div {...props}>
    {children}
  </div>
);
leanpub-end-insert
```

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';

export default ({notes, onDelete=() => {}}) => (
  <ul>{notes.map(({id, task}) =>
    <li key={id}>
leanpub-start-delete
      <Note
        onDelete={onDelete.bind(null, id)}
        task={task} />
leanpub-end-delete
leanpub-start-insert
      <Note>
        <span>{task}</span>
        <button onClick={onDelete.bind(null, id)}>x</button>
      </Note>
leanpub-end-insert
    </li>
  )}</ul>
)
```

Ahora que tenemos espacio para trabajar podemos definir un esqueleto para `Editable`.

## Inclusión del Esqueleto `Editable`

Podemos definir un punto por el que comenzar basándonos en la especificación que sigue. La idea es que hagamos una cosa u otra basándonos en la propiedad `editing` y que hagamos lo necesario para implementar nuestra lógica:

**app/components/Editable.jsx**

```javascript
import React from 'react';

export default ({editing, value, onEdit, ...props}) => {
  if(editing) {
    return <Edit value={value} onEdit={onEdit} {...props} />;
  }

  return <span {...props}>value: {value}</span>;
}

const Edit = ({onEdit = () => {}, value, ...props}) => (
  <div onClick={onEdit} {...props}>
    <span>edit: {value}</span>
  </div>
);
```

Para ver el esqueleto en acción todavía necesitamos conectarlo con nuestra aplicación.

## Conectando `Editable` con `Notas`

Todavía necesitamos cambiar las partes relevantes del código para que apunten a `Editable`. Hay más propiedades que conectar:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';
leanpub-start-insert
import Editable from './Editable';
leanpub-end-insert

leanpub-start-delete
export default ({notes, onDelete=() => {}}) => (
leanpub-end-delete
leanpub-start-insert
export default ({
  notes,
  onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {}
}) => (
leanpub-end-insert
leanpub-start-delete
  <ul>{notes.map(({id, task}) =>
    <li key={id}>
      <Note>
        <span>{task}</span>
        <button onClick={onDelete.bind(null, id)}>x</button>
      </Note>
    </li>
  )}</ul>
leanpub-end-delete
leanpub-start-insert
  <ul>{notes.map(({id, editing, task}) =>
    <li key={id}>
      <Note onClick={onNoteClick.bind(null, id)}>
        <Editable
           editing={editing}
           value={task}
           onEdit={onEdit.bind(null, id)} />
        <button onClick={onDelete.bind(null, id)}>x</button>
      </Note>
    </li>
  )}</ul>
leanpub-end-insert
)
```

Si todo fue bien deberias ver algo como sigue:

![Connected `Editable`](images/react_06.png)

## Haciendo un Seguimiento del Estado `editing` de `Nota`

Todavía nos falta la lógica necesaria para controlar `Editable`. Dado que el estado de nuestra aplicación está siendo mantenido en `App`, necesitaremos hacer cosas allí. Debería marcar el valor `editable` de una nota a `true` cuando comience con la edición y a `false` cuando el proceso de edición termine. También debería ajustar el valor de `task` al nuevo valor. De momento sólo estamos interesados en conseguir que el valor de `editable` funcione correctamente. Realizamos los siguientes cambios:

**app/components/App.jsx**

```javascript
...

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
        <Notes notes={notes} onDelete={this.deleteNote} />
leanpub-end-delete
leanpub-start-insert
        <Notes
          notes={notes}
          onNoteClick={this.activateNoteEdit}
          onEdit={this.editNote}
          onDelete={this.deleteNote}
          />
leanpub-end-insert
      </div>
    );
  }
  addNote = () => {
    ...
  }
  deleteNote = (id, e) => {
    ...
  }
leanpub-start-insert
  activateNoteEdit = (id) => {
    this.setState({
      notes: this.state.notes.map(note => {
        if(note.id === id) {
          note.editing = true;
        }

        return note;
      })
    });
  }
  editNote = (id, task) => {
    this.setState({
      notes: this.state.notes.map(note => {
        if(note.id === id) {
          note.editing = false;
          note.task = task;
        }

        return note;
      })
    });
  }
leanpub-end-insert
}
```

Si tratas de editar una `Nota` ahora verás algo como lo siguiente:

![Tracking `editing` state](images/react_07.png)

Si pulsas en `Note` dos veces para confirmar la edición verás un error llamado `Uncaught Invariant Violation` en la consola del navegador. Este ocurre porque todavía no hemos terminado de gestionar `task` correctamente. Esto es algo que deberemos arreglar a continuación.


T> Si usamos una estructura de datos normalizada (por ejemplo, `{<id>: {id: <id>, task: <str>}}`), es posible implementar las operaciones con `Object.assign` y evitar la mutación.

T> Para tener el código más limpio puedes extraer un método que contenga la lógica compartida por `activateNoteEdit` y por `editNote`.

## Implmentación de `Edit`

Nos falta algo que haga que esto funcione. Incluso aunque ahora podemos gestionar el estado de `editing` de cada `Nota`, todavía no podemos editarlas. Para ello necesitamos expandir `Edit` y hacer que muestre una caja de texto.

En este caso estaremos utilizando un diseño **no controlado** y obtendremos el valor de la caja de texto del árbol DOM sólo si lo necesitamos.

Fíjate en el código siguiente para ver la implementación completa. Observa cómo estamos gestionando el fin de la edición, capturamos `onKeyPress` y comprobamos si han pulsado `Enter` para confirmar la edición. También tenemos en cuenta al evento `onBlur` para saber cuándo la entrada de texto pierde el foco.

**app/components/Editable.jsx**

```javascript
...


export default ({editing, value, onEdit, ...props}) => {
  if(editing) {
    return <Edit value={value} onEdit={onEdit} {...props} />;
  }

leanpub-start-delete
  return <span {...props}>value: {value}</span>;
leanpub-end-delete
leanpub-start-insert
  return <span {...props}>{value}</span>;
leanpub-end-insert
}

leanpub-start-delete
const Edit = ({onEdit = () => {}, value, ...props}) => (
  <div onClick={onEdit} {...props}>
    <span>edit: {value}</span>
  </div>
);
leanpub-end-delete
leanpub-start-insert
class Edit extends React.Component {
  render() {
    const {value, onEdit, ...props} = this.props;

    return <input
      type="text"
      autoFocus={true}
      defaultValue={value}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter}
      {...props} />;
  }
  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }
  finishEdit = (e) => {
    const value = e.target.value;

    if(this.props.onEdit) {
      this.props.onEdit(value);
    }
  }
}
leanpub-end-insert
```

Si refrescas y editas una nota deberías ver lo siguiente:

![Editing a `Note`](images/react_08.png)

## Sobre los Componentes y el Espacio de Nombres

Podríamos haber abordado `Editable` de una forma diferente. En una edición anterior de este libro lo creé como un único componente. Lo hice mostrando el valor y el control de edición a través de métodos (esto es, mediante `renderValue`). A menudo, el nombrado de métodos como el anterior es una pista de que es posible refactorizar el código y extraer componentes como hicimos anteriormente.

Puedes ir un paso más adelante y colocar las partes de los componentes en un [espacio de nombres](https://facebook.github.io/react/docs/jsx-in-depth.html#namespaced-components). De este modo habría sido posible definir los componentes `Editable.Value` y `Editable.Edit`. Mejor todavía, podríamos haber permitido al usuario intercambiar ambos componentes entre sí mediante props. Dado que la interfaz es la misma, los componentes deberían funcionar. Esto nos da una dimensión extra de personalización.

Llevándolo a la implementación, podemos tener algo como lo siguiente haciendo uso del espacio de nombres:

**app/components/Editable.jsx**

```javascript
import React from 'react';

// Podemos conseguir que la edición y la presentación del valor se intercambien mediante props
const Editable = ({editing, value, onEdit}) => {
  if(editing) {
    return <Editable.Edit value={value} onEdit={onEdit} />;
  }

  return <Editable.Value value={value} />;
};

Editable.Value = ({value, ...props}) => <span {...props}>{value}</span>

class Edit extends React.Component {
  ...
}
Editable.Edit = Edit;

// También podemos exportar componentes individuales para permitir la modificación
export default Editable;
```

Puedes utilizar una aproximación similar para definir otros componentes más genéricos. Considera algo como `Form`, puedes fácilmente tener `Form.Label`, `Form.Input`, `Form.Textarea`, etcétera. Cada uno contendrá un formato concreto y la lógica que necesite. Es una forma de hacer que tus diseños sean más flexibles.

## Conclusión

Nos ha llevado algunos pasos, pero ya podemos editar notas. Lo mejor de todo es que `Editable` debería ser útil en cualquier lugar donde necesitemos editar alguna propiedad. Podríamos haber extraído la lógica más adelante si hubiésemos visto duplicación, pero esta también es una forma de hacerlo.

Aunque la aplicación hace lo que se espera de ella todavía es bastante fea. Haremos algo al respecto en el próximo capítulo a medida que le vayamos añadiendo estilos básicos.
