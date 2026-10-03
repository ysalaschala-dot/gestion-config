# Sistema de Gestión de Residuos Orgánicos Agroindustriales - Finca Catalina

Repositorio del Parcial II de Gestión de Configuración de Software (GCS).

## Incluye
- Documentación del Parcial II y OCI-001.
- API base con Node.js y Express.
- Interfaz web.
- Endpoint de autenticación preparado para JWT.
- Registro de recepción y trazabilidad.
- Estructura para Git, ramas, Issues y Pull Requests.

## Estructura
backend/   API y lógica
frontend/  Interfaz web
docs/      Documentación
database/  Scripts SQL
config/    Versionado

## Ejecución
1. Instalar Node.js.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env`.
4. Definir un JWT_SECRET propio.
5. Ejecutar `npm start`.

## Gestión de configuración
- main: versión estable.
- develop: integración.
- feature/cambio-propuesto: OCI-001.
- hotfix: correcciones urgentes.

## Versionamiento
v1.0.0 = línea base del Parcial I.
v1.1.0 = evolución asociada a OCI-001.

No se almacenan secretos reales en el repositorio.
