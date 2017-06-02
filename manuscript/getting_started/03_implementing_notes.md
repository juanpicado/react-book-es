# Implementando una Aplicación de Notas

Ahora que tenemos un buen entorno de desarrollo podemos hacer algo que funcione. Nuestra meta en este momento es acabar teniendo una aplicación primitiva que permita tomar notas. Tendremos las operaciones de manipulación básicas. Haremos que nuestra aplicación crezca desde la nada y nos meteremos en problemas, lo que nos permitirá entender por qué son necesarias arquitecturas como Flux.

## Modelo de Datos Inicial

A menudo, una buena forma de comenzar con el desarrollo de una aplicación es empezar con los datos. Podemos modelar una lista de notas tal y como sigue:

```javascript
[
  {
    id: '4e81fc6e-bfb6-419b-93e5-0242fb6f3f6a',
    task: 'Learn React'
  },
  {
    id: '11bbffc8-5891-4b45-b9ea-5c99aadf870f',
    task: 'Do laundry'
  }
];
```

Cada nota es un objeto que contiene los datos que necesitamos, incluyendo un identificador (`id`) y el nombre de la tarea (`task`) que queremos llevar a cabo. Más adelante podremos extender esta definición para incluir cosas como el color de las notas o su propietario.

Podríamos haber ignorado los identificadores en nuestra definición, pero esto puede volverse un problema a medida que la aplicación crece si tratamos de referenciarlas. Al fin y al cabo, cada columna de Kanban necesita ser capaz de referenciar algunas notas. Adoptando los índices desde el principio ahorraremos algo de esfuerzo más adelante.

T> Otra forma interesante de aproximarse a los datos puede ser normalizarlos. En este caso podríamos acabar con una estructura del tipo `[<id> -> { id: '...', task: '...' }]`. Incluso aunque quizá tenga algo de redundante, es conveniente utilizar la estructura de esta forma ya que nos facilita poder acceder mediante a los elementos mediante el índice. La estructura se volverá más útil todavía una vez empecemos a tener referencias entre entidades.

## Renderizado de los Datos Iniciales

Ahora que tenemos un modelo de datos inicial, podemos tratar de renderizarlo utilizando React. Vamos a necesitar un componente que retenga los datos, lo llamaremos `Notas` de momento y lo haremos crecer si queremos que tenga más funcionalidad. Crea un fichero con un componente sencillo como el siguiente:

**app/components/Notes.jsx**

```javascript
import React from 'react';

const notes = [
  {
    id: '4e81fc6e-bfb6-419b-93e5-0242fb6f3f6a',
    task: 'Learn React'
  },
  {
    id: '11bbffc8-5891-4b45-b9ea-5c99aadf870f',
    task: 'Do laundry'
  }
];

export default () => (
  <ul>{notes.map(note =>
    <li key={note.id}>{note.task}</li>
  )}</ul>
)
```

Estamos utilizando algunas características importantes de JSX en el trozo de código anterior. He destacado las partes más difíciles:

