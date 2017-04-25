# Aplicando Estilo a React

Históricamente las páginas web se han dividido en marcado HTML, estilo (CSS) y lógica (JavaScript). Gracias a React y a otras aproximaciones similares hemos empezado a cuestionar esta división. Todavía queremos separar los ámbitos de alguna manera, pero la forma de dividirlo parte de ejes diferentes.

Este cambio de mentalidad nos ha llevado a nuevas formas de pensar sobre cómo aplicar estilos. Con React todavía estámos tratando de encontrar la mejor manera, aunque algunos patrones iniciales hayan surgido ya. Como resultado, resulta difícil dar una recomendación definitiva en este momento. En su lugar, voy a mostrar algunas aproximaciones para que las conozcas y puedas elegir la que más te convenga.

## Estilo a la Vieja Usanza

La aproximación a la vieja usanza consiste en dejar algunos *ids* y *classes* por ahí, configurar reglas en el CSS, y esperar lo mejor. En CSS todo tiene, por defecto, ámbito global. Las definiciones anidadas (por ejemplo, `.main .sidebar .button`) crean una lógica implícita en los estilos. Ambas características incrementan la complejidad a medida que el proyecto va creciendo. Esta aproximación puede ser aceptable al comenzar, pero a medida que vayas desarrollando, irás queriendo migrar a otra solución.

## Metodologías CSS

¿Qué ocurre cuando tu aplicación comienza a crear y se añaden nuevos conceptos? Los selectores CSS son globales. El problema se vuelve incluso peor si tienes que lidiar con el orden el que se cargan. Si hay varios selectores iguales, la última declaración es la que gana, a menos que haya un `!important` en algún lugar. Se vuelve complejo muy rápidamente.

Podemos luchar contra este problema haciendo que los selectores sean más específicos, usando reglas de nombrado, etc. Esto simplemente retrasa lo inevitable. Ya que han sido muchas las personas que han combatido contra este problema durante mucho tiempo, algunas metodologías han emergido.

