"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Author = { id: string; name: string };
type Book = { id: string; title: string; genre?: string | null; publishedYear?: number | null; pages?: number | null; author: Author };

export default function BooksPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", genre: "", authorName: "", sortBy: "createdAt", order: "desc", page: "1" });
  const [form, setForm] = useState({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });

  const query = useMemo(() => new URLSearchParams({ ...filters, limit: "10" }).toString(), [filters]);

  async function loadAuthors() {
    const res = await fetch("/api/authors");
    setAuthors(await res.json());
  }

  async function loadBooks() {
    setLoading(true);
    const res = await fetch(`/api/books/search?${query}`);
    const json = await res.json();
    setBooks(json.data);
    setPagination(json.pagination);
    setLoading(false);
  }

  useEffect(() => { loadAuthors(); }, []);
  useEffect(() => { loadBooks(); }, [query]);

  async function createBook(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });
    loadBooks();
  }

  async function removeBook(id: string) {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    loadBooks();
  }

  return (
    <main className="page-shell">
      <header className="hero-panel mb-6">
        <div className="topbar">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h1 className="page-title">Busqueda de libros</h1>
            <p className="page-copy">
              Crea libros, filtra por genero o autor, ordena resultados y revisa la paginacion del endpoint avanzado.
            </p>
          </div>
          <Link className="action-link" href="/">Volver a autores</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="pill">{pagination.total} resultados</span>
          <span className="pill accent-pill">Pagina {pagination.page} de {pagination.totalPages || 1}</span>
        </div>
      </header>

      <form onSubmit={createBook} className="surface mb-6 grid gap-3 p-5 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="section-title">Nuevo libro</p>
        </div>
        <input required placeholder="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Genero" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
        <input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
        <input type="number" placeholder="Anio" value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} />
        <input type="number" placeholder="Paginas" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
        <select required value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })}>
          <option value="">Seleccione autor</option>
          {authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
        </select>
        <textarea className="md:col-span-3" placeholder="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="md:col-span-3">Crear libro</button>
      </form>

      <section className="surface mb-6 p-5">
        <p className="section-title">Filtros y ordenamiento</p>
        <div className="toolbar five">
        <input placeholder="Buscar titulo" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: "1" })} />
        <input placeholder="Genero exacto" value={filters.genre} onChange={(e) => setFilters({ ...filters, genre: e.target.value, page: "1" })} />
        <input placeholder="Autor" value={filters.authorName} onChange={(e) => setFilters({ ...filters, authorName: e.target.value, page: "1" })} />
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="createdAt">Fecha</option>
          <option value="title">Titulo</option>
          <option value="publishedYear">Anio</option>
        </select>
        <select value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        </div>
      </section>

      {loading ? (
        <section className="surface grid gap-3 p-5">
          <div className="loading-line" />
          <div className="loading-line" />
          <div className="loading-line" />
        </section>
      ) : (
        <section className="resource-grid two">
          {books.map((book) => (
            <article key={book.id} className="resource-card">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="pill">{book.genre || "Sin genero"}</span>
                <span className="pill accent-pill">{book.publishedYear || "Sin anio"}</span>
              </div>
              <h2 className="text-xl font-bold">{book.title}</h2>
              <p className="muted mt-2">{book.author.name}</p>
              <p className="muted mt-1 text-sm">{book.pages || 0} paginas</p>
              <button onClick={() => removeBook(book.id)} className="danger-button mt-4">Eliminar</button>
            </article>
          ))}
        </section>
      )}

      <div className="surface mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
        <button disabled={!pagination.hasPrev} onClick={() => setFilters({ ...filters, page: String(Number(filters.page) - 1) })}>Anterior</button>
        <span className="muted font-semibold">Pagina {pagination.page} de {pagination.totalPages || 1}</span>
        <button disabled={!pagination.hasNext} onClick={() => setFilters({ ...filters, page: String(Number(filters.page) + 1) })}>Siguiente</button>
      </div>
    </main>
  );
}
