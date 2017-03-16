# React y Flux

Puedes llegar bastante lejos guardándolo todo en componentes, lo cual una forma completamente válida de comenzar. El problema comenzará cuando añadas estado a tu aplicación y necesites compartirlo en distintos sitios. Por este motivo han sido varios los gestores de estado que han aparecido. Cada uno de ellos trata de resolver el problema a su manera.

La [arquitectura Flux de aplicaciones](https://facebook.github.io/flux/docs/overview.html) fué la primera solución al problema. Te permite modelar tu aplicación mediante el uso de **Acciones**, **Almacenes** y **Vistas**. También tiene una parte conocida como **Dispatcher** con la que gestionar acciones y permitirte modelar dependencias entre las distintas llamadas.

Esta forma de oganización es particulamente útil cuando estas trabajando en equipos grandes. El flujo unidireccional hace fácil poder saber qué está pasando. Este es un elemento común de varias soluciones de gestión de estados disponibles en React.

## Breve Introducción a Redux

Existe una solución llamada [Redux](http://redux.js.org/) que rescata las ideas principales de Flux y las moldea para tener una forma concreta. Redux es más que una simple guía que sirve para que le dés a tu aplicación cierta estructura ya que te empuja a modelar todo lo relacionado con la gestión de los datos de una manera concreta. Mantendrás el estado de tu aplicación en una estructura de árbol que modificarás usando funciones puras (las cuales no tienen efectos secundarios) mediante reductores.

Puede parecer un poco complicado pero, en la práctica, Redux hace que el flujo de tus datos sea explícito. Flux estándar no es dogmático en algunas cosas. Creo que entender Flux de forma básica antes de produndizar en Redux es una buena idea para ver cosas que ambos tienen en común.


## Breve Introducción a MobX

[MobX](https://mobxjs.github.io/mobx/) tiene un punto de vista totalmente diferente sobre la gestión de datos. Si Redux te ayuda a modelar tu flujo de datos de manera explícita, MobX hace el esfuerzo de que sea implícita. No te obliga a seguir determinada estructura. En su lugar, tendrás que anotar tus estructuras de datos como **observable** y dejar a MobX gestionar cuándo se actualizan tus vistas.

Mientras que Redux adopta el concepto de inmutabilidad a través de la idea de los reductores, MobX hace justo lo contrario y apoya la mutación. Esto implica que ciertos asuntos como la gestión de referencias pueden ser extraordinariamente sencillos en MobX mientras que en Redux te verás forzado a normalizar tus datos para que puedas manipularlos fácilmente con reductores.

Tanto Redux como MobX son valiosos a su manera. No hay una solución correcta cuando de la gestión de datos se trata. Estoy seguro de que aparecerán más alternativas a medida que pase el tiempo. Cada solución tiene sus propias ventajas e inconvenientes. Entendiendo las alternativas tendrás una mejor capacidad de seleccionar la solución que mejor encaje con lo que necesites llegado el momento.

## ¿Qué Sistema de Gestión de Datos Debería Utilizar?

El mapa de gestores de datos está cambiando constantemente. En la actualidad [Redux](http://redux.js.org) es muy popular, pero hay buenas alternativas a la vista. [voronianski/flux-comparison](https://github.com/voronianski/flux-comparison) muestra una comparativa entre algunos de los más populares.

La elección de una librería está condicionada a tus propias preferencias personales. Tienes que tener en cuenta factores como API, funcionalidades, documentación y soporte. Comenzar con una de las alternativas más populares puede ser una buena idea. Podrás hacer elecciones que se ajusten más a lo que quieres a medida que vayas conociendo mejor la arquitectura.

Para esta aplicación vamos a utilizar una implementación de Flux conocida con el nombre de [Alt](http://alt.js.org/). Su API está bien diseñado y es suficiente para nuestro propósito. Como extra, Alt ha sido diseñado teniendo en mente el renderizado isomórfico (renderiza de igual manera tanto en servidor como en cliente). Si conoces Flux tendrás un buen punto de partida con el que comprender mejor las alternativas.

El libro no cubre todas las soluciones alternativas en detalle todavía, pero diseñaremos la aplicación de tal forma que podamos utilizar alternativas más adelante. La idea es que podamos aislar la vista de la gestión de datos para que podamos intercambiar esta gestión sin tener que cambiar código de React. Es una forma de diseñar pensando en el cambio.

## Introducción a Flux

![Unidirectional Flux dataflow](images/flux_linear.png)

De momento sólo hemos trabajado con vistas. La arquitectura Flux introduce un par de conceptos nuevos, los cuales son acciones, dispatchers y almacenes. Flux implementa un flujo unidireccional, al contrario que otros frameworks populares como Angular o Ember. Aunque los flujos bidireccionales puedan ser convenientes, éstos tienen un coste. Puede ser difícil saber qué está pasando y por qué.

### Acciones y Almacenes

Flux no es totalmente trivial ya que hay algunos conceptos que tener en cuenta. En nuestro caso modelaremos `NoteActions` y `NoteStore`. `NoteActions` facilita operaciones concretas que podremos realizar sobre nuestros datos. Por ejemplo, podremos tener `NoteActions.create({task: 'Aprender React'})`.

### Dispatcher

El dispatcher percibirá que hemos ejecutado una acción. No sólo eso, sino que el dispatcher será capaz de lidiar con las posibles dependencias que existan entre almacenes. Es probable que cierta acción necesite ser ejecutada después de otra, el dispacher nos permitirá lograr todo ello.

El almacén detectará que el dispacher ha procesado una acción y se invocará. En nuestro caso se notificará a `NoteStore`. Como resultado, será capaz de actualizar su estado interno y, tras hacer esto, notificará del nuevo estado.

### El Flujo de Datos de Flux

Esto completa el flujo de flujo unidireccional, aunque lineal, básico de Flux. Por regla general el proceso unidireccional tiene un flujo cíclico que no necesariamente termina. El siguiente diagrama ilustra un flujo más común. Es la misma idea de nuevo, pero incluye un ciclo de retorno. Para terminar, los componentes se actualizan a través de este proceso de bucle dependiendo de los datos de nuestro almacén.

![Cyclical Flux dataflow](images/flux.png)

Parece que se dan muchos pasos para conseguir algo tan simple como crear una nueva `Nota`. Esta aproximación, sin embargo, conlleva sus propios beneficios. Es muy fácil de trazar y de depurar puesto que el flujo siempre actúa en una única dirección. Si algo está mal, está en algún lugar del ciclo.

Mejor todavía: podemos ver los datos que recorren nuestra aplicación. Tan sólo conecta tu vista a tu almacén y ya lo tienes. Ésta es uno de las mayores ventajas de utilizar una solución de gestión de estados.

### Ventajas de Flux

Aunque todo esto suene complicado, esta forma de trabajar dará flexibilidad a tu aplicación. Podemos, por ejemplo, implementar comunicación con un API, cachés, e internacionalización fuera de nuestras vistas. De esta forma se mantienen lejos de la lógica a la vez que las aplicaciones siguen siendo fáciles de entender.

Implementar una arquitectura Flux en tu aplicación incrementará la cantidad de código de alguna manera. Es importante comprender que la meta de Flux no es minimizar la cantidad de código escrito. Ha sido diseñado para que haya productividad en equipos grandes. Siempre se puede decir que explícito es mejor que implícito.

## Migrando a Alt

![Alt](images/alt.png)

En Alt trabajarás con acciones y almacenes. El dispatcher está oculto, pero puedes acceder a él si lo necesitas. Comparado con otras implementaciones, Alt oculta mucho código reutilizable. Tiene algunas ceracterísticas especiales que te permitirán guardar y recuperar el estado de la aplicación, lo cual es útil para implementar tanto persistencia como renderizado universal.

Hay un par de pasos que debemos seguir para permitir que Alt gestione el estado de nuestra aplicación:

1. Configurar una instancia de Alt para que siga las acciones, los almacenes y coordine la comunicación.
2. Conectar Alt con las vistas.
3. Dejar nuestros datos en un almacén.
4. Definir acciones que permitan manipular el almacén.

Lo iremos haciendo paso a paso.  Las partes específicas de Alt van después de los adaptadores. El enfoque de adaptadores nos permite cambiar fácilmente de idea más adelante así que vale la pena implementarlos.

### Configurando una Instancia de Alt

Todo en Alt comienza desde una instancia de Alt. Hace un seguimiento de las acciones y los almacenes y permite que la comunicación fluya. Para hacer que todo sea sencillo trataremos a todos los componentes de Alt como si fueran [singleton](https://es.wikipedia.org/wiki/Singleton). Gracias a este patrón podremos reutilizar la misma instancia dentro de nuestra aplicación.

Para conseguirlo podemos dejarlo en un módulo y referenciarlo desde cualquier sitio. Configúralo tal y como sigue:

**app/libs/alt.js**

```javascript
import Alt from 'alt';

const alt = new Alt();

export default alt;
```

Esta es la forma estándar de implementar *singletons* usando la sintaxis de ES6. Cachea el módulo de tal forma que te devolverá la misma instancia la próxima vez que importes Alt desde donde sea.

T> Observa que `alt.js` debe ir bajo `app/libs`, ¡no en el directorio `libs` del raíz!

T> El patrón singleton garantiza que habrá una y sólo una instancia. Este es precisamente el comportamiento que queremos ahora.

### Uniendo Alt con las Vistas

Por normal general los gestores de estados facilitan dos cosas que pueden ser usadas para conectar con una aplicación React. Esto son el `Proveedor` y una función de alto nivel `conectar` (una función que devuelve una función que genera un componente). El `Proveedor` configura un [contexto de react](https://facebook.github.io/react/docs/context.html).

Los contextos son una característica avanzada que puede ser utilizada para enviar datos de forma implícita a través de la jerarquía de componentes sin utilizar props. La función `conectar` utiliza el contexto para cavar un hueco en el que enviar los datos al componente.

Es posible utilizar `conectar` a través de la invocación de funciones o de un decorador como veremos pronto. El apéndice *Entendiendo los Decoradores* entra más en profundidad en este patrón.

Para permitir que la arquitectura de nuestra aplicación sea sencilla de modificar necesitaremos configurar dos adaptadores, uno para el `Proveedor` y otro para `conectar`. Nos enfrentaremos con los detalles específicos de Alt en ambos sitios.

### Configurando un `Proveedor`

Voy a utilizar una configuración especial que nos permitirá que nuestro `Proveedor` sea flexible. Lo envolveremos en un módulo que eligirá un `Proveedor` u otro dependiendo de nuestro entorno. Esto nos permitirá usar herramientas de desarrollo sin incluirlas en el pack de producción. Es necesario hacer algo de configuración extra pero merece la pena puesto que así tendremos un resultado más limpio.

El punto de partida de esto está en el index del módulo. CommonJS escoje por defecto el fichero **index.js** del directorio cuando hacemos un import de ese directorio. No podemos dejarlo en mano de los módulos de ES6 dado que queremos un comportamiento dinámico.

La idea es que nuestro componente reescriba el código dependiendo de la variable `process.env.NODE_ENV`, la cual servirá para seleccionar el módulo que queramos incluir. Aquí tenemos el punto de entrada de nuestro `Proveedor`:

**app/components/Provider/index.js**

```javascript
if(process.env.NODE_ENV === 'production') {
  module.exports = require('./Provider.prod');
}
else {
  module.exports = require('./Provider.dev');
}
```

También necesitaremos los ficheros a los cuales está apuntando el fichero index. La primera parte es sencilla. Aquí necesitamos apuntar a nuestra instancia de Alt, conectarlo con un componente cnmocido como `AltContainer` y renderizar nuestra aplicación con él. Es aquí donde `props.children` entran en juego. Es la misma idea de antes.

`AltContainer` nos permitirá conectar los datos de nuestra aplicación a nivel de componente cuando implementemos `conectar`. Para ello, aquí tienes la implementación a nivel de producción:

**app/components/Provider/Provider.prod.jsx**

```javascript
import React from 'react';
import AltContainer from 'alt-container';
import alt from '../../libs/alt';
import setup from './setup';

setup(alt);

export default ({children}) =>
  <AltContainer flux={alt}>
    {children}
  </AltContainer>
```

La implementación de `Proveedor` puede cambiar dependiendo del gestor de estados que estemos utilizando. Es posible que finalmente no haga nada, lo cual es aceptable. La idea es que tengamos un punto de extensión donde poder modificar nuestra aplicación si lo necesitamos.

Todavía nos estamos dejando una parte, la relacionada con la configuración de desarrollo. Será como la de producción con la excepción de que esta vez podremos habilitar herramientas específicas de desarrollo. Es una buena oportunidad de mover la configuración de *react-addons-perf* aquí desde el *app/index.jsx* de la aplicación. También estoy habilitando [las herramientas de debug de Chrome para Alt](https://github.com/goatslacker/alt-devtool). Tendrás que instalar Chrome si quieres utilizarlas.

Aquí tienes el código completo del proveedor de desarrollo:

**app/components/Provider/Provider.dev.jsx**

```javascript
import React from 'react';
import AltContainer from 'alt-container';
import chromeDebug from 'alt-utils/lib/chromeDebug';
import alt from '../../libs/alt';
import setup from './setup';

setup(alt);

chromeDebug(alt);

React.Perf = require('react-addons-perf');

export default ({children}) =>
  <AltContainer flux={alt}>
    {children}
  </AltContainer>
```

El módulo `setup` permite hacer toda la configuración relacionada con Alt que sea común tanto para el entorno de producción como para el entorno de desarrollo. De momento con que no haga nada es suficiente:

**app/components/Provider/setup.js**

```javascript
export default alt => {}
```

Todavía necesitamos conectar el `Proveedor` con nuestra aplicación modificando *app/index.jsx*. Haz los siguientes cambios:

**app/index.jsx**

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
leanpub-start-insert
import Provider from './components/Provider';
leanpub-end-insert

leanpub-start-delete
if(process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf');
}
leanpub-end-delete

ReactDOM.render(
leanpub-start-delete
  <App />,
leanpub-end-delete
leanpub-start-insert
  <Provider><App /></Provider>,
leanpub-end-insert
  document.getElementById('app')
);
```

Si miras la salida de Webpack verás que hay nuevas dependencias que se han instalado en el proyecto. Es lo que podemos esperar dados los cambios. El proceso puede tardar un rato en terminar, una vez que lo haga, refresca el navegador.

Dado que no hemos cambiado la lógica de la aplicación de ninguna manera, todo debería tener el mismo aspecto de antes. Un buen paso con el que continuar es implementar un adaptador que conecte los datos con nuestras vistas.

T> Puedes encontrar una idea similar en [react-redux](https://www.npmjs.com/package/react-redux). MobX no necesita un `Proveedor` para nada. En este caso nuestra implementación únicamente devolverá `children`.

## Entendiendo `conectar`

La idea de `conectar` es la de permitirnos incrustar datos y acciones concretas a componentes. Es así como podemos conectar los datos de los carriles y las acciones con `App`:

```javascript
@connect(({lanes}) => ({lanes}), {
  laneActions: LaneActions
})
export default class App extends React.Component {
  render() {
    return (
      <div>
        <button className="add-lane" onClick={this.addLane}>+</button>
        <Lanes lanes={this.props.lanes} />
      </div>
    );
  }
  addLane = () => {
    this.props.laneActions.create({name: 'New lane'});
  }
}
```

Se puede escribir lo mismo sin decoradores. Esta es la sintáxis que utilizaremos en nuestra aplicación:

```javascript
class App extends React.Component {
  ...
}

export default connect(({lanes}) => ({lanes}), {
  LaneActions
})(App)
```

En caso de que necesites aplicar varias funciones de alto nivel contra un componente, puedes utilizar una utilidad como `compose` y usarla con `compose(a, b)(App)`. Esto será igual a `a(b(App))` y se puede leer mejor.

En los ejemplos mostrados `compose` es una función que devuelve una función. Por ello lo llamamos función de alto nivel. Al final obtendremos un componente de ella. Este envoltorio nos permite manejar todo lo relacionado con la conexión con los datos.

Podemos utilizar una función de alto nivel para anotar nuestros componentes y darles además otras propiedades especiales. Veremos esta idea cuando implementemos la funcionalidad de arrastrar y soltar. Los decoradores brindan una forma sencilla de incluir estos tipos de anotaciones. El apéndice *Entendiendo los Decoradores* profundiza más en este asunto.

Ahora que entendemos básicamente cómo debería funcionar `conectar` podemos implementarlo.

### Configurando `conectar`

Voy a utilizar un `conectar` personalizado para remarcar un par de ideas clave. La implementación no es óptima en terminos de rendimiento pero será suficiente para esta aplicación.

Es posible optimizar el rendimiento con un trabajo posterior. Puedes utilizar uno de los conectores comunes en lugar de desarrollar el tuyo propio. He aquí una razón por la cual tener el control de `Proveedor` y `conectar` es útil, permite personalizar más adelante y entender cómo funciona el proceso.

**app/libs/connect.jsx**

```javascript
import React from 'react';

export default (state, actions) => {
  if(typeof state === 'function' ||
    (typeof state === 'object' && Object.keys(state).length)) {
    return target => connect(state, actions, target);
  }

  return target => props => (
    <target {...Object.assign({}, props, actions)} />
  );
}

// Conectar con Alt a través del contexto. Esto no ha sido optimizado
// para nada. Si Alt almacena los cambios se forzará el renderizado.
//
// Ver *AltContainer* y *connect-alt* para encontrar soluciones óptimas
function connect(state = () => {}, actions = {}, target) {
  class Connect extends React.Component {
    componentDidMount() {
      const {flux} = this.context;

      flux.FinalStore.listen(this.handleChange);
    }
    componentWillUnmount() {
      const {flux} = this.context;

      flux.FinalStore.unlisten(this.handleChange);
    }
    render() {
      const {flux} = this.context;
      const stores = flux.stores;
      const composedStores = composeStores(stores);

      return React.createElement(target,
        {...Object.assign(
          {}, this.props, state(composedStores), actions
        )}
      );
    }
    handleChange = () => {
      this.forceUpdate();
    }
  }
  Connect.contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  return Connect;
}

// Convierte {store: <AltStore>} en {<store>: store.getState()}
function composeStores(stores) {
  let ret = {};

  Object.keys(stores).forEach(k => {
    const store = stores[k];

    // Combina el estado del almacén
    ret = Object.assign({}, ret, store.getState());
  });

  return ret;
}
```

Dado que `flux.FinalStore` no está disponible por defecto, necesitamos cambiar nuestra instacia de Alt para que la contenga. Tras ello podremos acceder a ella donde la necesitemos:

**app/libs/alt.js**

```javascript
import Alt from 'alt';
leanpub-start-insert
import makeFinalStore from 'alt-utils/lib/makeFinalStore';
leanpub-end-insert

leanpub-start-delete
const alt = new Alt();

export default alt;
leanpub-end-delete
leanpub-start-insert
class Flux extends Alt {
  constructor(config) {
    super(config);

    this.FinalStore = makeFinalStore(this);
  }
}

const flux = new Flux();

export default flux;
leanpub-end-insert
```

Podemos incrustar algunos datos de prueba en `App` y renderizarlos para ver `conectar` en acción. Haz los cambios siguientes para enviar datos a `App` y, después, mira cómo se muestran en la interfaz de usuario:

**app/components/App.jsx**

```javascript
import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';
leanpub-start-insert
import connect from '../libs/connect';
leanpub-end-insert

leanpub-start-delete
export default class App extends React.Component {
leanpub-end-delete
leanpub-start-insert
class App extends React.Component {
leanpub-end-insert
  constructor(props) {
    ...
  }
  render() {
    const {notes} = this.state;

    return (
      <div>
leanpub-start-insert
        {this.props.test}
leanpub-end-insert
        <button className="add-note" onClick={this.addNote}>+</button>
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

leanpub-start-insert
export default connect(() => ({
  test: 'test'
}))(App)
leanpub-end-insert
```

Refresca el navegador para mostrar el texto. Deberías poder ver ahora el texto que hemos conectado con `App`.

## Usando el dispatcher en Alt

Aunque hayamos llegado lejos sin utilizar el dispatcher de Flux, puede ser útil que sepamos algo sobre ello. Alt facilita dos formas de utilizarlo. Si quieres guardar una traza de todo lo que pase por la instancia de `alt` puedes utilizar un trozo de código como `alt.dispatcher.register(console.log.bind(console))`. También puedes lanzar `this.dispatcher.register(...)` en un constructor del almacén. Estos mecanismos te permitirán generar trazas de forma efectiva.

Otros gestores de estado ofrecen puntos de enganche similares. Es posible interceptar el flujo de datos de muchas formas e incluso crear una lógica personalizada encima de ello.

## Conclusión

En este capítulo hemos debatido la idea básica de qué es la arquitectura Flux y hemos comenzado a migrar nuestra aplicación a ella. Hemos dejado todo lo relacionado con la gestión del estado tras un adaptador para poder modificar el código sin tener que cambiar nada relacionado con la vista. El paso siquiente será definir un almacén para nuestra aplicación y definir las acciones que lo puedan manipular.