* `<ul>{notes.map(note => ...)}</ul>` - `{}` nos permite mexclar sintaxis de JavaScript con JSX. `map` devuelve una lista de elementos `li` para que React los renderice.
* `<li key={note.id}>{note.task}</li>` - Usamos la propiedad `key` para poder decirte a React qué items han sido cambiados, modificados o borrados. Es importante que sea único ya que, sino, React no será capaz de saber el orden correcto en el que debe renderizarlos. React mostrará una advertencia si no se indican. Puedes leer el enlace al artículo [Renderizando Varios Componentes](https://facebook.github.io/react/docs/lists-and-keys.html#rendering-multiple-components) para obtener más información.

Necesitamos hacer referencia al componente desde el punto de entrada de nuestra aplicación:

**app/index.jsx**

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
leanpub-start-insert
import Notes from './components/Notes';
leanpub-end-insert

if(process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf');
}

ReactDOM.render(
leanpub-start-delete
  <div>Hello world</div>,
leanpub-end-delete
leanpub-start-insert
  <Notes />,
leanpub-end-insert
  document.getElementById('app')
);
```

Si ejecutas la aplicación verás una lista de notas. No es especialmente bonito ni útil todavía pero es un comienzo:

![Una lista de notas](images/react_03.png)

T> Necesitamos usar el `import` de React en *Notes.jsx* ya que hay transformaciones que hacer de JSX a JavaScript. Sin él el código resultante fallará.

## Generando los Ids

Habitualmente el problema de generar los ids se resuelve por un backend. Ya que no tenemos ninguno todavía, en su lugar, vamos a utilizar un estándar conocido como [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) que nos permitirá generar identificadores únicos. Utilizaremos una implementación de Node.js conocida como *uuid* y su variante `uuid.v4` que nos dará ids tales como `1c8e7a12-0b4c-4f23-938c-00d7161f94fc` que, casi con toda seguridad, serán únicos.

Para utilizar el generador en nuestra aplicación modifícala como sigue:

**app/components/Notes.jsx**

```javascript
import React from 'react';
leanpub-start-insert
import uuid from 'uuid';
leanpub-end-insert

const notes = [
  {
leanpub-start-delete
    id: '4e81fc6e-bfb6-419b-93e5-0242fb6f3f6a',
leanpub-end-delete
leanpub-start-insert
    id: uuid.v4(),
leanpub-end-insert
    task: 'Learn React'
  },
  {
leanpub-start-delete
    id: '11bbffc8-5891-4b45-b9ea-5c99aadf870f',
leanpub-end-delete
leanpub-start-insert
    id: uuid.v4(),
leanpub-end-insert
    task: 'Do laundry'
  }
];

...
```

Nuestra configuración de desarrollo instalará la dependencia `uuid` automáticamente. Una vez que esto haya ocurrido y que la aplicación se haya recargado, todo debería tener el mismo aspecto. Sin embargo, si pruebas a depurar la aplicación, verás que los ids cambiarán cada vez que refresques la página. Puedes comprobarlo fácilmente o bien insertando la línea `console.log(notes);` o bien usando el comando [debugger;](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/debugger) dentro del componente.

El comando `debugger;` es especialmente útil ya que le indica al navegador que debe parar la ejecución. De este modo es posible ver la pila de llamadas y examinar las variables que estén disponibles. Es una buena forma de depurar las aplicaciones y suponer qué está ocurriendo si no estás seguro de cómo funciona algo.

`console.log` es una alternativa más ligera. Puedes incluso diseñar un sistema de gestión de logs en torno a él y usar ambas técnicas juntas. Echa un vistazo a [MDN](https://developer.mozilla.org/es/docs/Web/API/Console) y a [la documentación de Chrome](https://developers.google.com/web/tools/chrome-devtools/debug/console/console-reference) para ver el API completo.

T> Si estás interesado en conocer las matemáticas que se esconden tras la generación de los id, puedes ver más detalles sobre cómo se hacen estos [cálculos en la Wikipedia](https://en.wikipedia.org/wiki/Universally_unique_identifier#Random_UUID_probability_of_duplicates). Verás que la posibilidad de que haya una colisión es realmente pequeña y que no debemos preocuparnos por ello.

## Añadiendo Nuevas Notas a la Lista

Aunque de momento podemos mostrar notas de forma individual, todavía nos falta mucha lógica que hará que nuestra aplicación sea útil. Una forma lógica de comenzar puede ser implementando la inclusión de nuevas notas a la lista. Para conseguirlo necesitamos hacer que la aplicación crezca un poco.

### Definiendo un Borrador para `App`

Para poder añadir nuevas notas necesitaremos tener un botón que nos lo permita en algún sitio. Actualmente nuestro componente `Notas` sólo hace una cosa: mostrar notas. Esto es totalmente correcto. Para hacer espacio a más funcionalidad podemos incluir un concepto conocido como `App` en lo más alto. Este componente orquestará la ejecución de nuestra aplicación. Podemos añadir el botón que queramos allí, podremos gestionar el estado y también podremos añadir notas. Inicialmente `App` puede tener el siguiente aspecto:

**app/components/App.jsx**

```javascript
import React from 'react';
import Notes from './Notes';

export default () => <Notes />;
```

Todo lo que hace es renderizar `Notas`, así que debe hacer más cosas para conseguir que sea útil. Tenemos que alterar el punto de entrada tal y como sigue para incrustar `App` en nuestra aplicación:

**app/index.jsx**

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
leanpub-start-delete
import Notes from './components/Notes';
leanpub-end-delete
leanpub-start-insert
import App from './components/App';
leanpub-end-insert

if(process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf');
}

ReactDOM.render(
leanpub-start-delete
  <Notes />,
leanpub-end-delete
leanpub-start-insert
  <App />,
leanpub-end-insert
  document.getElementById('app')
);
```

Si ejecutas la aplicación ahora verás que tiene exactamente el mismo aspecto que antes, pero ahora tenemos espacio para crecer.

### Añadiendo un Borrador para el Botón *Añadir*

Un buen paso para llegar a algo más funcionar es añadir un borrador para el botón *añadir*. Para conseguirlo, `App` necesita evolucionar:

**app/components/App.jsx**

```
import React from 'react';
import Notes from './Notes';

leanpub-start-delete
export default () => <Notes />;
leanpub-end-delete
leanpub-start-insert
export default () => (
  <div>
    <button onClick={() => console.log('añadir nota')}>+</button>
    <Notes />
  </div>
);
leanpub-end-insert
```

Si pulsas sobre el botón que hemos añadido verás un mensaje con el texto "añadir nota" en la consola del navegador. Todavía necesitamos conectar de alguna forma el botón con nuestros datos. De momento los datos están atrapados dentro del componente `Notas` así que, antes de seguir, necesitamos sacarlos y dejarlos a nivel de `App`.

T> Tenemos que envolver nuestra aplicación dentro de un `div` porque todos los componentes de React deben devolver un único elemento.

### Llevando los Datos a `App`

Para llevar los datos a `App` necesitamos hacer un par de cambios. Lo primero que necesitamos es moverlos literalmente allí y mandar los datos mediante una propiedad (prop en adelante) a `Notas`. Tras esto necesitamos realizar cambios en `Notas` para realizar operaciones en base a la nueva lógica. Una vez hayamos conseguido esto podremos empezar a pensar en añadir notas nuevas.

En la parte de `App` el cambio es sencillo:

**app/components/App.jsx**

```javascript
import React from 'react';
leanpub-start-insert
import uuid from 'uuid';
leanpub-end-insert
import Notes from './Notes';

leanpub-start-insert
const notes = [
  {
    id: uuid.v4(),
    task: 'Learn React'
  },
  {
    id: uuid.v4(),
    task: 'Do laundry'
  }
];
leanpub-end-insert

export default () => (
  <div>
    <button onClick={() => console.log('añadir nota')}>+</button>
leanpub-start-delete
    <Notes />
leanpub-end-delete
leanpub-start-insert
    <Notes notes={notes} />
leanpub-end-insert
  </div>
);
```

Esto no hará mucho hasta que también cambiemos `Notas`:

**app/components/Notes.jsx**

```javascript
import React from 'react';
leanpub-start-delete
import uuid from 'uuid';

const notes = [
  {
    id: uuid.v4(),
    task: 'Learn React'
  },
  {
    id: uuid.v4(),
    task: 'Do laundry'
  }
];

export default () => {
leanpub-end-delete
leanpub-start-insert
export default ({notes}) => (
leanpub-end-insert
  <ul>{notes.map(note =>
    <li key={note.id}>{note.task}</li>
  )}</ul>
);
```

Nuestra aplicación tendrá el mismo aspecto que antes de que hiciéramos los cambios, pero ahora estamos listos para añadir algo de lógica.

T> La forma de extraer `notes` de `props` (el primer parámetro) es un truco estándar que verás con React. Si quieres acceder al resto de `props` puedes usar una sintaxis como `{notes, ...props}`. Más adelante lo utilizaremos de nuevo para que te hagas una idea más clara de cómo funciona y para qué puedes utilizarlo.

### Llevando el Estado a `App`

Ahora que tenemos todo colocado y en el lugar correcto podemos comenzar a preocuparnos sobre cómo modificar los datos. Si has utilizado JavaScript con anterioridad verás que la forma más intuitiva de hacer esto es configurar un evento de este estilo: `() => notes.push({id: uuid.v4(), task: 'New task'})`. Si lo intentas verás que no ocurre nada.

El motivo es sencillo. React no se ha enterado de que la estructura ha cambiado y, por tanto, no reacciona (esto es, no invoca a `render()`). Para solucionar este problema podemos implementar nuestra modificación haciendo que utilice el propio API de React, lo que hará que sí se entere de que la estructura ha cambiado y, como resultado, ejecutará `render()` tal y como esperamos.

En el momento de escribir esto la definición de componentes basada en funciones no soporta el concepto de estado. El problema aparece porque estos componentes no tienen una instancia por detrás que les respalde. Podríamos ver cómo arreglar esto utilizando únicamente funciones, pero por ahora tendremos que utilizar la alternativa de hacer el trabajo duro por nosotros mismos.

Además de funciones, también puedes crear componentes de React utilizando `React.createClass` o una definición de componentes basada en clases. En este libro utilizaremos componentes basados en funciones tanto como sea posible, y sólo si hay una buena razón por la cual estos componentes no pueden funcionar, entonces utilizaremos definiciones basadas en clases.

Con el objetivo de transformar nuestra `App` en un componente basado en clases, cámbialo como sigue para meter el estado dentro.

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';

leanpub-start-delete
const notes = [
  {
    id: uuid.v4(),
    task: 'Learn React'
  },
  {
    id: uuid.v4(),
    task: 'Do laundry'
  }
];

export default () => (
  <div>
    <button onClick={() => console.log('añadir nota')}>+</button>
    <Notes notes={notes} />
  </div>
);
leanpub-end-delete

leanpub-start-insert
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do laundry'
        }
      ]
    };
  }
  render() {
    const {notes} = this.state;

    return (
      <div>
        <button onClick={() => console.log('add note')}>+</button>
        <Notes notes={notes} />
      </div>
    );
  }
}
leanpub-end-insert
```

Tras este cambio `App` contiene el estado aunque la aplicación siga pareciendo la misma de antes. Es ahora cuando podemos comenzar a usar el API de React para modificar el estado.

T> Las soluciones de gestión de datos, tales como [MobX](https://mobxjs.github.io/mobx/), arreglan el problema a su manera. Utilizándolos sólo necesitas poner anotaciones en tus estructuras de datos, en los componentes de React, y ellos se encargan de resolver del problema de actualizarse. Volveremos más adelante a tratar este tema de la gestión de datos en detalle.

T> Estamos pasando `props` a `super` por convención. Si no lo haces, ¡`this.props` no cambiará!. Llamar a `super` provoca que se invoque al mismo método de la clase padre del mismo modo a como se hace en la programación orientada a objetos.

### Implementando la Lógica de Añadir `Nota`

Todos nuestros esfuerzos pronto se verán recompensados. Sólo nos queda un paso, tan sólo necesitamos utilizar el API de React para manipular el estado. React facilita un método conocido como `setState` con este objetivo. En este caso lo invocaremos como sigue: `this.setState({... el nuevo estado viene aquí ...}, () => ...)`.

El callback es opcional. React lo invocará una vez haya establecido el estado y, por lo general, no tienes que preocuparte de ello para nada. React invocará a `render` una vez que `setState` haya terminado. El API asíncrono te puede parecer un poco extraño al principio pero le permite a React ser capaz de optimizar su rendimiento utilizando técnicas como las actualizaciones en bloque. Todo esto recae en el concepto de DOM Virtual.

Una forma de invocar a `setState` puede ser dejar toda la lógica relacionada en un método para llamarlo una vez se crea una nueva nota. La definición de componentes basada en clases no permite enlazar métodos personalizados como éste por defecto así que necesitaremos gestionar esta asociación en algún sitio. Podría ser posible hacer esto en el `constructor`, `render()`, o utilizando una sintaxis específica. Voy a optar por la solución de la sintaxis en este libro. Lee el apéndice *Características del Lenguaje* para aprender más.

Para atar la lógica al botón, `App` debe cambiar como sigue:

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
leanpub-start-delete
        <button onClick={() => console.log('add note')}>+</button>
leanpub-end-delete
leanpub-start-insert
        <button onClick={this.addNote}>+</button>
leanpub-end-insert
        <Notes notes={notes} />
      </div>
    );
  }
leanpub-start-insert
  addNote = () => {
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
  }
leanpub-end-insert
}
```

