"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Author = {
  id: string;
  name: string;
  email?: string | null;
  nationality?: string | null;
  birthYear?: number | null;
  bio?: string | null;
  _count?: { books: number };
};

export default function HomePage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState({ name: "", email: "", nationality: "", birthYear: "", bio: "" });
  const [loading, setLoading] = useState(false);

  async function loadAuthors() {
    setLoading(true);
    const res = await fetch("/api/authors");
    setAuthors(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  async function createAuthor(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", nationality: "", birthYear: "", bio: "" });
    loadAuthors();
  }

  async function removeAuthor(id: string) {
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    loadAuthors();
  }

  return (
    <main className="page-shell">
      <header className="hero-panel mb-6">
        <div className="topbar">
          <div>
            <p className="eyebrow">Sistema de biblioteca</p>
            <h1 className="page-title">Panel de autores</h1>
            <p className="page-copy">
              Administra autores, revisa su cantidad de libros y navega al detalle de cada registro.
            </p>
          </div>
          <Link className="action-link" href="/books">Gestionar libros</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="pill">{authors.length} autores</span>
          <span className="pill accent-pill">
            {authors.reduce((sum, author) => sum + (author._count?.books ?? 0), 0)} libros registrados
          </span>
        </div>
      </header>

      <form onSubmit={createAuthor} className="surface mb-8 grid gap-3 p-5 md:grid-cols-2">
        <div>
          <p className="section-title">Nuevo autor</p>
        </div>
        <div className="hidden md:block" />
        <input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Nacionalidad" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        <input placeholder="Anio de nacimiento" type="number" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} />
        <textarea className="md:col-span-2" placeholder="Biografia" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button className="md:col-span-2">Crear autor</button>
      </form>

      {loading ? (
        <section className="surface grid gap-3 p-5">
          <div className="loading-line" />
          <div className="loading-line" />
          <div className="loading-line" />
        </section>
      ) : (
        <section className="resource-grid two">
          {authors.map((author) => (
            <article key={author.id} className="resource-card">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="pill">{author._count?.books ?? 0} libros</span>
                <span className="muted text-sm">{author.nationality || "Sin nacionalidad"}</span>
              </div>
              <h2 className="text-xl font-bold">{author.name}</h2>
              <p className="muted mt-2 min-h-12">{author.bio || "Sin biografia"}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link className="action-link" href={`/authors/${author.id}`}>Ver detalle</Link>
                <button onClick={() => removeAuthor(author.id)} className="danger-button">Eliminar</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
