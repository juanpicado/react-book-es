# Probando React

He decidido publicar una versión TL;DR (demasiado largo, no lo leas) de este capítulo para la comunidad para así animar a la gente a apoyar mi trabajo. Esto me permitirá desarrollar más contenido, así que realmente es una estrategia ganar-ganar.

Puedes acceder al capítulo completo comprando una copia a través de [Leanpub](https://leanpub.com/survivejs_react). Los siguientes puntos te darán una idea del contenido del capítulo.

## TL;DR

* Técnicas básicas de testing, incluido test unitario, test de aceptación, test basado en propiedades, y test basado en mutaciones.
* Los tests unitarios nos permiten *determinar* ciertas verdades.
* Los tests de aceptación nos permiten probar aspectos cualitativos de nuestro sistema.
* Los tests basados en propiedades (echa un vistazo a [QuickCheck](https://hackage.haskell.org/package/QuickCheck)) son más genéricos y nos permiten cubrir un mayor rango de valores con más facilidad. Esos tests son más difíciles de probar.
* Los tests basados en mutaciones permiten probar los tests. Desafortunadamente, todavía no es una técnica particularmente popular en JavaScript.
* La [aplicación](https://github.com/cesarandreu/web-app) de Cesar Andreu tiene una buena configuración de test (Mocha/Karma/Istanbul).
* La cobertura del código nos permiten saber qué partes del código no están siendo probadas. Sin embargo, esto no nos da ninguna medida de la calidad de nuestros tests.
* [React Test Utilities](https://facebook.github.io/react/docs/test-utils.html) nos brinda una buena manera de escribir tests unitarios para nuestros componentes. Hay APIs más sencillas, como [jquense/react-testutil-query](https://github.com/jquense/react-testutil-query).
* Alt tiene buenos mecanismos para probar [acciones](http://alt.js.org/docs/testing/actions/) y [almacenes](http://alt.js.org/docs/testing/stores/).
* El testing te dá confianza, lo cual se convierte en algo particularmente importante a medida que la base del código crece, ya que se vuelve más difícil romper cosas sin darte cuenta.

> [Compra el libro](https://leanpub.com/survivejs-react) para más detalles.
