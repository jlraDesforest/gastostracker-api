SELF-HOSTED PERSONAL FINANCE MANAGER
Evaluación técnica, arquitectura actual, infraestructura y hoja de ruta de evolución

Tipo de proyecto: Aplicación web de gestión de finanzas personales
Arquitectura: Cliente-servidor
Backend: Node.js
Base de datos: SQLite
Frontend: HTML, CSS y JavaScript
Infraestructura: Samsung Galaxy A30s reutilizado como servidor físico
Conectividad: Wi-Fi y Tailscale
Administración remota: SSH y Scrcpy
Alimentación eléctrica: Cargador y enchufe inteligente TP-Link Tapo
Estado: Proyecto en desarrollo

1. INTRODUCCIÓN Y DESCRIPCIÓN GENERAL DEL PROYECTO

El proyecto consiste en desarrollar una aplicación web destinada a la gestión y el control de gastos personales, cuyo objetivo principal es permitir registrar, consultar, modificar y eliminar movimientos financieros, así como mantener un historial organizado de las operaciones económicas realizadas.

Sin embargo, el proyecto no se limita exclusivamente al desarrollo de una aplicación web convencional.

Una de sus principales características es la infraestructura sobre la cual se ejecuta: en lugar de contratar un servicio de alojamiento externo o utilizar directamente un servidor en la nube, se ha reutilizado un dispositivo móvil Samsung Galaxy A30s como servidor físico para alojar y ejecutar la aplicación.

El dispositivo permanece conectado a una red Wi-Fi y dispone de acceso remoto mediante Tailscale, SSH y Scrcpy. De esta manera, es posible administrar el entorno, acceder al sistema y realizar tareas de mantenimiento sin necesidad de interactuar físicamente con el teléfono de manera permanente.

La aplicación utiliza una arquitectura cliente-servidor, en la que el frontend se comunica con un backend desarrollado en Node.js. Este backend procesa las solicitudes, ejecuta las operaciones correspondientes sobre la base de datos SQLite y proporciona los recursos necesarios para que el cliente pueda utilizar la aplicación.

Adicionalmente, se ha implementado una solución de administración energética mediante un enchufe inteligente TP-Link Tapo, encargado de controlar los períodos de alimentación eléctrica del dispositivo.

El propósito de esta configuración es mantener el teléfono operativo durante largos períodos, reduciendo la exposición innecesaria de la batería a una carga continua.

Por tanto, el proyecto representa una combinación de varias áreas técnicas:

Desarrollo de aplicaciones web.
Programación backend.
Diseño e implementación de API REST.
Gestión de bases de datos.
Administración de sistemas.
Redes privadas y acceso remoto.
Infraestructura self-hosted.
Reutilización de hardware.
Automatización de tareas.
Operación y mantenimiento de servicios.

La intención es construir progresivamente un sistema funcional, mantenible, seguro y documentado, utilizando recursos físicos disponibles y aplicando principios de ingeniería de software.

2. ARQUITECTURA GENERAL DEL SISTEMA

Actualmente, el proyecto sigue un modelo de arquitectura cliente-servidor con un backend monolítico.

Esto significa que existe una aplicación backend centralizada que concentra las principales responsabilidades del servidor.

Entre ellas se encuentran:

Recibir solicitudes HTTP.
Procesar las operaciones solicitadas por el cliente.
Ejecutar operaciones CRUD.
Comunicarse con SQLite.
Gestionar las respuestas de la API.
Servir los archivos estáticos del frontend.

El sistema puede entenderse mediante los siguientes componentes:

2.1. Capa de presentación: Frontend

El frontend constituye la interfaz con la que interactúa el usuario.

Su responsabilidad es mostrar la información financiera, proporcionar formularios para registrar movimientos, presentar los datos almacenados y permitir realizar las operaciones disponibles.

Las tecnologías utilizadas son:

HTML: estructura de los documentos y componentes de la interfaz.
CSS: presentación visual, distribución y estilos.
JavaScript: comportamiento dinámico, validaciones e interacción con el backend.

El frontend se comunica con el servidor mediante solicitudes HTTP, utilizando mecanismos como Fetch API para consumir los endpoints correspondientes.

Una mejora importante consiste en mantener estos tres elementos separados, evitando concentrar toda la estructura, los estilos y la lógica de interacción dentro de un único archivo HTML.

La estructura propuesta es:

public/ ├── index.html ├── css/ │ └── styles.css └── js/ └── app.js

Esta separación facilita el mantenimiento, la depuración y la evolución de la interfaz.

2.2. Capa de aplicación: Backend

El backend está desarrollado utilizando Node.js.

Su función principal es actuar como intermediario entre el frontend y la base de datos.

Cuando el usuario realiza una operación desde la interfaz, el frontend envía una solicitud al servidor. El backend recibe dicha solicitud, valida los datos, ejecuta la lógica correspondiente y devuelve una respuesta.

Por ejemplo, al registrar un gasto:

