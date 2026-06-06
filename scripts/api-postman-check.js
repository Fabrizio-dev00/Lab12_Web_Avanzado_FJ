const fs = require("fs");
const path = require("path");

const baseUrl = "http://localhost:3000";
const outDir = path.resolve(__dirname, "..", "..", "..", "outputs");

async function request(name, method, url, body) {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}
  return {
    name,
    method,
    url,
    status: response.status,
    ok: response.ok,
    durationMs: Date.now() - startedAt,
    response: json ?? text,
  };
}

function collectionItem(name, method, url, body) {
  return {
    name,
    request: {
      method,
      header: body ? [{ key: "Content-Type", value: "application/json" }] : [],
      url: {
        raw: `{{baseUrl}}${url}`,
        host: ["{{baseUrl}}"],
        path: url.split("/").filter(Boolean),
      },
      ...(body ? { body: { mode: "raw", raw: JSON.stringify(body, null, 2) } } : {}),
    },
  };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const unique = Date.now();
  const authorBody = {
    name: "Laura Esquivel",
    email: `laura.esquivel.${unique}@example.com`,
    nationality: "México",
    birthYear: 1950,
    bio: "Autora mexicana reconocida por narrativa con elementos culinarios y familiares.",
  };

  const results = [];

  results.push(await request("GET Todos los autores", "GET", "/api/authors"));

  const createdAuthor = await request("POST Crear autor", "POST", "/api/authors", authorBody);
  results.push(createdAuthor);
  const authorId = createdAuthor.response.id;

  results.push(await request("GET Autor por ID", "GET", `/api/authors/${authorId}`));
  results.push(await request("GET Libros de un autor", "GET", `/api/authors/${authorId}/books`));
  results.push(
    await request("PUT Actualizar autor", "PUT", `/api/authors/${authorId}`, {
      ...authorBody,
      bio: "Autora de Como agua para chocolate.",
    }),
  );

  results.push(await request("GET Todos los libros", "GET", "/api/books"));
  results.push(await request("GET Libros filtrados por género", "GET", "/api/books?genre=Novela"));

  const bookBody = {
    title: "Como agua para chocolate",
    description: "Novela mexicana que mezcla cocina, familia y realismo mágico.",
    isbn: `978-seed-${unique}`,
    publishedYear: 1989,
    genre: "Novela",
    pages: 256,
    authorId,
  };

  const createdBook = await request("POST Crear libro", "POST", "/api/books", bookBody);
  results.push(createdBook);
  const bookId = createdBook.response.id;

  results.push(await request("GET Libro por ID", "GET", `/api/books/${bookId}`));
  results.push(
    await request(
      "GET Búsqueda avanzada",
      "GET",
      "/api/books/search?search=amor&genre=Novela&page=1&limit=10&sortBy=publishedYear&order=desc",
    ),
  );
  results.push(await request("GET Estadísticas de autor", "GET", `/api/authors/${authorId}/stats`));
  results.push(await request("DELETE Eliminar libro", "DELETE", `/api/books/${bookId}`));

  const collection = {
    info: {
      name: "GLAB S12 Biblioteca - API Routes",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    variable: [{ key: "baseUrl", value: baseUrl }],
    item: [
      collectionItem("GET Todos los autores", "GET", "/api/authors"),
      collectionItem("POST Crear autor", "POST", "/api/authors", authorBody),
      collectionItem("GET Autor por ID", "GET", "/api/authors/{{authorId}}"),
      collectionItem("GET Libros de un autor", "GET", "/api/authors/{{authorId}}/books"),
      collectionItem("PUT Actualizar autor", "PUT", "/api/authors/{{authorId}}", {
        ...authorBody,
        bio: "Autor actualizado desde Postman.",
      }),
      collectionItem("GET Todos los libros", "GET", "/api/books"),
      collectionItem("GET Libros filtrados por género", "GET", "/api/books?genre=Novela"),
      collectionItem("POST Crear libro", "POST", "/api/books", bookBody),
      collectionItem("GET Libro por ID", "GET", "/api/books/{{bookId}}"),
      collectionItem(
        "GET Búsqueda avanzada",
        "GET",
        "/api/books/search?search=amor&genre=Novela&page=1&limit=10&sortBy=publishedYear&order=desc",
      ),
      collectionItem("GET Estadísticas de autor", "GET", "/api/authors/{{authorId}}/stats"),
      collectionItem("DELETE Eliminar libro", "DELETE", "/api/books/{{bookId}}"),
    ],
  };

  const reportLines = [
    "# Resultados de pruebas API - GLAB S12",
    "",
    `Base URL: ${baseUrl}`,
    `Fecha: ${new Date().toISOString()}`,
    "",
    "| Prueba | Método | Ruta | Estado | Tiempo | Resultado |",
    "|---|---:|---|---:|---:|---|",
    ...results.map((result) => (
      `| ${result.name} | ${result.method} | \`${result.url}\` | ${result.status} | ${result.durationMs} ms | ${result.ok ? "OK" : "ERROR"} |`
    )),
    "",
    "## IDs usados durante la prueba",
    "",
    `- authorId: \`${authorId}\``,
    `- bookId temporal eliminado: \`${bookId}\``,
    "",
    "## Nota",
    "",
    "La prueba DELETE elimina el libro temporal creado durante esta corrida. Los datos seed principales se conservan.",
  ];

  fs.writeFileSync(
    path.join(outDir, "GLAB-S12-postman-collection.json"),
    JSON.stringify(collection, null, 2),
    "utf8",
  );
  fs.writeFileSync(path.join(outDir, "GLAB-S12-api-test-results.md"), reportLines.join("\n"), "utf8");
  fs.writeFileSync(path.join(outDir, "GLAB-S12-api-test-results.json"), JSON.stringify(results, null, 2), "utf8");

  console.table(results.map(({ name, method, url, status, ok, durationMs }) => ({ name, method, url, status, ok, durationMs })));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
