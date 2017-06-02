# Introducción a React

La librería [React](https://facebook.github.io/react/) de Facebook ha cambiado nuestra manera de pensar en cuanto al desarrollo de interfaces de usuario en aplicaciones web se refiere. Gracias a su diseño puede ser utilizado más allá de la web. Una característica llamada **DOM Virtual** es lo que lo permite.

En este capítulo veremos algunas de las ideas principales de la librería para que podamos comprender React un poco mejor antes de ponernos con él.

## ¿Qué es React?

![React](images/react_header.png)

React es una librería JavaScript que nos obliga a pensar en componentes. Esta forma de pensar encaja bien con el desarrollo de interfaces de usuario. Dependiendo de tus conocimientos previos puede que te parezca un poco extraño al principio. Tendrás que pensar con detenimiento en el concepto de `estado` y dónde ubicarlo.

Han aparecido muchas soluciones ya que la mera **gestión del estado**, en sí, supone un problema complicado. En este libro comenzaremos gestionando el estado nosotros mismos y después nos moveremos a una implementación de Flux conocida como Alt. Hay más implementaciones disponibles para otras alternativas, como Redux, MobX y Cerebral.

React es pragmático en el sentido de que tiene varias salidas de emergencia. Siempre es posible hacer algo a bajo nivel si el modelo de React no encaja contigo. Por ejemplo, hay puntos de enganche que pueden ser utilizados para envolver lógica antigua que dependa del DOM. Esto rompe con la abstracción y ata tu código a un entorno específico, pero a veces es la única cosa que puedes hacer.

## DOM Virtual

![DOM Virtual](images/vdom.png)

Uno de los problemas principales de la programación es cómo lidiar con el estado. Supón que estás desarrollando una interfaz de usuario y quieres mostrar los mismos datos en varios sitios. ¿Cómo puedes estar seguro de que los datos que estás mostrando son consistentes?

Tradicionalmente se han mezclado tanto la gestión del DOM como la gestión del estado. React soluciona este problema de una manera diferente, ya que introduce el concepto de **DOM Virtual** para el público en general.

El DOM Virtual se encuentra por encima del DOM del navegador, o de cualquier otro elemento que deba ser renderizado. Resuelve el problema de cómo manipular el estado a su propia manera. Sea cual sea el cambio que se ha hecho sobre él, se las apaña para encontrar y aplicar los cambios sobre el DOM subyacente. Es capaz de propagar los cambios sobre el árbol virtual tal y como se muestra en la imagen anterior.

### El Rendimiento del DOM Virtual

Manipular el DOM de esta manera puede llevar a mejoras en el rendimiento. En cambio, manipular el DOM a mano suele ser ineficiente y difícil de optimizar. Puedes ahorrar un montón de tiempo y de esfuerzo si delegas el problema de la manipulación del DOM en una buena implementación que lo lleve a cabo.

React te permite realizar ciertos ajustes de rendimiento implementando unos puntos de enganche con los que ajustar la forma en la que se actualiza el árbol virtual. Por lo general esto es, a menudo, algo opcional.

El mayor coste de tener DOM Virtual es que hace que la implementación de React sea muy grande. Es de esperar que el tamaño de aplicaciones pequeñas gire en torno a los 150-200 kB minimizadas, con React incluido. La compresión ayuda, pero aún así sigue siendo grande.

T> Soluciones como [preact](https://developit.github.io/preact/) y [react-lite](https://github.com/Lucifier129/react-lite) te permiten obtener tamaños más pequeños a costa de perder algunas funcionalidades. Si estás preocupado por el tamaño quizá podrías considerar estas soluciones.

T> Hay librerías como [Matt-Esch/virtual-dom](https://github.com/Matt-Esch/virtual-dom) o [paldepind/snabbdom](https://github.com/paldepind/snabbdom) que se centran totalmente en el DOM Virtual. Échales un vistazo si estás interesado en la teoría y quieres conocer más.

## Renderizadores de React

Como mencionamos anteriormente, el enfoque de React hace que éste esté desacoplado de la web. Puedes utilizar React para implementar interfaces para varias plataformas. En nuestro caso utilizaremos un renderizador conocido como [react-dom](https://www.npmjs.com/package/react-dom), que permite renderizar tanto en el lado del cliente como en el lado del servidor.

### Renderizado Universal

Podemos utilizar react-dom para implementar lo que se conoce como el renderizado *universal*. La idea es conseguir que el servidor renderice una página inicial y envie los datos al cliente. Esto mejora el rendimiento evitando tener que hacer llamadas innecesarias entre el cliente y el servidor que puedan provocar sobrecarga. Además, es útil para SEO.

Aunque el funcionamiento de esta técnica parezca sencillo, puede ser dificil de implementar en el caso de aplicaciones grandes. Aún así es algo que merece la pena conocer.

A menudo utilizar el renderizado del lado del servidor de react-dom es suficiente. Puedes utilizarlo, por ejemplo, para [generar facturas](https://github.com/bebraw/generate-invoice), lo cual demuestra que React puede usarse de una forma flexible. La generación de informes es una funcionalidad común después de todo.

### Renderizadores de React Disponibles

Aunque react-dom sea el renderizador más comúnmente utilizado, existen otros de los que deberías ser consciente. A continuación muestro una lista con algunas de las alternativas más populares:

* [React Native](https://facebook.github.io/react-native/) - React Native es un framework y un renderizador para plataformas móviles, incluido iOS y Android. También puedes ejecutar [aplicaciones hechas con React Native en la web](https://github.com/necolas/react-native-web).
* [react-blessed](https://github.com/Yomguithereal/react-blessed) - react-blessed te permite escribir aplicaciones de terminal utilizando React. Incluso es posible animarlas.
* [gl-react](https://projectseptemberinc.gitbooks.io/gl-react/content/) - gl-react provee a React de soporte para WebGL. Con ello puedes, por ejemplo, hacer shaders.
* [react-canvas](https://github.com/Flipboard/react-canvas) - react-canvas provee a React de soporte para gestionar el elemento Canvas.

## `React.createElement` y JSX

Ya que vamos a trabajar con un DOM Virtual, hay un [API de alto nivel](https://facebook.github.io/react/docs/top-level-api.html) que nos permitirá gestionarlo. Este es el aspecto que tiene un componente nativo de React que utilice el API JavaScript:

```javascript
const Names = () => {
  const names = ['John', 'Jill', 'Jack'];

  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, 'Names'),
    React.createElement(
      'ul',
      { className: 'names' },
      names.map(name => {
        return React.createElement(
          'li',
          { className: 'name' },
          name
        );
      })
    )
  );
};
```

Puesto que es muy largo escribir componentes de esta manera y que son muy difíciles de leer, la gente por lo general suele preferir utilizar un lenguaje conocido como [JSX](https://facebook.github.io/jsx/) en su lugar. Observa el mismo componente escrito con JSX a continuación:

```javascript
const Names = () => {
  const names = ['John', 'Jill', 'Jack'];

  return (
    <div>
      <h2>Names</h2>

      {/* Esto es una lista de nombres */}
      <ul className="names">{
        names.map(name =>
          <li className="name">{name}</li>
        )
      }</ul>
    </div>
  );
};
```

Ahora podemos ver que el componente renderiza un conjunto de nombres dentro de una lista HTML. Puede que no sea el componente más útil del mundo, pero es suficiente para ilustrar el concepto básico de qué es JSX. Nos facilita una sintaxis que parece HTML. También permite escribir JavaScript utilizando las llaves (`{}`).

Comparado con HTML plano, estamos usando `className` en lugar de `class`. Esto se debe a que el API ha sido inspirado en el nombrado de DOM. Lleva algo de tiempo acostumbrarse y puede que sufras un [shock con JSX](https://medium.com/@housecor/react-s-jsx-the-other-side-of-the-coin-2ace7ab62b98) hasta que comiences a apreciar esta aproximación. Nos da un nivel extra de validación.

T> [HyperScript](https://github.com/dominictarr/hyperscript) es una alternativa interesante a JSX que brinda un API JavaScript más cercano al metal. Puedes utilizar la sintaxis con React a través de [hyperscript-helpers](https://www.npmjs.com/package/hyperscript-helpers).

T> Existe una diferencia semántica entre los componentes de React y los elementos de React. En el ejemplo anterior cada uno de los nodos JSX puede ser convertido en un elemento. Simplificando, los componentes pueden tener estado mientras que los elementos son, por naturaleza, más sencillos. Son objetos puros. Dan Abramov entra en más detalle en [en la siguiente entrada](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html).

## Conclusión

Ahora que entendemos aproximadamente qué es React podemos ir a algo más técnico. Es la hora de tener un proyecto pequeño configurado y funcionando.
