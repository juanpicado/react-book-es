# Resolución de Problemas

He tratado de recopilar algunos problemas comunes aquí. Este capítul crecerá a medida que se vayan encontrando más problemas comunes.

## `EPEERINVALID`

Es probable que veas un mensaje como este:

```bash
npm WARN package.json kanban-app@0.0.0 No repository field.
npm WARN package.json kanban-app@0.0.0 No README data
npm WARN peerDependencies The peer dependency eslint@0.21 - 0.23 included from eslint-loader will no
npm WARN peerDependencies longer be automatically installed to fulfill the peerDependency
npm WARN peerDependencies in npm 3+. Your application will need to depend on it explicitly.

...

npm ERR! Darwin 14.3.0
npm ERR! argv "node" "/usr/local/bin/npm" "i"
npm ERR! node v0.10.38
npm ERR! npm  v2.11.0
npm ERR! code EPEERINVALID

npm ERR! peerinvalid The package eslint does not satisfy its siblings' peerDependencies requirements!
npm ERR! peerinvalid Peer eslint-plugin-react@2.5.2 wants eslint@>=0.8.0
npm ERR! peerinvalid Peer eslint-loader@0.14.0 wants eslint@0.21 - 0.23

npm ERR! Please include the following file with any support request:
...
```

En lenguaje de los humanos significa que algún paquete, `eslint-loader` en este caso, tiene un requisito `peerDependency` demasiado estricto. Nuestro paquete ya tiene instalada una versión más reciente. Dado que la dependencia requerida de forma transitiva es más antigua que la nuestra, nos aparece este error en particular.

Hay un par de formas de solucionar esta situación:

1. Avisar al autor del paquete del problema y confiar en que incremente el rango de versiones que puede soportar.
2. Resolver el conflicto utilizando una versión que satisfaga la dependencia. En este caso, podríamos hacer que el `eslint` que utilizamos nosotros sea la versión `0.23` (`"eslint": "0.23"`), y todo el mundo debería ser feliz.
3. Hacer un fork del paquete, arreglar el rango de versiones, y utilizar tu propia versión. En este caso necesitarás tener una declaración de este tipo `"<paquete>": "<cuenta de github>/<proyecto>#<referencia>"` en tus dependencias.

T> Ten en cuenta que las dependencias se tratan de forma diferente a partir de npm 3. Tras esa versión, le toca al consumidor del paquete (es decir, a tí) lidiar con ello.

## Warning: setState(...): Cannot update during an existing state transition

Puede que te salga esta advertencia mientras utilizas React.

You might get this warning while using React. Es fácil que te salga si lanzas `setState()` dentro de métodos como `render()`. A veces puede ocurrir de forma indirecta. Una manera de provocar la advertencia es invocar un método en vez de enlazarlo. Por ejemplo: `<input onKeyPress={this.checkEnter()} />`. Si `this.checkEnter` utiliza `setState()`, este código fallará. En su lugar, deberías usar `<input onKeyPress={this.checkEnter} />`.

## Warning: React attempted to reuse markup in a container but the checksum was invalid

Esta advertencia te puede salir de varias formas. Algunas causas comunes son:

* Has intentado montar React varias veces en el mismo contenedor. Comprueba su script de carga y asegúrate de que tu aplicación sólo se carga una vez.
* El marcado de tu plantilla no encaja con la que renderiza React. Esto puede ocurrir especialmente si estás renderizando el lenguaje de marcado inicial en un servidor.

## `Module parse failed`

Cuando utilizas Webpack puede salir un error como este:

```bash
ERROR in ./app/components/Demo.jsx
Module parse failed: .../app/components/Demo.jsx Line 16: Unexpected token <
```

Esto significa que hay algo que está impidiéndole a Webpack que interprete el fichero correctamente. Deberías comprobar la configuración del `loader` con cuidado. Asegúrate de que los cargadors correctos se aplican sobre los ficheros correctos. Si estás usando `include` deberías comprobar que el fichero que quieres cargar es alcanzable desde el `include`.

## El Proyecto Falla al Compilar

Aún cuando todo en teoría debería funcionar, a veces los rangos de las versiones te pueden dificultar las cosas, a pesar de usar versionado semántico. Si un paquete principal se rompe, por ejemplo `babel`, y ejecutaste `npm i` en un mal momento, puede que acabes con un proyecto que no compila.

Un buen primer paso es ejecutar `npm update`. Comprobará tus dependencias y podrá las versiones más recientes. Si esto no arregla el problema puedes probar a eliminar `node_modules` (`rm -rf node_modules`) desde el directorio del proyecto y reinstalar las dependencias (`npm i`).

A menudo no estás sólo con tu problema. Por eso puede que merezca la pena mirar en los gestores de incidencias de los proyectos a ver qué puede estar pasando. Puede que encuentres una manera alternativa o una solución allí. Estos problemas suelen solucionarse rápido en los proyectos más populares.

En un entorno en producción, puede ser preferible bloquear las dependencias de producción usando `npm shrinkwrap`. [La documentación oficial](https://docs.npmjs.com/cli/shrinkwrap) entra más al detalle en este asunto.