El usuario completa un formulario.
El frontend recopila la información.
JavaScript envía una solicitud HTTP al backend.
El backend recibe los datos.
Se validan los valores recibidos.
Se ejecuta la operación correspondiente en SQLite.
El servidor devuelve una respuesta.
El frontend actualiza la información mostrada.

Este flujo representa una implementación habitual de comunicación entre un cliente web y una API.

2.3. Capa de persistencia: SQLite

SQLite es el motor de base de datos utilizado para almacenar los registros financieros.

Una de sus principales ventajas es que no necesita ejecutar un servidor de base de datos independiente. La información se almacena en un archivo que puede ser administrado directamente por la aplicación.

Esto permite reducir considerablemente los requisitos de infraestructura.

Para un sistema personal de control de gastos, SQLite es una alternativa razonable porque ofrece:

Persistencia de datos.
Consultas SQL.
Integridad referencial.
Transacciones.
Índices.
Bajo consumo de recursos.
Administración sencilla.
Facilidad para realizar copias de seguridad.

No existe una necesidad inmediata de migrar a PostgreSQL únicamente porque el proyecto pueda crecer.

La elección de una base de datos debe responder a necesidades reales de concurrencia, disponibilidad, administración y volumen de información.

3. INFRAESTRUCTURA FÍSICA: SAMSUNG GALAXY A30S COMO SERVIDOR

Uno de los elementos más interesantes del proyecto es la reutilización de un teléfono móvil Samsung Galaxy A30s como servidor físico.

En una implementación convencional, una aplicación de este tipo podría desplegarse en:

Un servicio de hosting compartido.
Un VPS.
Una instancia de AWS.
Un servidor doméstico.
Un dispositivo Raspberry Pi.
Un equipo Linux dedicado.

En este caso, se ha optado por aprovechar un dispositivo móvil disponible para ejecutar el servicio.

Esta decisión introduce un escenario de infraestructura diferente al habitual.

3.1. Concepto de infraestructura self-hosted

El término self-hosted hace referencia a la práctica de alojar y administrar servicios propios utilizando infraestructura bajo el control del usuario.

En lugar de depender completamente de un proveedor externo, el propietario administra el dispositivo donde se ejecuta la aplicación.

En este proyecto, el Samsung Galaxy A30s desempeña el papel de servidor físico.

Esto permite experimentar con:

Administración de servicios.
Ejecución de procesos en segundo plano.
Gestión de recursos limitados.
Configuración de redes.
Acceso remoto.
Persistencia de datos.
Mantenimiento del entorno.
Recuperación ante fallos.

Es importante aclarar que reutilizar un teléfono como servidor no significa que automáticamente se disponga de una infraestructura de producción empresarial.

Existen limitaciones relacionadas con Android, la batería, la temperatura, la conectividad, el almacenamiento y la administración de procesos.

Precisamente, conocer y gestionar esas limitaciones forma parte del aprendizaje técnico del proyecto.

3.2. Edge Computing

La infraestructura también puede relacionarse con el concepto de Edge Computing o computación en el borde.

Edge Computing consiste en ejecutar procesos computacionales cerca del lugar donde se generan o consumen los datos, en lugar de depender exclusivamente de centros de datos remotos.

En este escenario:

El servidor se encuentra físicamente en el dispositivo móvil.
La aplicación se ejecuta localmente en dicho dispositivo.
La base de datos se encuentra en el mismo entorno.
Los clientes acceden al servicio mediante una conexión de red.

Por tanto, existe una aproximación práctica a un entorno de computación en el borde.

No obstante, es importante distinguir entre Edge Computing y un simple servidor local: el término describe el enfoque de procesamiento y ubicación de los recursos, no una tecnología específica ni una certificación de arquitectura.

3.3. Limitaciones del hardware

Un teléfono móvil no está diseñado originalmente para desempeñar las mismas funciones que un servidor convencional.

Entre sus limitaciones se encuentran:

Gestión agresiva de procesos en segundo plano.
Restricciones energéticas.
Posibles reinicios del sistema operativo.
Capacidad limitada de refrigeración.
Dependencia de la conectividad Wi-Fi.
Almacenamiento y memoria limitados.
Envejecimiento de la batería.
Dependencia de actualizaciones del sistema operativo.

Por ello, una parte importante de la evolución del proyecto consiste en conseguir que el servicio funcione de manera estable y pueda recuperarse automáticamente ante determinadas situaciones.

4. CONECTIVIDAD Y ADMINISTRACIÓN REMOTA

El acceso y mantenimiento del servidor se realizan mediante diferentes herramientas.

4.1. Tailscale

Tailscale proporciona conectividad mediante una red privada basada en WireGuard.

Su función dentro del proyecto es permitir que los dispositivos autorizados puedan comunicarse mediante una red privada virtual, evitando depender necesariamente de la exposición directa del servidor a Internet.

Entre sus ventajas se encuentran:

