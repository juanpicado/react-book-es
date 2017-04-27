# Características del Lenguaje

ES6 (o ES2015) ha sido sin lugar a dudas el mayor cambio en JavaScript en mucho tiempo. Como resultado, muchas funcionalidades nuevas han sido añadidas. El propósito de este apéndie es mostrar las características utilizadas en este libro de forma individual para que sea más fácil de entender cómo funcionan. En lugar de ir a [la especificación completa](http://www.ecma-international.org/ecma-262/6.0/index.html), me centraré únicamente en el subconunto de características usadas en el libro.

## Módulos

ES6 introduce una declaración formal de módulos. Anteriormente había que utilizar soluciones ad hoc o cosas como AMD o CommonJS. Las declaraciones de módulos de ES6 son analizables estáticamente, lo cual es útil para no cargar código sin utilizar símplemente analizando la estructura de imports.

### `import` y `export` Sencillo

Para mostrarte un ejemplo de cómo exportar directamente un módulo echa un vistazo al código siguiente:

**persist.js**

```javascript
import makeFinalStore from 'alt-utils/lib/makeFinalStore';

export default function(alt, storage, storeName) {
  ...
}
```

**index.js**

```javascript
import persist from './persist';

...
```

### `import` y `export` Multiple

A menudo puede ser útil utilizar módulos como un espacio de nombres con varias funciones:

**math.js**

```javascript
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function square(a) {
  return a * a;
}
```

De forma alternativa puedes escribir el módulo de la forma siguiente:

**math.js**

```javascript
const add = (a, b) => a + b;
const multiple = (a, b) => a * b;

// Puedes omitir los () si quieres ya que tiene sólo un parámetro
const square = a => a * a;

export {
  add,
  multiple,
  // Puedes crear alias
  multiple as mul
};
```

El ejemplo utiliza la *sintaxis de la flecha gorda*. Esta definición puede ser consumida desde un import de la manera siguiente:

**index.js**

```javascript
import {add} from './math';

// También podríamos usar todos los métodos de math con
// import * as math from './math';
// math.add, math.multiply, ...

...
```

T> Ya que la sintaxis de los módulos de ES6 es analizable estáticamente, es posible usar heramientas como [analyze-es6-modules](https://www.npmjs.com/package/analyze-es6-modules).

### Imports con Alias

A veces puede ser útil hacer alias de imports. Por ejemplo:

```javascript
import {actions as TodoActions} from '../actions/todo'

...
```

`as` te permite evitar conflictos de nombrado.

### Webpack `resolve.alias`

Los empaquetadores, como Webpack, pueden dar funcionalidad más allá de esto. Puedes definir un `resolve.alias` para alguno de tus directorios de módulos, por ejemplo. Esto te permite usar un import como `import persist from 'libs/persist';` independientemente de dónde estés importando. Un simple `resolve.alias` puede ser algo como esto:

```javascript
...
resolve: {
  alias: {
    libs: path.join(__dirname, 'libs')
  }
}
```

La documentación oficial describe [las posibles alternativas](https://webpack.github.io/docs/configuration.html#resolve-alias) con todo lujo de detalles.

## Clases

Al contrario de como ocurre con otros lenguajes ahí fuera, JavaScript utiliza una herencia basada en prototipos en lugar de herencia basada en clases. Ambas aproximaciones tienen sus ventajas. De hecho, puedes imitar un modelo basado en clases utilizando uno basado en prototipos. Las clases de ES6 simplemente son azúcar sintáctico de los mecanismos de JavaScript, ya que internamente sigue utilizando el sistema antiguo, solo que parece algo distinto para el programador.

React permite definición de componentes basados en clases. No todos estamos de acuerdo en que sea algo bueno. Dicho esto, la definición puede estar bien siempre que no abuses de ella. Para darte un ejemplo sencillo, observa el código siguiente:

```javascript
import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // This es una propiedad fuera del funcionamiento de React.
    // Si no necesitas lanzar render() cuando cambia puede funcionar.
    this.privateProperty = 'private';

    // Estado específico de React. Puedes cambiarlo con `this.setState`, lo
    // cual podrá llamar a `render()`.
    this.state = {
      name: 'Class demo'
    };
  }
  render() {
    // Use estas propiedades de alguna manera.
    const privateProperty = this.privateProperty;
    const name = this.state.name
    const notes = this.props.notes;

    ...
  }
}
```

Quizá la mayor ventaja de la aproximación basada en clases sea el hecho de que reduce algo de complejidad, especialmente cuando involucra los métodos del ciclo de vida de React.

### Clases y Módulos

Como vimos antes, los módulos de ES6 permiten hacer `export` e `import` de uno o varios objetos, funciones o incluso clases. También puedes usar `export default class` para exportar una clase anónima o exportar varias clases desde el mismo módulo usando `export class className`.

**Note.jsx**

```javascript
export default class extends React.Component { ... };
```

**Notes.jsx**

```javascript
import Note from './Note.jsx';
...
```

También puedes usar `export class className` para exportar varias clases nombradas de un único módulo.

**Components.jsx**

```javascript
export class Note extends React.Component { ... };

export class Notes extends React.Component { ... };
```

**App.jsx**

```javascript
import {Note, Notes} from './Components.jsx';
...
```

Se recomienda que tengas las clases separadas en módulos diferentes.

## Propiedades de las Clases e Iniciadores de Propiedades

Las clases de ES6 no enlazan sus métodos por defecto. Esto puede suponer un problema a veces, ya que puede que quieras acceder a las propiedades de la instancia. Hay características experimentales conocidas como [las propiedades de las clases y los iniciadores de propiedades]https://github.com/jeffmo/es-class-static-properties-and-fields) que arreglan este problema. Sin ellos podríamos escribir algo como:

```javascript
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.renderNote = this.renderNote.bind(this);
  }
  render() {
    ...

    return this.renderNote();
  }
  renderNote() {
    // Dado que renderNote ha sido enlazado, podemos usar `this` como esperamos
    return <div>{this.props.value}</div>;
  }
}
App.propTypes = {
  value: React.PropTypes.string
};
App.defaultProps = {
  value: ''
};

export default App;
```

Utilizando propiedades de clases e iniciadores de propiedades podemos escribir algo más limpio en su lugar:

```javascript
import React from 'react';

export default class App extends React.Component {
  // la definición de propType mediante propiedades estáticas de la clase
  static propTypes = {
    value: React.PropTypes.string
  }
  static defaultProps = {
    value: ''
  }
  render() {
    ...

    return this.renderNote();
  }
  // El iniciador de propiedades se necarga del `bind`
  renderNote = () => {
    // Dado que renderNote ha sido enlazado, podemos usar `this` como esperamos
    return <div>{this.props.note}</div>;
  }
}
```

Ahora que nos hemos llevado la declaración a nivel de método el código se lee mejor. He decidido usar esta característica en este libro principalmente por este motivo. Hay menos de lo que preocuparse.

## Funciones

JavaScript ha sido tradicionalmente muy flexible con respecto a las funciones. Para que te hagas una mejor idea, aquí tienes la implementación de `map`:

```javascript
function map(cb, values) {
  var ret = [];
  var i, len;

  for(i = 0, len = values.length; i < len; i++) {
    ret.push(cb(values[i]));
  }

  return ret;
}

map(function(v) {
  return v * 2;
}, [34, 2, 5]); // salen [68, 4, 10]
```

En ES6 podríamos haberlo escrito de esta manera:

```javascript
function map(cb, values) {
  const ret = [];
  const i, len;

  for(i = 0, len = values.length; i < len; i++) {
    ret.push(cb(values[i]));
  }

  return ret;
}

map((v) => v * 2, [34, 2, 5]); // salen [68, 4, 10]
```

La implementación de `map` es más o menos lo mismo. La parte interesante es la forma en la que lo llamamos. En concreto, `(v) => v * 2` es fascinante. En lugar de tener que escribir `function` por todos lados, la sintaxis de la flecha gorda nos da un pequeño y útil atajo. Para ver más ejemplos de uso hecha un vistazo a lo que sigue:

```javascript
// Todas son equivalentes
v => v * 2;
(v) => v * 2; // Prefiero esta opción en funciones cortas
(v) => { // Usa esta si necesitas ejecutar varias sentencias
  return v * 2;
}

// Podemos enlazarlo a una variable
const double = (v) => v * 2;

console.log(double(2));

// Si quieres usar un atajo y devolver un objeto
// necesitas encapsular el objeto.
v => ({
  foo: 'bar'
});
```

### El contexto de la Función Flecha

Las funciones flecha son un tanto especiales ya que no tienen un `this` propio. En su lugar, `this` apunta al ámbito del objeto invocante. Fíjate en el siguiente ejemplo:

```javascript
var obj = {
  context: function() {
    return this;
  },
  name: 'demo object 1'
};

var obj2 = {
  context: () => this,
  name: 'demo object 2'
};

console.log(obj.context()); // { context: [Function], name: 'demo object 1' }
console.log(obj2.context()); // {} en Node.js, Window en el navegador
```

Como puedes ver en el código anterior, la función anónima tiene un `this` que apunta a la función `context` del objeto `obj`. En otras palabras, está enlazando el ámbito del objeto `obj` a la función `context`.

Esto es así porque `this` no apunta al ámbito del objeto que lo contiene, sino al ámbito del objeto que lo invoca, como puedes ver en el siguiente fragmento de código:

```javascript
console.log(obj.context.call(obj2)); // { context: [Function], name: 'demo object 2' }
```

La función flecha en el objeto `obj2` no enlaza ningún objeto a su contexto, siguendo lo que serían las reglas normales de ámbitos resolviendo la referencia al ámbito inmediatemente superior.

Incluso cuando este comportamiento parece ser un poco extraño, en realidad es útil. En el pasado, si querías acceder al contexto de la clase padre necesitabas enlazarlo o relacionarlo en una variable del estilo `var that = this;`. La introducción de la sintaxis de la función flecha ha mitigado este problema.

### Parámetros de las Funciones

Históricamente, lidiar con los parámetros de las funciones ha sido algo limitado. hay varios hacks, como `values = values || [];`, pero no son particularmente buenos y son propensos a errores. Por ejemplo, el uso de `||` puede causar problemas con ceros. ES6 soluciona este problema introduciendo parámetros por defecto. De este modo, podemos escribir simplemente `function map(cb, values=[])`.

Hay más que esto y los valores por defecto pueden depender unos de otros. También puedes pasar una cantidad arbitraria de parámetros mediante `function map(cb, ...values)`. En este caso, puedes llamar a la función usando `map(a => a * 2, 1, 2, 3, 4)`. Este API puede que no sea perfecto para `map`, pero puede tener más sentido en otro escenario.

También hay medios útiles para extraer valores de los objetos enviados. Esto es muy útil con los componentes de React que se definen como funciones:

```javascript
export default ({name}) => {
  // Interpolación de strings en ES6. ¡Observa las tildes!
  return <div>{`Hello ${name}!`}</div>;
};
```

## Interpolación de Strings

Antiguamente, lidiar con strings era algo doloroso en JavaScript. Por lo general se utilizaba una sintaxis del tipo `'Hello' + name + '!'`. Sobrecargar `+` para alcanzar este propósito quizá no era la mejor manera ya que podia provocar comportamientos extraños. Por ejemplo, `0 + ' world` puede devolver el string `0 world` como resultado.

Aparte de ser más clara, la interpolación de strings de ES6 permite strings multilínea. Esto es algo que la anterior sintaxis no soportaba. Observa los siguientes ejemplos:

```javascript
const hello = `Hello ${name}!`;
const multiline = `
multiple
lines of
awesomeness
`;
```

Puede que tardes un poco hasta que te acostumbres a la tilde, pero es poderosa y menos propensa a errores.

## Destructuring

Eso de `...` está relacionado con la idea de destructuring. Por ejemplo, `const {lane, ...props} = this.props;` sacará `lane` fuera de `this.props` mientras que el resto del objeto se quedará en `props`. Esta sintaxis es todavía experimental en objetos. ES6 especifica una forma oficial de poder hacer lo mismo en arrays como sigue:

```javascript
const [lane, ...rest] = ['foo', 'bar', 'baz'];

console.log(lane, rest); // 'foo', ['bar', 'baz']
```

El operador spread (`...`) es útil para concatenaciones. Verás sintaxis similar con frecuencia en ejemplos de Redux. Se basa en el experimental [Object rest/spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread):

```javascript
[...state, action.lane];

// Esto es igual que
state.concat([action.lane])
```

La misma idea funciona en los componentes de React:

```javascript
...

render() {
  const {value, onEdit, ...props} = this.props;

  return <div {...props}>Spread demo</div>;
}

...
```

## Iniciadores de Objetos

ES6 facilita varias funcionalidades para hacer que sea más sencillo trabajar con objetos. Citando a [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), fíjate en los siguientes ejemplos:

```javascript
const a = 'demo';
const shorthand = {a}; // Lo mismo que {a: a}

// Métodos atajo
const o = {
  get property() {},
  set property(value) {},
  demo() {}
};

// Nombres de propiedades procesadas
const computed = {
  [a]: 'testing' // demo -> testing
};
```

## `const`, `let`, `var`

En JavaScript, las variables son globales por defecto. `var` las enlaza a *nivel de función*, lo cual es un contraste con muchos otros lenguajes que implementan enlazamiento a *nivel de bloque*. ES6 introduce enlazamiento a nivel de bloque con `let`.

`const` también está soportado, lo que garantiza que la referencia a una variable no pueda ser cambiada. Esto, sin embargo, no significa que no puedas cambiar el contenido de la variable, así que si estás apuntando a un objeto, ¡todavía tendrás permitido cambiarlo!

Suelo utilizar `const` siempre que sea posible. Si necesito que algo sea mutable, `let` es estupendo. Es difícil encontrar un uso útil de `var` teniendo `const` y `let`. De hecho, todo el código de este libro, exceptuando el apéndice, utiliza `const`, lo que quizá pueda enseñarte lo lejos que puedes llegar con él.

## Decoradores

Dado que los decoradores son todavía una funcionalidad experimental hay mucho que hablar de ellos. Hay un apéndice entero dedicado a este tema. Lee *Entendiendo los Decoradores* para más información.

## Conclusión

Hay mucho más ES6 y más especificaciones que éstas. Si quieres entender la especificación mejor, [ES6 Katas](http://es6katas.org/) es un buen punto en el que comenzar para aprender más. Únicamente teniendo una buena idea de lo básico podrás llegar lejos.
