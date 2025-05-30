# VozActiva Ciudadana (Versión con Mock Data)

Esta es la versión inicial de la aplicación VozActiva Ciudadana, implementada con React Native (Expo). Actualmente, la aplicación utiliza datos de prueba (mock data) para simular su funcionalidad y toda la interfaz de usuario está en español.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   [Node.js](https://nodejs.org/) (versión LTS recomendada)
*   npm (viene con Node.js) o [Yarn](https://yarnpkg.com/)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/):
    ```bash
    npm install -g expo-cli
    ```

## Instalación y Ejecución

1.  **Clona el repositorio (o descarga los archivos del proyecto).**

2.  **Navega al directorio del proyecto:**
    ```bash
    cd ruta/a/app_project/VozActivaCiudadana
    ```

3.  **Instala las dependencias:**
    Usando npm:
    ```bash
    npm install
    ```
    O usando Yarn:
    ```bash
    yarn install
    ```

4.  **Inicia la aplicación:**
    Usando npm:
    ```bash
    npm start
    ```
    O usando Yarn:
    ```bash
    yarn start
    ```
    Esto iniciará el Metro Bundler de Expo. Podrás escanear el código QR con la aplicación Expo Go en tu dispositivo móvil (iOS o Android) o ejecutar la aplicación en un emulador/simulador.

## Funcionalidades (Versión Actual con Mock Data)

*   Navegación básica mediante pestañas: Noticias, Mapa, Crear Reporte, Perfil.
*   Visualización de reportes de prueba en un feed y en un mapa.
*   Creación simulada de nuevos reportes (anónimos o no), incluyendo selección de categoría, adjuntar multimedia (simulado) y ubicación (simulada).
*   Visualización de detalles de reportes, incluyendo comentarios de prueba.
*   Adición simulada de comentarios a los reportes.
*   Toda la interfaz de usuario está en español.

## Próximos Pasos

La siguiente fase incluirá la integración con el backend (Appwrite) y APIs (Cloudinary) para reemplazar los datos de prueba con datos reales y habilitar la funcionalidad completa.