Conectividad remota.
Comunicación cifrada.
Administración de dispositivos autorizados.
Acceso a servicios privados.
Reducción de la necesidad de configurar redireccionamiento de puertos en el router.

Tailscale resulta especialmente útil para acceder al servidor desde otros dispositivos sin tener que publicar directamente la API en Internet.

Sin embargo, disponer de una red privada no sustituye la implementación de autenticación y autorización dentro de la aplicación.

La seguridad debe aplicarse en diferentes capas.

4.2. SSH

SSH permite administrar remotamente el entorno donde se ejecuta el servidor.

Entre sus posibles aplicaciones se encuentran:

Ejecutar comandos.
Iniciar y detener procesos.
Consultar archivos.
Revisar registros.
Actualizar el código.
Realizar tareas de mantenimiento.
Inspeccionar el estado del entorno.

Su utilización permite administrar el servidor sin depender de una conexión física directa al dispositivo.

4.3. Scrcpy

Scrcpy permite visualizar y controlar la pantalla de un dispositivo Android desde otro equipo.

Dentro del proyecto, constituye una herramienta complementaria para la administración del Samsung Galaxy A30s.

Puede utilizarse para:

Inspeccionar el estado visual del dispositivo.
Administrar configuraciones de Android.
Interactuar con aplicaciones.
Revisar notificaciones.
Realizar tareas que requieren una interfaz gráfica.

SSH y Scrcpy cumplen funciones diferentes y complementarias.

SSH proporciona administración mediante terminal, mientras que Scrcpy permite interactuar visualmente con Android.

5. ADMINISTRACIÓN ENERGÉTICA Y CONSERVACIÓN DEL DISPOSITIVO

Debido a que el Samsung Galaxy A30s permanecerá encendido durante períodos prolongados, es necesario considerar el consumo energético, la temperatura y el estado de la batería.

Un teléfono móvil convencional no está diseñado necesariamente para permanecer conectado a un cargador durante años ejecutando servicios continuamente.

Por ello, se ha incorporado un sistema de administración energética mediante un enchufe inteligente TP-Link Tapo.

5.1. Control mediante enchufe inteligente

El enchufe inteligente permite programar períodos de encendido y apagado del suministro eléctrico.

La intención es evitar mantener permanentemente el dispositivo conectado a una fuente de alimentación mientras su batería permanece constantemente en un estado de carga elevado.

Se han configurado horarios teniendo en cuenta el nivel de batería, su capacidad y el comportamiento esperado del dispositivo.

El objetivo es mantener un rango aproximado de carga entre el 30 % y el 95 %, evitando en lo posible permanecer constantemente en los extremos.

Sin embargo, existe una consideración técnica importante: el porcentaje de batería no es el único factor que determina su vida útil.

También influyen:

Temperatura de funcionamiento.
Tiempo de permanencia a niveles elevados de carga.
Número de ciclos de carga.
Calidad del cargador.
Estado químico de la batería.
Antigüedad del dispositivo.
Condiciones ambientales.

Por tanto, la programación del enchufe debe entenderse como una medida de administración energética, no como una garantía de conservación de la batería.

5.2. Control térmico

La temperatura es uno de los factores más importantes para la conservación de una batería de ion-litio.

Un dispositivo que permanece encendido 24/7 puede experimentar calentamiento debido a:

Actividad del procesador.
Procesos en segundo plano.
Conectividad Wi-Fi.
Actividad de almacenamiento.
Carga de batería.
Temperatura ambiental.

Por ello, resulta conveniente vigilar periódicamente el comportamiento térmico.

El objetivo es evitar condiciones de funcionamiento que aceleren el deterioro del dispositivo.

También es recomendable mantenerlo en un lugar ventilado, sin exposición directa al sol y sin superficies que retengan demasiado calor.

Si la batería presenta hinchazón, deformación o cualquier signo de daño físico, el dispositivo debe dejar de utilizarse y cargarse. No es seguro continuar operándolo como servidor.

5.3. Consideraciones para funcionamiento 24/7

La disponibilidad continua del servidor depende de mucho más que mantener el dispositivo conectado a la electricidad.

También deben considerarse:

Reinicios inesperados.
Pérdidas de conectividad.
Interrupciones eléctricas.
Fallos de procesos.
Restricciones de Android.
Sobrecalentamiento.
Degradación del almacenamiento.
Estado de la batería.

Una evolución futura debería incluir monitorización y mecanismos de recuperación.

6. EVALUACIÓN DEL NIVEL DE INGENIERÍA DE SOFTWARE

El proyecto sí pertenece al ámbito de la ingeniería de software.

No obstante, es necesario distinguir entre implementar funcionalidades y desarrollar un sistema con criterios sólidos de ingeniería.

Una aplicación que permite realizar operaciones CRUD puede ser relativamente sencilla.

Sin embargo, cuando se consideran aspectos como arquitectura, seguridad, persistencia, despliegue, recuperación, mantenimiento y observabilidad, el alcance técnico aumenta.

