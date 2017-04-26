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

Existen algunas alternativas extra con React. ¿Qué ocurre si todo lo que habiamos ideado sobre estilos era erróneo?. CSS es poderoso, pero se puede volver un lío inmantenible sin algo de disciplina. ¿Dónde podemos trazar la separación entre CSS y JavaScript?

Hay varias aproximaciones para React que nos permiten aplicar estilos a nivel de componente. Puede parecer un sacrilegio, pero React, rebelde como es, nos puede llevar allí.

### Estilos Inline al Rescate

Irónicamente, la forma en la que las soluciones que utilizan React resuelven el problema de los estilos es a través de estilos inline. Deshacerse de los estilos inline fue una de las principales razones para el uso de múltipls archivos CSS separados, pero ahora han vuelto. Esto significa que, en vez de tener algo como esto:

```javascript
render(props, context) {
  const notes = this.props.notes;

  return <ul className='notes'>{notes.map(this.renderNote)}</ul>;
}
```

y acompañarlo de CSS, tendremos algo como esto:

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

Como ocurre con los nombres de los atributos en HTML, usaremos la convención camelcase para las propiedades CSS.

Ahora que estamos aplicando estilos a nivel de componente, podemos implementar la lógica que modifica estos estilos fácilmente. Una forma clásica de hacer esto ha sido alterar los nombres de las clases basándonos en el aspecto que queremos tener. Ahora podemos ajustar las propiedades que queramos directamente.

Sin embargo, hemos perdido algo por el camino. Ahora nuestros estilos están fuertemente ligados a nuestro código JavaScript. Va a ser difícil hacer cambios de mucha envergadura sobre nuestra base del código ya que vamos a tener que modificar un montón de componentes para ello.

Podemos tratar de hacer algo par ello inyectando algunos estilos mediante props. Un estilo puede adaptar su propio estilo basado en uno que reciba. Esto se puede mejorar más adelante mediante convenciones que permitan que ciertas partes de la configuración de los estilos lleguen a ciertas partes específicas de los componentes. Es simplemente reinventar los selectores a una pequeña escala.

¿Qué hacemos con cosas como los media queries?. Esta inocente aproximación no se encarga de ello. Afortunandamente hay gente que ha desarrollado librerías que solucionan estos problemas por nosotros.

Según Michele Bertoli las características básicas de estas librerías son

* Autoprefixing - p.e., para `border`, `animation`, `flex`.
* Pseudo clases - p.e., `:hover`, `:active`.
* Media queries - p.e., `@media (max-width: 200px)`.
* Estilos como Objetos - Revisa el ejemplo anterior.
* Extracción de estilos CSS - Es útil para poder partir un fichero CSS grande en ficheros CSS pequeños que ayuden con la primera carga de la página. Esto evita que veamos la página sin estilos al entrar  (FOUC).

