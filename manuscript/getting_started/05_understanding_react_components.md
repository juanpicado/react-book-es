# Comprendiendo los Componentes de React

Hasta donde hemos visto, los componentes de React son muy sencillos: Tienen un `estado` interno y aceptan propiedades (`props`). Aparte de esto, React facilita puntos de enganche que te permitirán hacer cosas más avanzadas, entre las que que se incluyen los métodos que gestionan el ciclo de vida y las referencias (`refs`). También existe una serie de propiedades y de métodos de los que te conviene ser consciente.

## Métodos del Ciclo de Vida

![Lifecycle methods](images/lifecycle.png)

En la imagen superior puedes ver que cada componente de React tiene tres fases durante su ciclo de vida. Puede estar **montándose**, **montado** o **desmontado**. Cada una de esas tres fases tiene una serie de métodos relacionados.

Durante la fase de montaje puedes acceder a los siguientes:

* `componentWillMount()` se ejecutará una vez antes de renderizar nada. Una forma de utilizarlo puede ser cargar datos de forma asíncrona y forzar un renderizado a través de `setState`. `render()` verá que el estado ha sido actualizado y se ejecutará. La ejecución tendrá lugar durante el renderizado en el servidor.
* `componentDidMount()` se ejecutará tras el renderizado inicial. Es en este punto donde puedes acceder al DOM. Puedes usar este método, por ejemplo, para utilizar jQuery en un componente. Esta ejecución **no tendrá lugar** cuando se está renderizando en el servidor.

Una vez que un componente ha sido montado y está en funcionamiento puedes manipularlo con los siguientes métodos:

* `componentWillReceiveProps(object nextProps)` se ejecuta cuando el componente recibe propiedades nuevas. Puedes usarlo, por ejemplo, para modificar el estado de tu componente según estas propiedades que has recibido.
* `shouldComponentUpdate(object nextProps, object nextState)` te permite optimizar el renderizado, ya que devuelve `false` si detecta que no hay ningún cambio que aplicar tras comprobar las propiedades y en estado. Es aquí donde [Immutable.js](https://facebook.github.io/immutable-js/) y otras librerías similares te serán muy útiles a la hora de comprobar equidades. [La documentación oficial](https://facebook.github.io/react/docs/optimizing-performance.html#shouldcomponentupdate-in-action) entra en más detalles.
* `componentWillUpdate(object nextProps, object nextState)` se ejecuta tras `shouldComponentUpdate` y antes de `render()`. No es posible utilizar `setState` aquí pero puedes, por ejemplo, cambiar propiedades de los estilos.
* `componentDidUpdate(object nextProps, object nextState)` se ejecuta tras el renderizado. En este punto puedes modificar el DOM. Puede ser útil para hacer que otro código funcione con React.

Para terminar, hay una enganche más que puedes utilizar cuando un componente está desmontándose:

* `componentWillUnmount()` se ejecuta justo antes de que un componente se desconecte del DOM. Es el lugar perfecto para limpiar recursos (por ejemplo, borrar temporizadores, elementos DOM personalizados, y cosas así).

A menudo `componentDidMount` y `componentWillUnmount` van emparejados. Si configuras algo relacionado con el DOM o creas un listener en `componentDidMount` tendrás que recordar quitarlo con `componentWillUnmount`.

## Refs

Los [refs](https://facebook.github.io/react/docs/more-about-refs.html) de React te permiten acceder al DOM que hay por debajo fácilmente. Al utilizarlos podrás enlazar tu código a la página web.

Las referencias necesitan una instancia que les dé soporte, lo que significa que sólo funcionan con `React.createClass` o con definiciones de clases basadas en componentes. La idea principal es la siguiente:

```javascript
<input type="text" ref="input" />

...

// Accede en cualquier lugar
this.refs.input
```

Aparte de a cadenas de texto, las referencias permiten que realices una llamada una vez que el componente sea montado. Puedes inicializar algo en este punto o capturar la referencia:

```javascript
<input type="text" ref={element => element.focus()} />
```

## Propiedades y Métodos Propios

Más allá del ciclo de vida y de las referencias hay una gran cantidad de [propiedades y métodos](https://facebook.github.io/react/docs/component-specs.html) de los cuales deberías ser consciente, especialmente si vas a utilizar `React.createClass`:

* `displayName` - Es preferible establecer un `displayName` ya que nos permitirá depurar mejor. Para las clases de ES6 este valor se genera automáticamente a partir del nombre de la clase. Puedes ponerle también un `displayName` a un componente basado en una función anónima.
* `getInitialState()` - Se puede conseguir lo mismo con clases utilizando el `constructor`.
* `getDefaultProps()` - En clases las estableces dentro del `constructor`.
* `render()` - Es la piedra angular de React. Debe [devolver un único nodo](https://facebook.github.io/react/tips/maximum-number-of-jsx-root-nodes.html) ya que si devuelves varios no funcionará.
* `mixins` - `mixins` contiene un array de mixins que aplicar a los componentes.
* `statics` - `statics` contiene propiedades estáticas y métodos para un componente. Con ES6 puedes asignárselos a la clase del siguiente modo:

```javascript
class Note {
  render() {
    ...
  }
}
Note.willTransitionTo = () => {...};

export default Note;
```

También puedes escribirlo así:

```javascript
class Note {
  static willTransitionTo() {...}
  render() {
    ...
  }
}

export default Note;
```

Algunas librerías, como React DnD, se apoyan en métodos estáticos para facilitar enganches de transición. Esto te permite controlar qué ocurre cuando un componente se muestra o se oculta. Por definición todo lo estático se encuentra disponible en la propia clase.

Los componentes de React te permiten documentar la interfaz de tu componente utilizando `propTypes` de este modo:

```javascript
const Note = ({task}) => <div>{task}</div>;
Note.propTypes = {
  task: React.PropTypes.string.isRequired
}
```

Lee el capítulo *Tipado con React* Para saber más sobre `propTypes`.

## Convenciones de los Componentes de React

Prefiero tener el contructor primero, seguido de los métodos del ciclo de vida, `render()` y, finalmente, los métodos usados por `render()`. Esta aproximación de arriba a abajo me hace más sencillo leer el código. Hay una convención opuesta que deja `render` como último método. Las convenciones con respecto a los nombres también varían. Tendrás que encontrar aquellas convenciones que te hagan sentir más cómodo.

Puedes obligarte a utilizar una convención utilizando un linter (un analizador de código) como [ESLint](http://eslint.org/). El uso de linters decrementa la cantidad fricción que puede aparecer al trabajar sobre el código de otros. Incluso en proyectos personales, el uso de herramientas que te permitan verificar la sintaxis y los estándares son muy útiles. No sólo reduce la cantidad y la gravedad de los errores sino que además te permite encontrarlos cuanto antes.

Si configuras un sistema de integración contínua podrás realizar pruebas contra muchas plataformas y detectar errores de regresión pronto. Esto es especialmente importante si estás utilizando rangos de versiones no muy definidos, ya que a veces la gestioń de dependencias pueden acarrear problemas y es bueno detectarlos.

## Conclusion

No sólo la definición de componentes de React es muy sencilla, sino que además es pragmática. Las partes más avanzadas pueden llevar tiempo hasta que se llegan a dominar, pero es bueno saber que están allí.

En el próximo capítulo continuaremos con la implementación que permitirña a los usuarios editar sus notas individualmente.
