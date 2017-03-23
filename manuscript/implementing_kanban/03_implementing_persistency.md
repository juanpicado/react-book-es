# Implementando Persistencia en `localStorage`

Ahora mismo nuestra aplicación no puede mantener su estado si la página se refresca. Una buena forma de solucionar este problema es almacenar el estado de la aplicación en el [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) y recuperarlo cuando ejecutemos la aplicación de nuevo.

Esto no es un problema si estamos trabajando contra un backend, aunque incluso en ese caso tener una caché temporal en `localStorage` puede ser útil, únicamente estate seguro de que no almacenas información sensible ya que es fácil acceder a ella.

## Entendiendo `localStorage`

`localStorage` es una parte de Web Storage API. La otra mitad, el `sessionStorage`, funciona sólo cuando el navegador está en funcionamiento mientras `localStorage` persiste incluso más allá. Ambos comparten [el mismo API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) que se muestra a continuación:

* `storage.getItem(k)` - Devuelve la cadena de texto almacenada en la clave enviada como parámetro.
* `storage.removeItem(k)` - Elimina el dato que coincida con la clave.
* `storage.setItem(k, v)` - Guarda el valor recibido en base a la clave indicada.
* `storage.clear()` - Borra el contenido del almacén.

Es conveniente operar con el API utilizando las herramientas de desarrollador del navegador. En Chrome, la pestaña *Recursos* es útil y te permite tanto inspeccionar los datos como realizar operaciones directas contra ellas. Puedes utilizar incluso los atajos `storage.key` y `storage.key = 'value'` en la consola para hacer pequeñas pruebas.

`localStorage` y `sessionStorage` pueden utilizar hasta un máximo de 10 MB entre las dos, que aunque es algo que debería estar bien soportado por los navegadores, puede fallar.

## Implementando un Envoltorio para `localStorage`

Para hacer que las cosas sean simples y manejables vamos a implementar un pequeño envoltorio sobre el `almacén` que nos permita limitar la complejidad. El API consistirá en un método `get(k)` para recuperar elementos del almacenamiento y `set(k,v)` para establecerlos. Dado que el API que está por debajo funciona con cadenas de texto, usaremos `JSON.parse` y `JSON.stringify` para la serialización. Tendremos que tener en cuenta que `JSON.parse` puede fallar. Considera la siguiente implementación:

**app/libs/storage.js**

```javascript
export default storage => ({
  get(k) {
    try {
      return JSON.parse(storage.getItem(k));
    }
    catch(e) {
      return null;
    }
  },
  set(k, v) {
    storage.setItem(k, JSON.stringify(v));
  }
})
```