Dado que, en este punto, estamos enlazando una instancia, la recarga en caliente no se dará cuenta del cambio. Para probar la nueva funcionalidad tienes que refrescar el navegador y pulsar sobre el botón `+`. Deberías ver algo:

![Notas con un más](images/react_05.png)

T> Si estuviésemos utilizando un backend podríamos lanzar una consulta y capturar el id de la respuesta. De momento es suficiente con generar una entrada y un id aleatorio.

T> Podríamos utilizar `this.setState({notes: [...this.state.notes, {id: uuid.v4(), task: 'New task'}]})` para conseguir el mismo resultado. Este [operador de propagación](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Spread_operator) puede ser utilizado también con funciones recibidas como parámetros. Mira el apéndice *Características del Lenguaje* para más información.

T> El [autobind-decorator](https://www.npmjs.com/package/autobind-decorator) puede ser una alternativa válida a la hora de inicializar propiedades. En ese caso podríamos utilizar la anotación `@autobind` a nivel de clase o de método. Para aprender más sobre decoradores echa un vistazo al apéndice *Entendiendo los Decoradores*.

## Conclusión

De momento tenemos sólo una aplicación primitiva, y hay dos funcionalidades críticas que necesitamos: la edición y el borrado de notas. Es un buen momento de centrarnos en ellas a partir de ahora. Primero comenzaremos con el borrado y, tras ello, con la edición.
