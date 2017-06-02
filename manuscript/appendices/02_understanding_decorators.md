# Entendiendo los Decoradores

Si has usado lenguajes de programación antes, como Java o Python, puede que la idea te resulte familiar. Los decoradores son azúcar sintáctico que te permiten envolver y anotar clases y funciones. En su [actual propuesta](https://github.com/wycats/javascript-decorators) (fase 1) sólo se permite la envoltura a nivel de clase y de método. Las funciones puede que sean soportadas en el futuro.

Con Babel 6 puedes habilitar este comportamiento mediante los plugins [babel-plugin-syntax-decorators](https://www.npmjs.com/package/babel-plugin-syntax-decorators) y [babel-plugin-transform-decorators-legacy](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy). El primero da soporte a nivel de sintáxis mientras que el segundo da el tipo de comportamiento que vamos a discutir ahora.

El mayor beneficio de los decoradores es que nos permiten envolver comportamiento en partes simples y reutilizables a la vez que reducimos la cantidad de ruido. Es totalmente posible programar sin ellos, sólo hacen que algunas de las tareas acaben siendo más agradecidas, como vimos con las anotaciones relacionadas con arrastrar y soltar.

## Implementando un Decorador para Generar Logs

A veces es útil saber qué métodos han sido invocados. Por supuesto que puedes usar `console.log` pero es más divertido implementar `@log`. Es una forma mejor de tenerlo controlado. Observa el siguiente ejemplo:

```javascript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);

    return oldValue.apply(null, arguments);
  };

  return descriptor;
}

const math = new Math();

// los argumentos pasados deberían aparecer en el log
math.add(2, 4);
```

La idea es que nuestro decorador `log` envuelva la función original, lance un `console.log` y, finalmente, haga la invocación con los [argumentos](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments) originales. Puede que te parezca un poco extraño si nunca antes habías visto `arguments` o `apply`.

`apply` puede ser visto como otra forma de invocar una función pasándole su contexto (`this`) y sus parámetros como un array. `arguments` recibe de forma implícita todos los parámetros con los que se ha invocado a la función así que es ideal para este caso.

El logger puede ser movido a un módulo aparte. Tras ello, podemos usarlo en nuestra aplicación en aquellos lugares donde queramos mostrar el log de algunos métodos. Una vez han sido implementados, los decoradores se convierten en una herramienta poderosa.

El decorador recibe tres parámetros:

* `target` se relaciona con la instancia de la clase.
* `name` contiene el nombre del método que va a ser ejecutado.
* `descriptor` es la pieza más interesante ya que nos permite anotar un método y manipular su comportamiento. Puede tener el siguiente aspecto:

```javascript
const descriptor = {
  value: () => {...},
  enumerable: false,
  configurable: true,
  writable: true
};
```

Como puedes ver, `value` hace que sea posible envolver el comportamiento. Lo demás te permite modificar el comportamiento a nivel de método. Por ejemplo, un decorador `@readonly` puede limitar el acceso. `@memoize` es otro ejemplo interesante ya que permite que los métodos implementen cacheo fácilmente.

## Implementado `@connect`

`@connect` envolverá nuestro componente en otro componente. Se encargará de lidiar con la lógica de conexión (`listen/unlisten/setState`). Mantendrá internamente el estado del almacén y se lo pasará a los componentes hijos que estén siendo envueltos. Durante el proceso, enviará el estado mediante props. La siguiente implementación ilustra la idea:

**app/decorators/connect.js**

```javascript
import React from 'react';

const connect = (Component, store) => {
  return class Connect extends React.Component {
    constructor(props) {
      super(props);

      this.storeChanged = this.storeChanged.bind(this);
      this.state = store.getState();

      store.listen(this.storeChanged);
    }
    componentWillUnmount() {
      store.unlisten(this.storeChanged);
    }
    storeChanged() {
      this.setState(store.getState());
    }
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  };
};

export default (store) => {
  return (target) => connect(target, store);
};
```

¿Puedes ver la idea del decorador? Nuestro decorador vigila el estado del almacén. Tras ello, pasa el estado al componente contenido mediante props.

T> `...` es conocido como el [operador spread](https://github.com/sebmarkbage/ecmascript-rest-spread). Expande el objeto recibido para separar los pares clave-valor, o propiedades, como en este caso.

Puedes conectar el decorador con `App` de este modo:

**app/components/App.jsx**

```javascript
...
import connect from '../decorators/connect';

...

@connect(NoteStore)
export default class App extends React.Component {
  render() {
    const notes = this.props.notes;

    ...
  }
  ...
}
```

Llevar la lógica a un decorador nos permite mantener nuestros componentes sencillos. Ahora debería ser trivial poder añadir más almacenes y conectarlos a los componentes si quisiéramos. E incluso mejor, podriamos conectar varios almacenes a un único componente fácilmente.

## Ideas para Decoradores

Podemos crear decoradores para varias desarrollar distintas funcionalidades, como es la de deshacer, de esta manera. Esto nos permite mantener nuestros componentes limpios y empujar la lógica común a algún lugar fuera de nuestra vista. Los decoradores bien diseñados pueden ser utilizados en varios proyectos.

### El `@connectToStores` de Alt

Alt facilita un decorador similar conocido como `@connectToStores`. Se apoya en métodos estáticos. En lugar de ser métodos normales que están incluidos en una instancia específica, se incluyen a nivel de clase. Esto significa que puedes llamarlos a través de la propia clase (p.e., `App.getStores()`). El siguiente ejemplo muestra cómo podemos integrar `@connectToStores` en nuestra aplicación:

```javascript
...
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
export default class App extends React.Component {
  static getStores(props) {
    return [NoteStore];
  };
  static getPropsFromStores(props) {
    return NoteStore.getState();
  };
  ...
}
```

Esta aproximación es muy parecida a nuestra implementación. En realidad hace más ya que te permite conectar con varios almacenes a la misma vez. También te dá más control sobre la forma en la que puedes encajar el almacén de estados con las props.

## Conclusión

Aunque todavía sean un tanto experimentales, los decoradores son una buena forma de llevar lógica allá donde pertenezca. Mejor todavía, nos dan un grado de reusabilidad mientras mantienen nuestros componentes ordenados y limpios.