Actualmente, el proyecto incorpora diferentes disciplinas.

6.1. Desarrollo backend

Se trabaja con Node.js para implementar la lógica del servidor.

Esto implica comprender:

Ciclo de vida de solicitudes HTTP.
Métodos HTTP.
Endpoints.
Códigos de respuesta.
Manejo de errores.
Validación de datos.
Comunicación con bases de datos.
Operaciones CRUD.
Separación de responsabilidades.

Nivel actual estimado: básico a intermedio, dependiendo de la calidad y organización de la implementación.

6.2. Desarrollo frontend

La interfaz web requiere conocimientos de:

HTML.
CSS.
JavaScript.
Manipulación del DOM.
Eventos.
Formularios.
Validaciones.
Consumo de API.
Manejo de respuestas HTTP.

Separar HTML, CSS y JavaScript es una primera mejora de organización.

Sin embargo, esta separación por sí sola no representa una arquitectura frontend avanzada.

Su propósito es facilitar la mantenibilidad y reducir el acoplamiento entre estructura, presentación y comportamiento.

6.3. Bases de datos

La utilización de SQLite implica trabajar con persistencia de información.

Esto permite desarrollar conocimientos sobre:

Diseño de tablas.
Relaciones.
Claves primarias.
Claves foráneas.
Consultas SQL.
Inserciones.
Actualizaciones.
Eliminaciones.
Transacciones.
Índices.
Integridad de los datos.

Una evolución importante será implementar copias de seguridad y procedimientos de recuperación.

6.4. Administración de sistemas

El hecho de ejecutar el backend sobre un dispositivo físico introduce responsabilidades adicionales.

No basta con escribir código y ejecutarlo.

También hay que administrar el entorno en el que funciona.

Esto implica familiarizarse con:

Procesos.
Servicios.
Sistemas de archivos.
Permisos.
Redes.
Conectividad.
Registros del sistema.
Consumo de recursos.
Reinicios.
Actualizaciones.
6.5. DevOps

El proyecto también tiene una dimensión relacionada con DevOps.

Actualmente, esta dimensión se encuentra en desarrollo.

DevOps no consiste únicamente en instalar herramientas como Docker, Jenkins o PM2.

Se relaciona con la integración entre desarrollo y operaciones, automatización, entrega continua, observabilidad y confiabilidad.

El proyecto puede evolucionar hacia estas prácticas mediante:

Automatización de despliegues.
Control de versiones.
Pruebas automatizadas.
Gestión de procesos.
Monitorización.
Gestión de configuración.
Recuperación ante fallos.
7. ORGANIZACIÓN Y MODULARIZACIÓN DEL BACKEND

Una de las mejoras propuestas consiste en abandonar progresivamente la concentración de responsabilidades dentro de un único archivo server.js.

Cuando una aplicación crece, mantener toda la lógica en un mismo archivo dificulta:

Localizar errores.
Comprender el flujo de ejecución.
Reutilizar funciones.
Realizar pruebas.
Modificar funcionalidades.
Mantener el código.

Una alternativa es aplicar separación de responsabilidades.

7.1. Estructura propuesta

Una posible organización sería:

project/ │ ├── public/ │ ├── index.html │ ├── css/ │ │ └── styles.css │ └── js/ │ └── app.js │ ├── src/ │ ├── config/ │ │ └── database.js │ │ │ ├── routes/ │ │ └── expenses.routes.js │ │ │ ├── controllers/ │ │ └── expenses.controller.js │ │ │ ├── services/ │ │ └── expenses.service.js │ │ │ ├── repositories/ │ │ └── expenses.repository.js │ │ │ ├── middleware/ │ │ ├── auth.middleware.js │ │ └── error.middleware.js │ │ │ └── app.js │ ├── database/ │ └── expenses.db │ ├── tests/ │ ├── .env ├── .gitignore ├── package.json ├── package-lock.json └── server.js

Esta estructura es orientativa y puede adaptarse al tamaño real de la aplicación.

No es obligatorio crear todas estas carpetas desde el principio.

7.2. Separación de responsabilidades

Cada módulo debería tener una función claramente definida.

Routes: definen los endpoints disponibles y relacionan las solicitudes con los controladores.

Controllers: reciben las solicitudes, coordinan la operación y construyen las respuestas HTTP.

Services: contienen la lógica de negocio.

Repositories: encapsulan las operaciones de acceso a datos.

Config: contiene configuraciones e inicialización de componentes.

Middleware: implementa funciones transversales como autenticación, validación y manejo de errores.

Esta separación facilita realizar modificaciones sin afectar innecesariamente otras partes del sistema.

7.3. Arquitectura monolítica modular

Es importante aclarar que modularizar el backend no significa convertirlo en microservicios.

El sistema puede continuar siendo monolítico, pero con una estructura interna organizada.

De hecho, para una aplicación personal de gestión de gastos, un monolito modular puede ser una solución mucho más apropiada que una arquitectura distribuida.

