"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Book = { id: string; title: string; genre?: string | null; publishedYear?: number | null; pages?: number | null };
type Author = { id: string; name: string; email?: string | null; nationality?: string | null; birthYear?: number | null; bio?: string | null; books: Book[] };
type Stats = { totalBooks: number; averagePages: number; genres: string[]; firstBook: any; latestBook: any; longestBook: any; shortestBook: any };

export default function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    params.then((value) => setId(value.id));
  }, [params]);

  async function load() {
    if (!id) return;
    const [authorRes, statsRes] = await Promise.all([
      fetch(`/api/authors/${id}`),
      fetch(`/api/authors/${id}/stats`),
    ]);
    setAuthor(await authorRes.json());
    setStats(await statsRes.json());
  }

  useEffect(() => { load(); }, [id]);

  if (!author || !stats) {
    return (
      <main className="page-shell">
        <section className="surface grid gap-3 p-5">
          <div className="loading-line" />
          <div className="loading-line" />
          <div className="loading-line" />
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="hero-panel mb-6">
        <div className="topbar">
          <div>
            <p className="eyebrow">Detalle de autor</p>
            <h1 className="page-title">{author.name}</h1>
            <p className="page-copy">{author.bio || "Sin biografia"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="action-link" href="/">Autores</Link>
            <Link className="action-link" href="/books">Libros</Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="pill">{author.nationality || "Sin nacionalidad"}</span>
          <span className="pill accent-pill">{author.email || "Sin email"}</span>
        </div>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <article className="resource-card stat-card"><b>Total</b><p className="mt-2 text-3xl font-black">{stats.totalBooks}</p></article>
        <article className="resource-card stat-card"><b>Promedio paginas</b><p className="mt-2 text-3xl font-black">{stats.averagePages}</p></article>
        <article className="resource-card stat-card"><b>Primer libro</b><p className="muted mt-2">{stats.firstBook?.title || "-"}</p></article>
        <article className="resource-card stat-card"><b>Ultimo libro</b><p className="muted mt-2">{stats.latestBook?.title || "-"}</p></article>
      </section>

      <section className="surface mb-6 p-5">
        <p className="section-title">Resumen literario</p>
        <div className="flex flex-wrap gap-2">
          {stats.genres.length > 0 ? stats.genres.map((genre) => (
            <span key={genre} className="pill">{genre}</span>
          )) : <span className="muted">Sin generos registrados</span>}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="muted">Libro con mas paginas: <b className="text-[var(--ink)]">{stats.longestBook?.title || "-"}</b></p>
          <p className="muted">Libro con menos paginas: <b className="text-[var(--ink)]">{stats.shortestBook?.title || "-"}</b></p>
        </div>
      </section>

      <h2 className="mb-3 text-2xl font-bold">Libros del autor</h2>
      <section className="resource-grid two">
        {author.books.map((book) => (
          <article key={book.id} className="resource-card">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="pill">{book.genre || "Sin genero"}</span>
              <span className="pill accent-pill">{book.publishedYear || "Sin anio"}</span>
            </div>
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="muted mt-2">{book.pages || 0} paginas</p>
          </article>
        ))}
      </section>
    </main>
  );
}
