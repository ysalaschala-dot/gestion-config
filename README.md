# Sistema de Gestión de Residuos Orgánicos Agroindustriales - Finca Catalina

Repositorio del Parcial II de **Gestión de Configuración de Software (GCS)**.

## Objetivo
Controlar versiones, cambios, documentación y trazabilidad del Sistema de Gestión de Residuos Orgánicos Agroindustriales de la Finca Catalina.

## Versiones
- **v1.0.0:** versión base definida en el Parcial I.
- **v1.1.0:** versión prevista para incorporar la OCI-001.

## OCI-001
**Título:** Ampliación del registro y trazabilidad de recepción.

El cambio relaciona la información de recepción con el lote correspondiente para facilitar la trazabilidad.

## Ramas
- `main`: versiones estables.
- `develop`: integración.
- `feature/cambio-propuesto`: implementación de OCI-001.
- `hotfix`: correcciones urgentes.

## Estructura
```
docs/      Documentación de GCS
backend/   API y lógica del sistema
frontend/  Interfaz web
config/    Configuración y versión
```

## Tecnologías
HTML, CSS, JavaScript, Node.js, Express y MySQL.

## Seguridad
Las credenciales y secretos se cargan mediante variables de entorno. El archivo `.env` no debe subirse al repositorio.