Los microservicios introducen complejidad de comunicación, despliegue, observabilidad y mantenimiento que probablemente no está justificada en este proyecto.

8. GESTIÓN DE PROCESOS Y DISPONIBILIDAD

Uno de los problemas que deben resolverse en un servidor de funcionamiento continuo es la administración de procesos.

Ejecutar:

node server.js

permite iniciar la aplicación, pero no constituye por sí mismo una estrategia de disponibilidad.

Si el proceso termina inesperadamente, el servidor deja de responder.

Si Android reinicia el dispositivo, puede ser necesario iniciar nuevamente la aplicación.

Para resolver parte de estos problemas se puede implementar un gestor de procesos o un mecanismo de supervisión compatible con el entorno Android utilizado.

8.1. PM2

PM2 es un gestor de procesos para aplicaciones Node.js.

Entre sus funcionalidades se encuentran:

Supervisión de procesos.
Reinicio automático ante determinadas caídas.
Gestión de registros.
Administración de instancias.
Consulta del estado de las aplicaciones.

Su incorporación permitiría reducir la dependencia de iniciar manualmente el servidor mediante SSH.

Sin embargo, hay una consideración importante: PM2 no garantiza por sí solo que una aplicación vuelva a iniciarse después de cualquier reinicio del teléfono.

También es necesario configurar correctamente el inicio automático del entorno Android y considerar sus restricciones de ejecución en segundo plano.

8.2. Recuperación ante fallos

Una aplicación confiable debe contemplar diferentes escenarios.

Por ejemplo:

El proceso Node.js termina.
El dispositivo pierde conexión Wi-Fi.
El sistema operativo reinicia.
La base de datos deja de estar disponible.
Se produce una interrupción eléctrica.

La estrategia de recuperación debería identificar cuáles de estos escenarios pueden detectarse y cuáles pueden solucionarse automáticamente.

La meta no es prometer disponibilidad absoluta, sino reducir los tiempos de interrupción y facilitar la recuperación.

9. SEGURIDAD DE LA APLICACIÓN

La seguridad es una de las áreas que deberían recibir mayor atención antes de considerar que el sistema está preparado para un uso prolongado.

Aunque Tailscale permite restringir el acceso a la infraestructura, esto no significa que todas las operaciones dentro de la aplicación estén protegidas.

Una red privada no reemplaza los controles de acceso de una aplicación.

9.1. Autenticación

La aplicación debería incorporar un mecanismo que permita identificar a los usuarios autorizados.

Esto puede realizarse mediante un sistema de autenticación con credenciales y sesiones.

También es posible implementar mecanismos basados en tokens, como JWT, cuando exista una necesidad real de comunicación autenticada sin estado.

No es obligatorio utilizar JWT.

La elección debe considerar el tipo de aplicación, el almacenamiento de sesiones, la expiración de credenciales y la facilidad de revocación.

9.2. Autorización

Autenticación y autorización son conceptos diferentes.

La autenticación responde a la pregunta:

¿Quién está intentando acceder?

La autorización responde a:

¿Qué operaciones puede realizar esa persona?

Por ejemplo, un usuario autenticado podría tener permiso para consultar sus propios gastos, pero no necesariamente para modificar registros pertenecientes a otro usuario.

9.3. Validación de datos

El backend debe validar todos los datos recibidos.

No debe confiar únicamente en las validaciones del frontend.

Se deben considerar:

Valores numéricos.
Fechas.
Categorías.
Descripciones.
Identificadores.
Campos obligatorios.
Límites razonables.
Tipos de datos.

También deben utilizarse consultas parametrizadas para reducir el riesgo de inyección SQL.

9.4. Gestión de secretos

Las credenciales y configuraciones sensibles no deberían estar escritas directamente en el código.

Se recomienda utilizar variables de entorno y mantener los archivos sensibles fuera del repositorio público.

El archivo .env debe incluirse en .gitignore.

También deben protegerse:

Claves de acceso.
Tokens.
Contraseñas.
Credenciales de servicios.
Información privada de conexión.
9.5. Protección de Tailscale y SSH

La seguridad de la infraestructura también requiere:

Mantener los dispositivos autorizados bajo control.
Utilizar autenticación segura.
Restringir los permisos necesarios.
Evitar exponer innecesariamente puertos.
Mantener actualizadas las herramientas.
Revisar las políticas de acceso.
10. EVOLUCIÓN DE LA BASE DE DATOS

SQLite es una elección apropiada para la etapa actual.

No obstante, es conveniente comprender sus limitaciones.

SQLite utiliza un modelo de acceso basado en archivos y admite múltiples lectores, pero las escrituras concurrentes requieren coordinación.

Esto significa que, a medida que aumenta el número de operaciones simultáneas, puede ser necesario evaluar otras alternativas.

10.1. Mantener SQLite

Para una aplicación personal, SQLite puede seguir siendo suficiente durante mucho tiempo.

