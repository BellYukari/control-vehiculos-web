# Control de Vehículos - Frontend

Aplicación web desarrollada con **React.js** para la gestión de vehículos y movimientos de entrada/salida.

Este frontend consume una API REST desarrollada con Node.js, Express y MySQL. Permite registrar vehículos, administrar movimientos, consultar información mediante filtros avanzados, exportar datos a CSV y visualizar un dashboard de resumen.

---

## Tecnologías utilizadas

* React.js
* Vite
* React Router DOM
* Axios
* PrimeIcons
* CSS personalizado
* LocalStorage para guardar el tema claro/oscuro

---

## Funcionalidades principales

* Dashboard inicial con resumen del sistema.
* Gestión de vehículos.
* Registro de entradas y salidas.
* Edición de movimientos.
* Consulta avanzada de movimientos.
* Filtro por rango de fechas.
* Filtro por vehículo.
* Filtro por motorista.
* Filtro por tipo de movimiento.
* Exportación de movimientos a CSV.
* Modo claro y modo oscuro.
* Modales personalizados para crear, editar y confirmar eliminación.
* Validaciones de formularios en el frontend.

---

## Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

* Node.js
* npm
* Git
* Para mas Informacion de como instalar el proyecto revisar # Control de Vehículos - Frontend.txt

También se debe tener la API ejecutándose correctamente.

Por defecto, la API debe estar disponible en:

```txt
http://localhost:3001/api
```
## Autor
* Owen Javier Orellana Hernandez
* 
Desarrollado como parte de una prueba técnica para desarrollador web.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