Particularmente, [OOCSS](http://oocss.org/) (Object-Oriented CSS), [SMACSS](https://smacss.com/) (Scalable and Modular Approach for CSS), y [BEM](https://en.bem.info/method/) (Block Element Modifier) son bien conocidas. Cada una de ellas soluciona los problemas de CSS a su propia manera.

### BEM

El origen de BEM reside en Yandex. La meta de BEM es la de permitir que existan componentes reutilizables y compartir código. Sitios como [Get BEM](http://getbem.com/) te pueden ayudar a entender la metodología con más detalle.

El mantener nombres de clases largos tal y como BEM requiere puede ser duro. Es por ello que han aparecido varias librerías que pueden hacerlo más sencillo. Para React, algunas de ellas son [react-bem-helper](https://www.npmjs.com/package/react-bem-helper), [react-bem-render](https://www.npmjs.com/package/react-bem-render), y [bem-react](https://www.npmjs.com/package/bem-react).

Ten en cuenta que [postcss-bem-linter](https://www.npmjs.com/package/postcss-bem-linter) te permite analizar tu CSS para ver si cumple con BEM.

### OOCSS y SMACSS

Al igual que BEM, tanto OOCSS como SMACSS tienen sus propias convenciones y metodologías. En el momento de escribir esto, no existen librerías específicas para React de OOCSS o SMACSS.

### Pros y Contras

El beneficio principal de adoptar una metodología es que estructura tu proyecto. Las metodologías resuelven algunos problemas básicos y te ayudan a desarrollar buen software a largo plazo. Las convenciones que traen a un proyecto ayudan al mantenimiento del mismo y son menos propensas a provocar un desastre.

Por el contrario, una vez adoptas una, te será muy difícil migrar a otra.

Las metodologías también traen sus propias particularidades (p.e. esquemas de nombrado complejos). Esto puede hacer que algunas cosas se vuelvan más complicadas de lo que deberían ser. No necesariamente arreglan los mayores problemas sino que, a veces, simplemente los rodean.

## Procesadores CSS

![CSS Processors](images/css.png)

El CSS plano carece de ciertas funcionalidades que podrían hacer que el mantenimiento fuese más sencillo. Considera algo básico como variables, anidamientos, mixins, operaciones matemáticas o funciones relacionadas con colores. Estaría bien poder olvidar los prefijos específicos para cada navegador. Son pequeñas cosas con las que te encuentras pronto y que hacen que sea molesto generar CSS plano.

A veces puede que veas términos como *preprocesador* o *postprocesador*. [Stefan Baumgartner](https://medium.com/@ddprrt/deconfusing-pre-and-post-processing-d68e3bd078a3) llama a estas herramientas simplemente *procesadores de CSS*. La imagen anterior basada en el trabajo de Stefan muestra el asunto. Las herramientas operan tanto a nivel de autor como de optimización. Con nivel de autor nos referimos a que hace que sea fácil escribir CSS. Las características de optimización hacen que el CSS plano generado esté optimizado para los navegadores.

Lo interesante aquí es que puede que quieras utilizar varios procesadores de CSS. La imagen de Stefan ilustra cómo puedes escribir CSS fácilmente con Sass y aún así optimizarlo con PostCSS. Por ejemplo, puede hacer *autoprefix* de tu código CSS para que no te tengas que preocupar de poner prefijos por navegador nunca más.

Puedes usar procesadores comunes como [Less](http://lesscss.org/), [Sass](http://sass-lang.com/), [Stylus](https://learnboost.github.io/stylus/), o [PostCSS](http://postcss.org/) con React.

[cssnext](https://cssnext.github.io/) es un plugin de PostCSS que te permite experimentar el futuro ahira. Hay algunas restricciones , pero puede merecer la pena probarlo. La ventaja de PostCSS y cssnext es que estarás programando literalmente en el futuro, A medida que los navegadores mejoren y adopten los estándares no tendrás que preocuparte de hacer ports.

### Pros y Contras

Comparado con CSS plano, los procesadores dejan muchas cosa encima de la mesa. Lidian con ciertas molestias (p.e. el autoprefixing) a medida que mejoran tu productividad. PostCSS es más granular por definición y te permite utilizar únicamente las características que necesitas. Los procesadores, como Less o Sass, son muy útiles. Ambas aproximaciones pueden ser utilizadas juntas, de tal modo que puedes apoyarte en Sass y aplicar algunos plugins de PostCSS cuando sea necesario.

En nuestro projecto podemos aprovecharnos de cssnext incluso si no hemos hecho cambios en nuestro CSS. Gracias al autoprefixing, las esquinas redondeadas de los carriles se verán mejor en navegadores antiguos. Es más, podemos parametrizar estos estilos gracias al uso de parámetros.

## Aproximaciones Basadas en React

With React we have some additional alternatives. What if the way we've been thinking about styling has been misguided? CSS is powerful, but it can become an unmaintainable mess without some discipline. Where do we draw the line between CSS and JavaScript?

There are various approaches for React that allow us to push styling to the component level. It may sound heretical. React, being an iconoclast, may lead the way here.

### Inline Styles to Rescue

Ironically, the way solutions based on React solve this is through inline styles. Getting rid of inline styles was one of the main reasons for using separate CSS files in the first place. Now we are back there. This means that instead of something like this:

```javascript
render(props, context) {
  const notes = this.props.notes;

  return <ul className='notes'>{notes.map(this.renderNote)}</ul>;
}
```

and accompanying CSS, we'll do something like this:

```javascript
render(props, context) {
  const notes = this.props.notes;
  const style = {
    margin: '0.5em',
    paddingLeft: 0,
    listStyle: 'none'
  };

  return <ul style={style}>{notes.map(this.renderNote)}</ul>;
}
```

Like with HTML attribute names, we are using the same camelcase convention for CSS properties.

Now that we have styling at the component level, we can implement logic that also alters the styles easily. One classic way to do this has been to alter class names based on the outlook we want. Now we can adjust the properties we want directly.

We have lost something in process, though. Now all of our styling is tied to our JavaScript code. It is going to be difficult to perform large, sweeping changes to our codebase as we need to tweak a lot of components to achieve that.

We can try to work against this by injecting a part of styling through props. A component could patch its style based on a provided one. This can be improved further by coming up with conventions that allow parts of style configuration to be mapped to some specific part. We just reinvented selectors on a small scale.

How about things like media queries? This naïve approach won't quite cut it. Fortunately, people have come up with libraries to solve these tough problems for us.

According to Michele Bertoli basic features of these libraries are

* Autoprefixing - e.g., for `border`, `animation`, `flex`.
* Pseudo classes - e.g., `:hover`, `:active`.
* Media queries - e.g., `@media (max-width: 200px)`.
* Styles as Object Literals - See the example above.
* CSS style extraction - It is useful to be able to extract separate CSS files as that helps with the initial loading of the page. This will avoid a flash of unstyled content (FOUC).

I will cover some of the available libraries to give you a better idea how they work. See [Michele's list](https://github.com/MicheleBertoli/css-in-js) for a more a comprehensive outlook of the situation.

### Radium

[Radium](http://projects.formidablelabs.com/radium/) has certain valuable ideas that are worth highlighting. Most importantly it provides abstractions required to deal with media queries and pseudo classes (e.g., `:hover`). It expands the basic syntax as follows:

```javascript
const styles = {
  button: {
    padding: '1em',

    ':hover': {
      border: '1px solid black'
    },

    '@media (max-width: 200px)': {
      width: '100%',

      ':hover': {
        background: 'white',
      }
    }
  },
  primary: {
    background: 'green'
  },
  warning: {
    background: 'yellow'
  },
};

...

<button style={[styles.button, styles.primary]}>Confirm</button>
```

For `style` prop to work, you'll need to annotate your classes using `@Radium` decorator.

### React Style

[React Style](https://github.com/js-next/react-style) uses the same syntax as React Native [StyleSheet](https://facebook.github.io/react-native/docs/stylesheet.html#content). It expands the basic definition by introducing additional keys for fragments.

```javascript
import StyleSheet from 'react-style';

const styles = StyleSheet.create({
  primary: {
    background: 'green'
  },
  warning: {
    background: 'yellow'
  },
  button: {
    padding: '1em'
  },
  // media queries
  '@media (max-width: 200px)': {
    button: {
      width: '100%'
    }
  }
});

...

<button styles={[styles.button, styles.primary]}>Confirm</button>
```

As you can see, we can use individual fragments to get the same effect as Radium modifiers. Also media queries are supported. React Style expects that you manipulate browser states (e.g., `:hover`) through JavaScript. Also CSS animations won't work. Instead, it's preferred to use some other solution for that.

T> [React Style plugin for Webpack](https://github.com/js-next/react-style-webpack-plugin) can extract CSS declarations into a separate bundle. Now we are closer to the world we're used to, but without cascades. We also have our style declarations on the component level.

### JSS

[JSS](https://github.com/jsstyles/jss) is a JSON to StyleSheet compiler. It can be convenient to represent styling using JSON structures as this gives us easy namespacing. Furthermore it is possible to perform transformations over the JSON to gain features, such as autoprefixing. JSS provides a plugin interface just for this.

JSS can be used with React through [react-jss](https://www.npmjs.com/package/react-jss).  You can use JSS through *react-jss* like this:

```javascript
...
import classnames from 'classnames';
import useSheet from 'react-jss';

const styles = {
  button: {
    padding: '1em'
  },
  'media (max-width: 200px)': {
    button: {
      width: '100%'
    }
  },
  primary: {
    background: 'green'
  },
  warning: {
    background: 'yellow'
  }
};

@useSheet(styles)
export default class ConfirmButton extends React.Component {
  render() {
    const {classes} = this.props.sheet;

    return <button
      className={classnames(classes.button, classes.primary)}>
        Confirm
      </button>;
  }
}
```

The approach supports pseudoselectors, i.e., you could define a selector within, such as `&:hover`, within a definition and it would just work.

T> There's a [jss-loader](https://www.npmjs.com/package/jss-loader) for Webpack.

### React Inline

[React Inline](https://github.com/martinandert/react-inline) is an interesting twist on StyleSheet. It generates CSS based on `className` prop of elements where it is used. The example above could be adapted to React Inline like this:

```javascript
import cx from 'classnames';
...

class ConfirmButton extends React.Component {
  render() {
    const {className} = this.props;
    const classes = cx(styles.button, styles.primary, className);

    return <button className={classes}>Confirm</button>;
  }
}
```

Unlike React Style, the approach supports browser states (e.g., `:hover`). Unfortunately, it relies on its own custom tooling to generate React code and CSS which it needs to work.

### jsxstyle

Pete Hunt's [jsxstyle](https://github.com/petehunt/jsxstyle) aims to mitigate some problems of React Style's approach. As you saw in previous examples, we still have style definitions separate from the component markup. jsxstyle merges these two concepts. Consider the following example:

```javascript
// PrimaryButton component
<button
  padding='1em'
  background='green'
>Confirm</button>
```

The approach is still in its early days. For instance, support for media queries is missing. Instead of defining modifiers as above, you'll end up defining more components to support your use cases.

T> Just like React Style, jsxstyle comes with a Webpack loader that can extract CSS into a separate file.

## CSS Modules

As if there weren't enough styling options for React, there's one more that's worth mentioning. [CSS Modules](https://github.com/css-modules/css-modules) starts from the premise that CSS rules should be local by default. Globals should be treated as a special case. Mark Dalgleish's post [The End of Global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284) goes into more detail about this.

In short, if you make it difficult to use globals, you manage to solve the biggest problem of CSS. The approach still allows us to develop CSS as we've been used to. This time we're operating in a safer, local context by default.

This itself solves a large amount of problems libraries above try to solve in their own ways. If we need global styles, we can still get them. We still might want to have some around for some higher level styling after all. This time we're being explicit about it.

To give you a better idea, consider the example below:

**style.css**

```css
.primary {
  background: 'green';
}

.warning {
  background: 'yellow';
}

.button {
  padding: 1em;
}

.primaryButton {
  composes: primary button;
}

@media (max-width: 200px) {
  .primaryButton {
    composes: primary button;

    width: 100%;
  }
}
```

**button.jsx**

```javascript
import styles from './style.css';

...

<button className=`${styles.primaryButton}`>Confirm</button>
```

As you can see, this approach provides a balance between what people are familiar with and what React specific libraries do. It would not surprise me a lot if this approach gained popularity even though it's still in its early days. See [CSS Modules Webpack Demo](https://css-modules.github.io/webpack-demo/) for more examples.

T> You can use other processors, such as Sass, in front of CSS Modules, in case you want more functionality.

T> [gajus/react-css-modules](https://github.com/gajus/react-css-modules) makes it even more convenient to use CSS Modules with React. Using it, you don't need to refer to the `styles` object anymore, and you are not forced to use camelCase for naming.

T> Glen Maddern discusses the topic in greater detail in his article named [CSS Modules - Welcome to the Future](http://glenmaddern.com/articles/css-modules).

## Conclusion

It is simple to try out various styling approaches with React. You can do it all, ranging from vanilla CSS to more complex setups. React specific tooling even comes with loaders of their own. This makes it easy to try out different alternatives.

React based styling approaches allow us to push styles to the component level. This provides an interesting contrast to conventional approaches where CSS is kept separate. Dealing with component specific logic becomes easier. You will lose some power provided by CSS. In return you gain something that is simpler to understand. It is also harder to break.

CSS Modules strike a balance between a conventional approach and React specific approaches. Even though it's a newcomer, it shows a lot of promise. The biggest benefit seems to be that it doesn't lose too much in the process. It's a nice step forward from what has been commonly used.

There are no best practices yet, and we are still figuring out the best ways to do this in React. You will likely have to do some experimentation of your own to figure out what ways fit your use case the best.