Sus ventajas incluyen:

Simplicidad.
Bajo consumo.
Facilidad de respaldo.
Ausencia de un servidor independiente.
Buen rendimiento en aplicaciones pequeñas y medianas.

La decisión de mantenerlo debe basarse en el comportamiento real del sistema.

10.2. Migración a PostgreSQL

Si el proyecto evoluciona y requiere mayor concurrencia, múltiples usuarios, administración avanzada o separación entre aplicación y base de datos, podría evaluarse PostgreSQL.

PostgreSQL ofrece:

Arquitectura cliente-servidor.
Gestión de múltiples conexiones.
Control avanzado de transacciones.
Funciones de integridad.
Herramientas de administración.
Capacidades avanzadas de consulta.

También podría utilizarse un ORM como Prisma para facilitar la interacción entre la aplicación y la base de datos.

Sin embargo, un ORM no sustituye el conocimiento de SQL ni elimina la necesidad de diseñar correctamente el modelo de datos.

La migración debe realizarse cuando exista una justificación técnica.

11. RESPALDOS Y RECUPERACIÓN DE DATOS

En una aplicación financiera, la persistencia de la información es especialmente importante.

No basta con que los datos se almacenen correctamente.

También debe existir un mecanismo para recuperarlos ante fallos.

Se recomienda incorporar:

Copias de seguridad automatizadas.
Almacenamiento de respaldos fuera del dispositivo.
Control de integridad.
Historial de copias.
Procedimientos documentados de restauración.
Pruebas periódicas de recuperación.

Es importante considerar que SQLite puede utilizar archivos auxiliares durante determinadas operaciones, por lo que los respaldos deben realizarse mediante procedimientos seguros, como su API de backup o mecanismos compatibles con sus modos de funcionamiento.

Una copia de seguridad que nunca se ha probado no constituye una garantía real de recuperación.

12. CALIDAD DE SOFTWARE Y PRUEBAS

Una aplicación funcional no necesariamente es una aplicación confiable.

Para mejorar la calidad del proyecto, es necesario incorporar pruebas automatizadas.

12.1. Pruebas unitarias

Permiten comprobar funciones individuales.

Por ejemplo:

Cálculo de totales.
Validación de importes.
Normalización de fechas.
Clasificación de gastos.
Reglas de negocio.
12.2. Pruebas de integración

Permiten comprobar que diferentes componentes funcionan correctamente en conjunto.

Por ejemplo:

Backend y base de datos.
Rutas y controladores.
Servicios y repositorios.
Validación de solicitudes.
Respuestas HTTP.
12.3. Pruebas funcionales

Permiten comprobar el comportamiento completo de una funcionalidad.

Por ejemplo:

Registrar un gasto.
Consultar el registro.
Modificarlo.
Comprobar los cambios.
Eliminarlo.
Verificar que ya no aparece.
12.4. Herramientas de calidad

Se pueden incorporar progresivamente:

Node.js Test Runner o Jest.
Supertest.
ESLint.
Prettier.
Git.
GitHub Actions.

No es necesario instalar todas las herramientas inmediatamente.

Lo importante es establecer un proceso repetible de comprobación de calidad.

13. AUTOMATIZACIÓN Y CI/CD

Otra evolución posible consiste en incorporar integración y entrega continuas.

CI/CD permite automatizar determinadas etapas del desarrollo y despliegue.

En este proyecto podría utilizarse GitHub Actions para:

Ejecutar pruebas al realizar un push.
Comprobar errores de sintaxis.
Ejecutar análisis estático.
Validar dependencias.
Comprobar que los cambios no rompen funcionalidades existentes.

Posteriormente, podría diseñarse un procedimiento de despliegue remoto hacia el Samsung Galaxy A30s.

La automatización debería realizarse de forma controlada, incluyendo mecanismos para evitar reemplazar una versión funcional por otra defectuosa.

14. MONITORIZACIÓN Y OBSERVABILIDAD

Un servidor que permanece encendido 24/7 necesita mecanismos para conocer su estado.

La observabilidad permite comprender qué está ocurriendo dentro de un sistema mediante información como registros, métricas y trazas.

Para este proyecto sería conveniente implementar:

14.1. Logs

Registrar acontecimientos relevantes:

Inicio del servidor.
Errores.
Solicitudes importantes.
Fallos de conexión.
Operaciones críticas.
Problemas con la base de datos.

Los registros no deberían incluir contraseñas, tokens ni información financiera sensible innecesaria.

14.2. Métricas

Supervisar indicadores como:

Uso de CPU.
Consumo de memoria RAM.
Espacio disponible.
Tiempo de actividad.
Estado del proceso Node.js.
Disponibilidad de la API.
Temperatura del dispositivo, cuando pueda obtenerse de manera fiable.
14.3. Alertas

Una evolución interesante sería implementar notificaciones cuando:

