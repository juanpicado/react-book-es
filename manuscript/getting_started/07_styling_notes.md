# Dando Estilo a la Aplicación de Notas

Estéticamente hablando, nuestra aplicación se encuentra en un estado bastante precario. Algo tendremos que hacer, ya que las aplicaciónes más divertidas de utilizar son aquellas que son visualmente más atractivas. En nuestro caso vamos a utilizar un estilo a la vieja usanza.

Para ello esparciremos algunas clases CSS y aplicaremos estilo en base a los selectores. El capítulo *Dando estilo a React* discute otras aproximaciones con mayor detalle.

## Aplicando Estilo sobre el Botón "Añadir Nota"

Para dar estilo al botón "Añadir Nota" primero tenemos que asignarle una clase:

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
leanpub-start-delete
        <button onClick={this.addNote}>+</button>
leanpub-end-delete
leanpub-start-insert
        <button className="add-note" onClick={this.addNote}>+</button>
leanpub-end-insert
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
```

También necesitamos añadir el estilo correspondiente:

**app/main.css**

```css
...

leanpub-start-insert
.add-note {
  background-color: #fdfdfd;

  border: 1px solid #ccc;
}
leanpub-end-insert
```

Una forma más general de gestionar esto podría ser crear un nuevo componente `Botón` y darle estilo. Esto nos permitirá tener botones con estilo en toda la aplicación.

## Aplicando estilos sobre `Notas`

Actualmente la lista de `Notas` está en crudo. Podemos mejorarla ocultando los estilos específicos de las listas. También podemos ajustar el ancho de `Notas` para que la interfaz del usuario aguante bien si un usuario introduce una tarea larga. Un buen primer paso es incluir algunas clases en `Notas` que la hagan más fácil de estilizar:

**app/components/Notes.jsx**

```javascript
import React from 'react';
import Note from './Note';
import Editable from './Editable';

export default ({
  notes,
  onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {}
}) => (
leanpub-start-delete
  <ul>{notes.map(({id, editing, task}) =>
leanpub-end-delete
leanpub-start-insert
  <ul className="notes">{notes.map(({id, editing, task}) =>
leanpub-end-insert
    <li key={id}>
leanpub-start-delete
      <Note onClick={onNoteClick.bind(null, id)}>
leanpub-end-delete
leanpub-start-insert
      <Note className="note" onClick={onNoteClick.bind(null, id)}>
leanpub-end-insert
        <Editable
leanpub-start-insert
          className="editable"
leanpub-end-insert
          editing={editing}
          value={task}
          onEdit={onEdit.bind(null, id)} />
leanpub-start-delete
        <button onClick={onDelete.bind(null, id)}>x</button>
leanpub-end-delete
leanpub-start-insert
        <button
          className="delete"
          onClick={onDelete.bind(null, id)}>x</button>
leanpub-end-insert
      </Note>
    </li>
  )}</ul>
)
```

Para eliminar los estilos específicos de las listas podemos aplicar las reglas siguientes:

**app/main.css**

```css
...

leanpub-start-insert
.notes {
  margin: 0.5em;
  padding-left: 0;

  max-width: 10em;
  list-style: none;
}
leanpub-end-insert
```

## Aplicando Estilos sobre Notas Individuales

Todavía quedan cosas relacionadas con `Notas` pendientes de estilizar. Antes de insertar reglas debemos asegurarnos de que tenemos unos buenos puntos de enganche para ello en `Editable`:

**app/components/Editable.jsx**

```javascript
import React from 'react';
leanpub-start-insert
import classnames from 'classnames';
leanpub-end-insert

leanpub-start-delete
export default ({editing, value, onEdit, ...props}) => {
leanpub-end-delete
leanpub-start-insert
export default ({editing, value, onEdit, className, ...props}) => {
leanpub-end-insert
  if(editing) {
leanpub-start-delete
    return <Edit value={value} onEdit={onEdit} {...props} />;
leanpub-end-delete
leanpub-start-insert
    return <Edit
      className={className}
      value={value}
      onEdit={onEdit}
      {...props} />;
leanpub-end-insert
  }

leanpub-start-delete
  return <span {...props}>{value}</span>;
leanpub-end-delete
leanpub-start-insert
  return <span className={classnames('value', className)} {...props}>
    {value}
  </span>;
leanpub-end-insert
}

class Edit extends React.Component {
  render() {
leanpub-start-delete
    const {value, onEdit, ...props} = this.props;
leanpub-end-delete
leanpub-start-insert
    const {className, value, onEdit, ...props} = this.props;
leanpub-end-insert

    return <input
      type="text"
leanpub-start-insert
      className={classnames('edit', className)}
leanpub-end-insert
      autoFocus={true}
      defaultValue={value}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter}
      {...props} />;
  }
  ...
}
```

Puede que `className` sea difícil de manejar ya que sólo acepta un string y quizá queramos insertarle más de una clase. En este punto puede ser útil un paquete conocido como [classnames](https://www.npmjs.org/package/classnames). Este paquete acepta muchos tipos de entradas y los convierte a un único string para resolver el problema.

Hay suficientes clases para diseñar el resto ahora. Podemos mostrar una sombra debajo de la nota si ponemos el ratón por encima. También es un buen momento para mostrar el control de borrado al mover el cursor por encima. Por desgracia estos estilos no se mostrarán en interfaces táctiles, pero son lo suficientemente buenos para esta demo:

**app/main.css**

```css
...

leanpub-start-insert
.note {
  overflow: auto;

  margin-bottom: 0.5em;
  padding: 0.5em;

  background-color: #fdfdfd;
  box-shadow: 0 0 0.3em .03em rgba(0,0,0,.3);
}
.note:hover {
  box-shadow: 0 0 0.3em .03em rgba(0,0,0,.7);

  transition: .6s;
}

.note .value {
  /* force to use inline-block so that it gets minimum height */
  display: inline-block;
}

.note .editable {
  float: left;
}
.note .delete {
  float: right;

  padding: 0;

  background-color: #fdfdfd;
  border: none;

  cursor: pointer;

  visibility: hidden;
}
.note:hover .delete {
  visibility: visible;
}
leanpub-end-insert
```

Si todo ha ido bien tu aplicación debería tener el siguiente aspecto:

![La aplicación de Notas con estilo](images/style_01.png)

## Conclusión

Esta no es más que una forma de aplicar estilos sobre una aplicación de React. Delegar en clases como hemos hecho hasta ahora puede acarrear problemas a medida que la aplicación crezca. Éste es el motivo por el cual hay alternativas con las que poder aplicar estilos a la vez que se resuelve este problema en particular. El capítulo *Dando estilo a React* muestra muchas de esas técnicas.

Puede ser una buena idea probar un par de alternativas con el objetivo de encontrar alguna con la que te encuentes cómodo. Particularmente creo que los **Módulos CSS** prometen ser capaces de resolver el problema fundamental de CSS - el problema de que el ámbito de todo es global. Esta técnica te permite aplicar estilos para cada componente de forma local.

Ahora que tenemos una aplicación de Notas sencilla funcionando podemos comenzar a hacer un Kanban completo. Requerirá de un poco de paciencia ya que necesitaremos mejorar la forma en la que estamos gestionando el estado de la aplicación. También necesitaremos añadir algo de estructura que nos falta y estar seguros de que podremos arrastrar y soltar notas por aquí y por allá. Todos ellos son objetivos jugosos para la siguiente parte del libro.
