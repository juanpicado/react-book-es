# Configurando el Proyecto

Para que comenzar sea más sencillo he configurado una esqueleto basado en Webpack que nos permitirá adentrarnos en React de forma directa. Este esqueleto incluye un modo de desarrollo con una característica conocida como *recarga en caliente*.

La recarga en caliente le permite a Webpack a cambiar el código que se está ejecutando en el navegador sin tener que recargarlo todo. Funciona genial, especialmente a la hora de trabajar con estilos, aunque el soporte de React es también bastante bueno.

Por desgracia no es una tecnología a prueba de fallos y no siempre es capaz de detectar todos los cambios que se hayan hecho en el código, lo que significa que habrá veces que tendrás que recargar el navegador a mano para que éste tenga los últimos cambios.

T> Los editores de texto más comunes (Sublime Text, Visual Studio Code, vim, emacs, Atom, etc) tienen un buen soporte para React. Incluso los IDEs, como [WebStorm](https://www.jetbrains.com/webstorm/), tienen soporte hasta cierto punto. [Nuclide](http://nuclide.io/), un IDE basado en Atom, ha sido desarrollado con React en mente. Asegúrate de que tienes los plugins de React instalados y funcionando.

W> Si utilizas un IDE, deshabilita una característica conocida como **escritura segura**. Se sabe que causa problemas con la configuración que vamos a utilizar en este libro.

## Configuración de Node.js y Git

Antes de comenzar, asegúrate de que tienes instaladas las últimas versiones tanto de  [Node.js](https://nodejs.org) como de [Git](https://git-scm.com/). Te recomiento que utilices, al menos, la última versión LTS de Node.js. Puede que tengas errores difíciles de depurar con versiones anteriores, y lo mismo puede ocurrir con versiones posteriores a la LTS.

T> Una opción interesante es gestionar tu entorno a través de [Vagrant](https://www.vagrantup.com/) o mediante una herramienta como [nvm](https://www.npmjs.com/package/nvm).

### Descargando el Esqueleto

Para poder descargar el esqueleto que nuestro proyecto necesita, clónalo con Git de la siguiente manera desde una terminal:

```bash
git clone https://github.com/survivejs/react-boilerplate.git kanban-app
```

Esto creará un nuevo directorio llamado *kanban-app*. Dentro encontrarás todo lo que necesitas para poder avanzar. Ya que el esqueleto puede cambiar dependiendo de la versión del libro, te recomiendo que cambies a la versión específica del mismo:

```bash
cd kanban-app
git checkout v2.5.6
```

El repositorio contiene una pequeña aplicación a modo de semilla que muestra un `Hello World!` y una configuración de Webpack básica. Para instalar las dependencias de la semilla simplemente ejecuta:

```bash
npm install
```

Una vez termine deberás ver un directorio llamado `node_modules/` con todas las dependencias del proyecto.

### Creando un Repositorio Nuevo de Git para tu Proyecto

No sólo te has descargado el proyecto `react-boilerplate`, sino que además te has descargado el historial del mismo. Este historial no es realmente importante para tu nuevo proyecto, así que es un buen momento para borrar el historial de git y comenzar con un repositorio limpio. Este nuevo repositorio reflejará la evolución de tu proyecto. Es una buena idea que, en el commit inicial, menciones la versión del esqueleto de la que partes:

```
rm -rf .git
git init
git add .
git commit -am "New project based on react-boilerplate (v2.5.6)"
```

Tras esto tendrás un repositorio limpio en el que trabajar.

## Ejecutando el Proyecto

Ejecuta `npm start` para arrancar el proyecto. Deberías tener una salida como la siguiente si todo ha ido bien:

```bash
> webpack-dev-server

http://localhost:8080/
webpack result is served from /
content is served from .../kanban-app
404s will fallback to /index.html
Child html-webpack-plugin for "index.html":

webpack: bundle is now VALID.
```

En caso de que recibas un error asegúrate de que no tengas ningún otro proceso escuchando en el mismo puerto. Puedes hacer que la aplicación escuche en otro puerto distinto usando un comando similar a `PORT=3000 npm start` (sólo para Unix). La configuración utilizará el puerto que hayas indicado en la variable de entorno. Si quieres fijar el puerto con un valor específico configúralo en el fichero *webpack.config.js*.

Si todo ha ido bien deberás ver algo como esto en el navegador:

![Hello world](images/hello_01.png)

Puedes probar a modificar el código fuente para ver cómo funciona la recarga en caliente.

Hablaré del esqueleto con más detalle más adelante para que sepas cómo funciona. También mostraré brevemente qué características del lenguaje vamos a utilizar.

T> Las técnicas utilizadas en el esqueleto están cubiertas con más detalle en [SurviveJS - Webpack](http://survivejs.com/webpack/introduction/).

## `scripts` de npm presentes en el Esqueleto

Nuestro esqueleto es capaz de generar una aplicación que puede ser desplegada en producción. Hay una meta relacionada con el proceso de despliegue con la que podrás mostrar tu proyecto a otras personas mediante [GitHub Pages](https://pages.github.com/). A continuación tienes una lista con todos los `scripts`:

* `npm run start` (o `npm start`) - Ejecuta el proyecto en modo desarrollo. Navega hacia `localhost:8080` desde tu navegador para verlo funcionando.
* `npm run build` - Produce una compilación lista para producción en `build/`. Puedes abrir el fichero *index.html* en el navegador para ver el resultado.
* `npm run deploy` - Despliega el contenido de `build/` en la rama *gh-pages* de tu proyecto y lo sube a GitHub. Podrás acceder al proyecto a través de la URL `<usuario>.github.io/<proyecto>`. Para que funcione correctamente deberás configurar la variable `publicPath` del fichero *webpack.config.js* para que encaje con el nombre de tu proyecto en GitHub.
* `npm run stats` - Genera estadísticas (*stats.json*) sobre el proyecto. Puedes [analizar los resultados](http://survivejs.com/webpack/building-with-webpack/analyzing-build-statistics/) más adelante.
* `npm run test` (o `npm test`) - Ejecuta los tests del proyecto. El capítulo *Testing React* entra más adelante en este asunto. De hecho, una buena manera de aprender mejor cómo funciona React es escribir tests que prueben tus componentes.
* `npm run test:tdd` - Ejecuta los tests del proyecto en modo TDD, lo que significa que se quedará a la espera de cambios en los ficheros y lanzará los tests cuando se detecten cambios, lo que te permititá ir más deprisa ya que te evitará tener que lanzar los tests manualmente.
* `npm run test:lint` - Ejecuta [ESLint](http://eslint.org/) contra el código. ESLint es capaz de capturar pequeños problemas. Puedes configurar tu entorno de desarrollo para que lo utilice y te permitirá capturar errores potenciales a medida que los cometas.

Revisa la sección `"scripts"` del fichero *package.json* para entender mejor cómo funciona cada uno de ellos. Es casi como configuración. Echa un vistazo a [SurviveJS - Webpack](http://survivejs.com/webpack/introduction/) para saber más sobre este tema.

## Características del Lenguaje Presentes en el Esqueleto

![Babel](images/babel.png)

El esqueleto depende de un transpilador llamado [Babel](https://babeljs.io/) que nos permite utilizar características del JavaScript del futuro. Se encarga de transformar tu código en un formato que los navegadores puedan entender. Puedes incluso desarrollar tus propias características del lenguaje. Permite el uso de JSX mediante un plugin.

Babel da soporte a algunas [características experimentales](https://babeljs.io/docs/plugins/#stage-x-experimental-presets-) de ES7 que van más allá de ES6. Algunas de ellas podrían llegar formar parte del lenguaje, mientras que otras podrían ser eliminadas por completo. Las propuestas del lenguaje han sido categorizadas en etapas:

* **Etapa 0** - Hombre de paja
* **Etapa 1** - Propuesta
* **Etapa 2** - Borrador
* **Etapa 3** - Candidata
* **Etapa 4** - Finalizada

Yo tendría mucho cuidado con las características de la **etapa 0**. El problema es que acabará rompiendo código que habrá que reescribir en caso de ésta cambie o sea borrada. Quizá en pequeños problemas experimentales merezca la pena correr el riesgo.

Además del ES2015 estándar y de JSX, vamos a utilizar algunas características extra en este proyecto. Las he listado a continuación. Echa un vistazo al apéndice *Características del Lenguaje* para saber más sobre ellas.

* [Inicializadores de propiedades](https://github.com/jeffmo/es-class-static-properties-and-fields) - Ejemplo: `addNote = (e) => {`. Esto relaciona al método `addNote` automáticamente a una instancia. Esta característica tendrá más sentido a medida que la vayamos utilizando.
* [Decoradores](https://github.com/wycats/javascript-decorators) - Ejemplo: `@DragDropContext(HTML5Backend)`. Estas anotaciones nos permitirán incluir funcionalidad a clases y a sus métodos.
* [rest/spread de Objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) - Ejemplo: `const {a, b, ...props} = this.props`. Esta sintaxis nos permite recuperar fácilmente propiedades específicas de un objeto.

He creado un [preset](https://github.com/survivejs/babel-preset-survivejs-kanban) para que sea más sencillo configurar estas características. Contiene los plugins [babel-plugin-transform-object-assign](https://www.npmjs.com/package/babel-plugin-transform-object-assign) y [babel-plugin-array-includes](https://www.npmjs.com/package/babel-plugin-array-includes). El primero nos permite usar `Object.assign` mientras que el último incluye `Array.includes` sin que tengamos que preocuparnos de compatibilidades con entornos antiguos.

Un preset es simplemente un módulo de npm que exporta configuración de Babel. Mantener presets como éste puede ser útil si quieres mantener el mismo conjunto de funcionalidades entre varios proyectos.

T> Puedes [probar Babel online](https://babeljs.io/repl/) para ver el tipo de código que genera.

T> Si estás interesado en una alternativa más ligera, echa un vistazo a [Bublé](https://gitlab.com/Rich-Harris/buble).

## Conclusión

Ahora que tenemos el clásico "Hello World!" funcionando podemos centrarnos en el desarrollo. Desarrollar y tener problemas es una buena forma de aprender después de todo.