El servidor deje de responder.
El almacenamiento alcance niveles críticos.
El proceso se reinicie repetidamente.
Se detecten errores importantes.
El dispositivo presente temperaturas anormales.

Esto permitiría pasar de una administración reactiva a una administración preventiva.

15. EVALUACIÓN DEL PROYECTO COMO PORTAFOLIO PROFESIONAL

El proyecto puede incluirse perfectamente en GitHub y utilizarse como parte de un portafolio técnico.

Su principal valor no está en que sea una aplicación financiera novedosa, sino en que integra desarrollo de software e infraestructura propia.

Un proyecto CRUD convencional puede demostrar conocimientos básicos de programación.

Este proyecto tiene la posibilidad de demostrar competencias adicionales:

Desarrollo de una aplicación web completa.
Diseño de una API.
Persistencia mediante SQL.
Administración de un servidor.
Configuración de conectividad privada.
Administración remota.
Despliegue sobre hardware real.
Gestión de procesos.
Resolución de problemas operativos.
Documentación técnica.
Mantenimiento y evolución de software.

Sin embargo, para que tenga valor profesional, es importante demostrar que las funcionalidades realmente están implementadas y que pueden verificarse.

No se deben presentar características planificadas como funcionalidades terminadas.

15.1. Presentación recomendada en GitHub

Nombre sugerido:

Self-Hosted Personal Finance Manager

Descripción:

Aplicación web de gestión de finanzas personales desarrollada con Node.js, SQLite, HTML, CSS y JavaScript. Desplegada sobre un dispositivo Android reutilizado como servidor físico, con acceso remoto mediante Tailscale y administración mediante SSH. Proyecto orientado al aprendizaje de arquitectura cliente-servidor, desarrollo backend, persistencia de datos, infraestructura self-hosted y operación continua de servicios.

15.2. Qué debería incluir el repositorio
README.md.
Descripción del proyecto.
Arquitectura general.
Diagrama de componentes.
Tecnologías utilizadas.
Estructura de carpetas.
Instrucciones de instalación.
Configuración del entorno.
Variables de entorno de ejemplo.
Documentación de endpoints.
Modelo de datos.
Instrucciones de ejecución.
Pruebas automatizadas.
Capturas de pantalla.
Limitaciones conocidas.
Roadmap.
Licencia.

También debería incluir un .gitignore correctamente configurado para evitar subir bases de datos privadas, archivos de configuración sensibles, credenciales o dependencias instaladas.

16. ROADMAP DE DESARROLLO Y EVOLUCIÓN

La evolución del proyecto se plantea mediante etapas progresivas.

No se busca incorporar tecnologías por moda, sino resolver problemas concretos a medida que aparecen.

ETAPA 1: ORGANIZACIÓN DEL CÓDIGO

Objetivo: mejorar la mantenibilidad.

Tareas:

Separar index.html, styles.css y app.js.
Organizar las carpetas del frontend.
Modularizar el backend.
Separar rutas y controladores.
Centralizar la configuración de SQLite.
Introducir variables de entorno.
Crear una estructura de proyecto documentada.

Resultado esperado:

Una aplicación con responsabilidades mejor definidas y más sencilla de mantener.

ETAPA 2: SEGURIDAD

Objetivo: proteger los datos y las operaciones.

Tareas:

Implementar autenticación.
Implementar autorización.
Validar datos en el backend.
Utilizar consultas parametrizadas.
Proteger endpoints.
Gestionar sesiones o tokens.
Revisar la configuración de Tailscale.
Proteger secretos y credenciales.

Resultado esperado:

Una aplicación con controles de acceso y validaciones adecuados para su uso personal.

ETAPA 3: CONFIABILIDAD DEL SERVIDOR

Objetivo: reducir la dependencia de la intervención manual.

Tareas:

Configurar supervisión de procesos.
Implementar reinicio automático.
Configurar inicio después de reinicios del dispositivo.
Gestionar errores.
Registrar acontecimientos.
Implementar respaldos automatizados.
Probar procedimientos de restauración.

Resultado esperado:

Un servicio más estable y con mejores mecanismos de recuperación.

ETAPA 4: CALIDAD Y PRUEBAS

Objetivo: verificar el funcionamiento de la aplicación.

Tareas:

Incorporar pruebas unitarias.
Incorporar pruebas de integración.
Realizar pruebas funcionales.
Implementar linting.
Aplicar formato consistente.
Documentar errores conocidos.
Comprobar operaciones críticas.

Resultado esperado:

Una aplicación cuya calidad pueda verificarse mediante pruebas reproducibles.

ETAPA 5: DEVOPS Y MONITORIZACIÓN

Objetivo: mejorar la administración y operación.

Tareas:

Configurar GitHub Actions.
Automatizar comprobaciones.
Registrar métricas.
Supervisar procesos.
Implementar alertas.
Vigilar recursos del dispositivo.
Automatizar tareas de mantenimiento.

Resultado esperado:

Un sistema con mayor visibilidad operativa y procesos de mantenimiento más controlados.

