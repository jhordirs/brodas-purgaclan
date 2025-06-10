# Descripción:

La aplicación **BRODAS - Sistema de Purga** es un sistema que permite manejar un base de datos local de miembros del clan de Destiny 2.

### Características:

1- Permite añadir miembros del clan a una base de datos local.

2- Permite vincular el Bungie ID con un ID de Discord.

3- La base de datos local es completamente manipulable.

4- Permite hacer un cruce de información entre los datos de la API y base datos local para hacer acciones de eliminar o añadir miembros.

5- Cuenta con un registro de cambios para hacer seguimiento.

# Iniciar proyecto:

1- Crear un archivo **.env** en la carpeta raíz con el siguiente contenido:

```BUNGIE_API_KEY=TU_API_KEY```

```CLAN_ID=TU_CLAN_ID```

2- Ejecutar **node server.js** en terminal para iniciar proyecto.

3- Entrar a **http://localhost:4000/** para abrir proyecto.

4- Ejecutar comando **Ctrl+C** en terminal para detener proyecto.

# Guardar cambios:

1- Ejecutar **git add .** en terminal para actualizar o añadir archivos del proyecto.

2- Ejecutar **git commit -m "mensaje"** en terminal para hacer una captura instantánea de los cambios.

3- Ejecutar **git push** en terminal para enviar todos los cambios realizados al repositorio.

### Importante:

Cualquier cambio que se haga de manera local, incluyendo modificaciones a la base de datos, guarda los cambios para uso de todos los colaboradores.

# Cargar cambios:

1- Ejecutar **git pull** en terminal para obtener los cambios más recientes del repositorio.

# Verificaciones:

1- Ejecutar **git remote -v** para verificar que esté vinculado al repositorio correcto: **https://github.com/jhordirs/brodas-purgaclan.git**.

2- Ejecutar **git remote add origin https://github.com/jhordirs/brodas-purgaclan.git** para vincular el proyecto con el repositorio.

3- Ejecutar **git remote set-url https://github.com/jhordirs/brodas-purgaclan.git** para actualizar el repositorio del proyecto si es que cuenta con otro.

# Notas:

1- El proyecto no es para uso general (pero tampoco está restringido), fue elaborado y personalizado para **uso** del **Clan BRODAS - Destiny 2**.

2- Cualquier consulta y/o duda. Escríbeme en Discord, búscame como **jhordi**.