Vamos a ver algunas de las librerías disponibles para que te hagas una idea de cómo funcionan. Echa un vistazo a [la list de Michele](https://github.com/MicheleBertoli/css-in-js) para tener una mejor visión de la situación.

### Radium

[Radium](http://projects.formidablelabs.com/radium/) tiene algunas ideas valiosas que merece la pena destacar. Lo más importante es que facilita las abstracciones necesarias para poder lidiar con media queries y pseudo clases (p.e. `:hover`). Expande la sintaxis básica como sigue:

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

Para que la propiedad `style` funcione deberás anotar tus clases usando el decorador `@Radium`.

### React Style

[React Style](https://github.com/js-next/react-style) utiliza la misma sintaxis que React Native [StyleSheet](https://facebook.github.io/react-native/docs/stylesheet.html#content). Alarga la definición básica introduciendo algunas claves adicionales para cada fragmento.

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

Como puedes ver, podemos uasr fragmentos individuales para tener el mismo efecto que teniamos con Radium. Además, los media queries también están soportados. React Style espera que manipules los estados del navegador (p.e. `hover`) mediante JavaScript. Las animaciones con CSS no funcionarán, es mejor usar alguna otra solución para ello.

T> [El plugin de React Style para Webpack](https://github.com/js-next/react-style-webpack-plugin) puede extraer las declaraciones del CSS en un paquete aparte. Ahora estamos más cerca de lo que ha utilizado todo el mundo, pero no tenemos las cascadas, aunque mantenemos la declaración de los estilos a nivel de componente.

### JSS

[JSS](https://github.com/jsstyles/jss) es un compilador de JSON a hoja de estilos. Puede ser una forma útil de representar estilos usando estructuras JSON ya que tiene un espacio de nombres sencillo. También es posible realizar tranformaciones en el JSON para obtener más funcionalidad, como el autoprefixing. JSS tiene una interfaz para plugins con la que hacer este tipo de cosas.

JSS puede utilizarse con React a través de [react-jss](https://www.npmjs.com/package/react-jss). Puedes usar *react-jss* de este modo:

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

T> Hay un [jss-loader](https://www.npmjs.com/package/jss-loader) para Webpack.

### React Inline

[React Inline](https://github.com/martinandert/react-inline) es un enfoque intereasnte para aplicar estilos. Genera CSS basado en la prop `className` de los elementos que lo usen. El ejemplo anterior puede ser adaptado para React Inline de esta manera:

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

Por desgracia, se basa en su propia herramienta personalizada para generar código de React y el CSS que necesita para trabajar.

### jsxstyle

El [jsxstyle](https://github.com/petehunt/jsxstyle) de Pete Hunt trata de mitigar algunos de los problemas React Style. Como has podido ver en los ejemplos anteriores, todavía tenemos las definiciones de los estilos separadas del lenguaje de marcado de los componentes. jsxstyle une ambos conceptos. Observa el siguiente ejemplo:

```javascript
// PrimaryButton component
<button
  padding='1em'
  background='green'
>Confirm</button>
```

Esta aproximación todavía está en fase inicial. Por ejemplo, no hay soporte para media queries. En lugar de definir modificadores como antes, acabarás definiendo más componentes con los que dar cabida a tus casos de uso.

T> Al igual que con React Style, jsxstyle tieen un cargador de Webpack que puede extraer CSS en un fichero separado.

## CSS Modules

Como si no hubiera suficientes opciones de estilo para React, hay una más que merece la pena mencionar. [CSS Modules](https://github.com/css-modules/css-modules) parte de la premisa de que los estilos CSS deben ser locales por defecto. Los estilos globales deben ser tratadas como un caso especial. El post [The End of Global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284) de Mark Dalgleish entra en más detalles sobre esto.

De forma resumida, si se te hace difícil usar estilos globales, tienes que apañártelas para resolver el mayor problemas de las CSS. Esta aproximación te permite desarrollar CSS como hemos estado haciendo hasta ahora, solo que esta vez el ámbito se reduce a un contexto más seguro y localizado por defecto.

Esto en sí mismo soluciona una gran cantidad de los problemas que las librerias anteriores trataban de resolver a su propia forma. Si necesitas estilos globales todavía puedes tenerlos, es probable que queramos tener ciertos estilos que apliquen a alto nivel, después de todo. Esta vez seremos explícitos en ello.

Para qur te hagas una idea mejor, fíjate en el siguiente ejemplo:

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

Como puedes ver, esta aproximación trata de encontrar el equilibrio entre aquello que a la gente le resulta familiar con librerías específicas para React. Es por ello que no me sorprende que esta aproximacíon sea muy popular aunqque todavía sea reciente. Echa un ojo a [la demo de CSS Modules de Webpack](https://css-modules.github.io/webpack-demo/) para ver más ejemplos.

T> Puedes usar procesadores, como Sass, junto con CSS Modules, en caso de que busques tener más funcionalidad.

T> [gajus/react-css-modules](https://github.com/gajus/react-css-modules) hace que sea más sencillo todavía usar CSS Modules con React. Con él, no tendrás que referencia al objeto `styles` nunca más, y no estás obligado a poner nombres usando camelCase.

T> Glen Maddern discute este tema con mucho más detalle en si artículo llamado [CSS Modules - Bienvenidos al Futuro](http://glenmaddern.com/articles/css-modules).

## Conclusión

Es fácil probar varias aproximaciones de estilos con React. Puedes hacerlo, yendo desde CSS plano hasta configuraciones más complejas. Es sencillo probar distintas alternativas.

Las aproximaciones te permiten dejar los estilos a nivel de componente. Esto nos ofrece un contraste interesante con respecto a las aproximaciones convencionales en las que las CSS se mantienen separadas. Lidiar con la lógica específica del componente se vuelve más sencillo. Puede que pierdas algo del poder que te dan las CSS, pero obtendrás algo más sencillo de entender que puede ser más difícil de romper.

Los CSS Modules buscan un equilibrio entre un enfoque convencional y un enfoque específico para React. Incluso aún siendo un recién llegado parece tener mucho potencial. El mayor beneficio parece ser que no perderás mucho durante el proceso. Representa un paso adelante que ha sido comúnmente usado.

Todavía no existen buenas prácticas, y todavía estamos tratando de encontrar la mejor manera de aplicar estilos con React. Tendrás que experimentar un poco por ti mismo para hacerte una idea de qué es lo que mejor encaja en tu caso particular.