ETAPA 6: EVOLUCIÓN ARQUITECTÓNICA

Objetivo: preparar el sistema para nuevas necesidades.

Tareas:

Evaluar el comportamiento de SQLite.
Revisar la necesidad de PostgreSQL.
Evaluar un ORM.
Mejorar el modelo de datos.
Documentar decisiones arquitectónicas.
Evaluar la separación de componentes si existe una necesidad real.

Resultado esperado:

Una arquitectura capaz de evolucionar sin introducir complejidad innecesaria.

17. EVALUACIÓN HONESTA DEL NIVEL ACTUAL

Es importante mantener una evaluación realista.

El proyecto no debe considerarse avanzado simplemente por utilizar un teléfono móvil como servidor.

Tampoco debe considerarse insignificante porque utilice tecnologías relativamente sencillas.

Su valor depende de la implementación, la calidad del código, la documentación y la capacidad de mantenerlo operativo.

La siguiente evaluación es orientativa y se basa en la arquitectura y las actividades descritas, no en una auditoría del código fuente.

Área	Evaluación estimada
Desarrollo frontend	Básico / Intermedio
Desarrollo backend	Básico / Intermedio
API REST	Básico / Intermedio
Bases de datos	Básico / Intermedio
Arquitectura de software	Básico / Intermedio
Redes y conectividad	Intermedio
Administración remota	Intermedio
Infraestructura self-hosted	Intermedio
DevOps	En desarrollo
Seguridad	Por fortalecer
Automatización	Por desarrollar
Observabilidad	Por desarrollar
Pruebas automatizadas	Por desarrollar
Documentación técnica	En desarrollo

Esta clasificación no representa una calificación académica ni una certificación profesional.

Es una evaluación orientativa de las áreas involucradas.

18. CONCLUSIÓN

El proyecto Self-Hosted Personal Finance Manager constituye una iniciativa de desarrollo de software que combina la construcción de una aplicación web con la administración de infraestructura física propia.

Su principal característica diferenciadora es la utilización de un Samsung Galaxy A30s como servidor para alojar una aplicación desarrollada con Node.js y SQLite.

Esta decisión permite explorar aspectos que normalmente no aparecen en los ejercicios convencionales de programación, como la administración de procesos, conectividad remota, disponibilidad, consumo energético, limitaciones de hardware y mantenimiento de servicios.

Actualmente, la arquitectura es relativamente sencilla y todavía existen oportunidades importantes de mejora.

La separación de responsabilidades, la modularización del backend, la seguridad, las pruebas automatizadas, los respaldos y la monitorización son algunas de las áreas que deberían evolucionar.

No obstante, no existe ninguna necesidad de transformar inmediatamente la aplicación en una arquitectura distribuida ni de incorporar tecnologías complejas sin una justificación.

La ingeniería de software no consiste en utilizar la mayor cantidad posible de herramientas o patrones arquitectónicos.

Consiste en comprender un problema, diseñar una solución adecuada, implementarla correctamente, comprobar su funcionamiento, mantenerla y mejorarla de manera progresiva.

En ese sentido, este proyecto tiene potencial para convertirse en una demostración práctica de conocimientos de desarrollo Full Stack, administración de sistemas, infraestructura self-hosted y fundamentos de DevOps.

Su valor profesional aumentará conforme se incorporen buenas prácticas y se documenten las decisiones técnicas tomadas durante su evolución.

El objetivo final no es simplemente tener una aplicación de gastos funcionando en un teléfono móvil. El objetivo es construir, desplegar, asegurar, supervisar y mantener un sistema de software real, comprendiendo tanto su funcionamiento interno como la infraestructura sobre la cual opera.

19. PRINCIPIOS QUE GUIARÁN EL DESARROLLO

El desarrollo futuro del proyecto seguirá los siguientes principios:

Simplicidad antes que complejidad: no incorporar tecnologías sin una necesidad técnica justificada.
Separación de responsabilidades: mantener cada componente enfocado en una función concreta.
Seguridad desde el diseño: considerar la protección de datos y operaciones desde las primeras etapas.
Persistencia confiable: proteger la información mediante respaldos y procedimientos de recuperación.
Automatización progresiva: reducir las tareas manuales repetitivas.
Observabilidad: disponer de información suficiente para comprender el comportamiento del sistema.
Documentación: registrar decisiones, procedimientos y limitaciones.
Mantenibilidad: desarrollar código que pueda comprenderse, probarse y modificarse.
Uso eficiente de recursos: adaptar la solución a las capacidades reales del hardware.
Evolución basada en necesidades: ampliar la arquitectura cuando existan motivos concretos.

Estado del documento: Arquitectura y evaluación inicial del proyecto.
Naturaleza: Documento técnico de referencia y hoja de ruta de evolución.
Nota: Las funcionalidades descritas como futuras o propuestas no deben interpretarse como implementadas hasta que hayan sido desarrolladas y verificadas.