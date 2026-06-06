# Laboratorio S12 - Biblioteca

Implementacion para Next.js App Router, Prisma y Supabase.

## Abrir en Antigravity

1. Abrir Antigravity.
2. Seleccionar `Open Folder`.
3. Elegir esta carpeta: `next-api-routes`.

## Crear proyecto en Supabase

1. Entrar a `https://supabase.com/dashboard`.
2. Crear una cuenta o iniciar sesion.
3. Crear un proyecto nuevo, por ejemplo `biblioteca-next-api-routes`.
4. Guardar la contrasena de la base de datos.
5. En el dashboard del proyecto, abrir `Connect`.
6. Copiar la cadena de conexion PostgreSQL recomendada para Prisma.
7. Copiar `.env.example` como `.env`.
8. Reemplazar `DATABASE_URL` por la cadena real de Supabase.

## Uso

Ejecutar:

```bash
npm install
npx prisma db push
npx prisma generate
npm run dev
```

La aplicacion quedara disponible en `http://localhost:3000`.

## Rutas principales

- `/api/authors`
- `/api/authors/[id]`
- `/api/authors/[id]/books`
- `/api/authors/[id]/stats`
- `/api/books`
- `/api/books/[id]`
- `/api/books/search`

## Paginas

- `/`
- `/books`
- `/authors/[id]`
