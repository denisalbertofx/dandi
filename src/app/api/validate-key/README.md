# Endpoint de Validación de API Keys

Este endpoint permite validar API keys mediante una petición POST.

## URL
```
POST /api/validate-key
```

## Headers
```
Content-Type: application/json
```

## Body
```json
{
  "apiKey": "tu-api-key-aquí"
}
```

## Respuestas

### Éxito (200 OK)
```json
{
  "isValid": true,
  "data": {
    "id": "uuid",
    "name": "Nombre de la API Key",
    "description": "Descripción de la API Key",
    "created_at": "2024-03-21T12:00:00Z",
    "updated_at": "2024-03-21T12:00:00Z"
  }
}
```

### Error - API Key no proporcionada (400 Bad Request)
```json
{
  "isValid": false,
  "error": "API Key es requerida"
}
```

### Error - API Key inválida (401 Unauthorized)
```json
{
  "isValid": false,
  "error": "API Key inválida"
}
```

### Error - Error interno (500 Internal Server Error)
```json
{
  "isValid": false,
  "error": "Error interno del servidor"
}
```

## Ejemplo de uso con Postman

1. Crear una nueva petición POST
2. URL: `http://tu-dominio/api/validate-key`
3. Headers:
   - Key: `Content-Type`
   - Value: `application/json`
4. Body (raw JSON):
```json
{
  "apiKey": "tu-api-key-aquí"
}
``` 