Esta implementación es suficiente para cumplir nuestros propósitos. No funcionará siempre y fallará si ponemos demasiados datos en el almacén. Para superar estos problemas sin tener que arreglarlos por tí mismo es posible utilizar un envoltorio como [localForage](https://github.com/mozilla/localForage) para ocultar la complejidad.

## Persistiendo la Aplicación usando `FinalStore`

El que tengamos los medios para poder escribir en el `localStorage` no es suficiente. Todavía necesitamos poder conectarlo con nuestra aplicación de alguna manera. Los gestores de estados tienen puntos de enganche para este propósito y a menudo encontrarás una forma de interceptarlos de alguna manera. En el caso de Alt, esto ocurre gracias a un almacén predefinido conocido como `FinalStore`.

El caso es que ya lo tenemos configurado en nuestra instancia de Alt. Lo que nos queda es escribir el estado de la aplicación en el `localStorage` cuando éste cambie. También necesitaremos cargar el estado cuando arranquemos la aplicación. Estos procesos en Alt se conocen como **snapshotting** y **bootstrapping**.

T> Una forma alternativa de gestionar el almacenamiento de los datos es hacer un snapshot sólo cuando se cierre el navegador. Hay una llamada a nivel de ventana llamado `beforeunload` que puede ser utilizado para ello. Sin embargo, esta aproximación es algo frágil. ¿Qué ocurrirá si ocurre algo inesperado y el evento no se llega a lanzar por algún motivo?, que perderás datos.

## Implementando la Lógica de Persistencia

Podemos gestionar la lógica de persistencia en un módulo separado que se dedique a ello.

Puede ser una buena idea implementar un flag de `debug` ya que puede ser útil deshabilitar el snapshotting de forma temporal. La idea es dejar de almacenar datos si el flag está puesto a true.

Esto es especialmente útil para poder eliminar el estado de la aplicación de forma drástica durante el desarrollo y poder dejarlo en un estado en blanco mediante `localStorage.setItem('debug', 'true')` (`localStorage.debug = true`), `localStorage.clear()` y, finalmente, refrescar el navegador.

Dado que el bootstrapping puede fallar por algún motivo desconocido debemos ser capaces de capturar el error. Puede ser una buena idea seguir con el arranque de la aplicación aunque algo horrible haya pasado llegado ese punto.

La siguiente implementación ilustra estas ideas:

**app/libs/persist.js**

```javascript
export default function(alt, storage, storageName) {
  try {
    alt.bootstrap(storage.get(storageName));
  }
  catch(e) {
    console.error('Failed to bootstrap data', e);
  }

  alt.FinalStore.listen(() => {
    if(!storage.get('debug')) {
      storage.set(storageName, alt.takeSnapshot());
    }
  });
}
```

Puede que acabes con algo similar usando otros gestores de estado. Necesitarás encontrar puntos de enganche similares con los que inicializar el sistema con datos cargados desde el `localStorage` y poder escribir el estado cuando algo haya cambiado.

## Conectando la Lógica de Persistencia con la Aplicación

Todavía nos falta una pieza para hacer que esto funcione. Necesitamos conectar la lógica con nuestra aplicación. Por suerte hay un sitio indicado para ello, la configuración. Déjala como sigue:

**app/components/Provider/setup.js**

```javascript
leanpub-start-insert
import storage from '../../libs/storage';
import persist from '../../libs/persist';
leanpub-end-insert
import NoteStore from '../../stores/NoteStore';

export default alt => {
  alt.addStore('NoteStore', NoteStore);

leanpub-start-insert
  persist(alt, storage(localStorage), 'app');
leanpub-end-insert
}
```

Si refrescas el navegador ahora, la aplicación debería mantener su estado. Puesto que esta solución es genérica, añadir más estados al sistema no debería suponer un problema. También podemos integrar un backend que facilite estos puntos de enganche si queremos.

Si tuviésemos un backend real podríamos incluir el resultado en el HTML y devolverlo al navegador, lo que nos ahorraría un viaje. Si además renderizamos el HTML inicial de la aplicación acabaremos implementando una aproximación básica al **renderizado universal**. El renderizado universal es una técnica muy poderosa que permite usar React para mejorar el rendimiento de tu aplicación a la vez que sigue funcionando el SEO.

W> Nuestra implementación no está falta de fallos. Es fácil llegar a una situación en la que el `localStorage` contenga datos inválidos debido a cambios que hayamos hecho en el modelo de datos. Esto te acerca al mundo de los esquemas de bases de datos y sus migraciones. Lo que debes aprender aquí es que cuánto más estado tengas en tu aplicación, más complicado se volverá manejarlo.

## Limpiando `NoteStore`

Antes de continuar es una buena idea limpiar `NoteStore`. Todavía queda algo de código de experimentos anteriores. Dado que la persistencia ya funciona, puede que queramos arrancar desde un estado en blanco. Incluso si queremos tener datos iniciales, puede que sea mejor gestionarlos a alto nivel, por ejemplo al arrancar la aplicación. Cambia `NoteStore` de este modo:

**app/stores/NoteStore.js**

```javascript
leanpub-start-delete
import uuid from 'uuid';
leanpub-end-delete
import NoteActions from '../actions/NoteActions';

export default class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

leanpub-start-delete
    this.notes = [
      {
        id: uuid.v4(),
        task: 'Learn React'
      },
      {
        id: uuid.v4(),
        task: 'Do laundry'
      }
    ];
leanpub-end-delete
leanpub-start-insert
    this.notes = [];
leanpub-end-insert
  }
  ...
}
```

Es suficiente de momento. Nuestra aplicación debería arrancar desde cero.

## Implementaciones Alternativas

Que hayamos usado Alt en esta implementación inicial no significa que sea la única opción. Para poder comparar varias arquitecturas he implementado la misma aplicación utilizando técnicas diferentes. A continuación presento una breve comparación:

* [Redux](http://rackt.org/redux/) es una arquitectura inspirada en Flux diseñada con la recarga en caliente como primer objetivo a cumplir. Redux se basa en un único árbol de estado, el cual se manipula con *funciones puras* conocidas como reductores. Redux te fuerza a profundizar en la programación funcional. la implementación es muy parecida a la de Alt. - [Demo de Redux](https://github.com/survivejs/redux-demo)
* Comparado con Redux, [Cerebral](http://www.cerebraljs.com/) tiene un enfoque diferente. Fue desarrollado para permitir ver *cómo* la aplicación cambia su estado. Cerebral guía más cómo hacer el desarrollo y, como resultado, viene con las pilas más cargadas.  - [Demo de Cerebral](https://github.com/survivejs/cerebral-demo)
* [MobX](https://mobxjs.github.io/mobx/) te permite tener estructuras de datos observables. Las estructuras pueden estar conectadas con componentes de React así que cuando las estructuras cambian, también lo hacen los componentes. La implementación del Kanban es sorprendentemente simple ya que se pueden utilizar referencias reales entre componentes. - [Demo de MobX](https://github.com/survivejs/mobx-demo)

## ¿Relay?

Comparado con Flux, [Relay](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html) de Facebook mejora la recepción de datos. Permite llevar los requisitos sobre los datos a nivel de vista. Puede ser utilizado de forma independiente o con Flux dependiendo de lo que necesites.

No lo vamos a cubrir en este libro por ser una tecnología que todavía no está madura. Relay tiene algunos requisitos especiales, como un API compatible con GraphQL. Sólo lo explicaré si pasa a ser adoptado por la comunidad.

## Conclusión

En este capítulo hemos visto cómo configurar el `localStorage` para almacenar el estado de la aplicación. Es una técnica pequeña a la vez que útil. Ahora que hemos solucionado la persistencia, estamos listos para tener un estupendo tablero de Kanban.
