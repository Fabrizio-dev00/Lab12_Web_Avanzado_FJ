const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authors = [
  {
    name: "Gabriel García Márquez",
    email: "gabo@example.com",
    nationality: "Colombia",
    birthYear: 1927,
    bio: "Premio Nobel de Literatura 1982 y referente del realismo mágico.",
    books: [
      {
        title: "Cien años de soledad",
        description: "Novela emblemática sobre la familia Buendía y Macondo.",
        isbn: "978-0307474728",
        publishedYear: 1967,
        genre: "Novela",
        pages: 417,
      },
      {
        title: "El amor en los tiempos del cólera",
        description: "Historia de amor, memoria y espera en el Caribe.",
        isbn: "978-0307389732",
        publishedYear: 1985,
        genre: "Novela",
        pages: 368,
      },
      {
        title: "Crónica de una muerte anunciada",
        description: "Relato breve sobre un crimen anunciado por todo un pueblo.",
        isbn: "978-1400034956",
        publishedYear: 1981,
        genre: "Crónica",
        pages: 122,
      },
    ],
  },
  {
    name: "Mario Vargas Llosa",
    email: "vargasllosa@example.com",
    nationality: "Perú",
    birthYear: 1936,
    bio: "Novelista peruano y Premio Nobel de Literatura 2010.",
    books: [
      {
        title: "La ciudad y los perros",
        description: "Novela sobre disciplina, violencia y formación en un colegio militar.",
        isbn: "978-8466332500",
        publishedYear: 1963,
        genre: "Novela",
        pages: 448,
      },
      {
        title: "La casa verde",
        description: "Narración compleja situada entre Piura y la Amazonía peruana.",
        isbn: "978-8466332517",
        publishedYear: 1966,
        genre: "Novela",
        pages: 528,
      },
      {
        title: "Conversación en La Catedral",
        description: "Novela política sobre el poder, la corrupción y la vida peruana.",
        isbn: "978-8466332524",
        publishedYear: 1969,
        genre: "Novela política",
        pages: 736,
      },
    ],
  },
  {
    name: "Isabel Allende",
    email: "isabelallende@example.com",
    nationality: "Chile",
    birthYear: 1942,
    bio: "Escritora chilena reconocida por sus novelas históricas y familiares.",
    books: [
      {
        title: "La casa de los espíritus",
        description: "Saga familiar con elementos históricos y mágicos.",
        isbn: "978-0553383805",
        publishedYear: 1982,
        genre: "Novela",
        pages: 448,
      },
      {
        title: "Eva Luna",
        description: "Historia de una narradora que transforma su vida mediante relatos.",
        isbn: "978-0553280586",
        publishedYear: 1987,
        genre: "Novela",
        pages: 320,
      },
      {
        title: "Paula",
        description: "Memoria íntima escrita durante la enfermedad de su hija.",
        isbn: "978-0061564901",
        publishedYear: 1994,
        genre: "Memoria",
        pages: 432,
      },
    ],
  },
  {
    name: "Julio Cortázar",
    email: "cortazar@example.com",
    nationality: "Argentina",
    birthYear: 1914,
    bio: "Autor argentino asociado al boom latinoamericano y a la narrativa experimental.",
    books: [
      {
        title: "Rayuela",
        description: "Novela experimental que permite múltiples recorridos de lectura.",
        isbn: "978-8437604572",
        publishedYear: 1963,
        genre: "Novela experimental",
        pages: 736,
      },
      {
        title: "Final del juego",
        description: "Colección de cuentos con situaciones fantásticas y cotidianas.",
        isbn: "978-9871138394",
        publishedYear: 1956,
        genre: "Cuento",
        pages: 240,
      },
      {
        title: "Las armas secretas",
        description: "Libro de cuentos que incluye El perseguidor.",
        isbn: "978-8437601830",
        publishedYear: 1959,
        genre: "Cuento",
        pages: 224,
      },
    ],
  },
  {
    name: "Jorge Luis Borges",
    email: "borges@example.com",
    nationality: "Argentina",
    birthYear: 1899,
    bio: "Escritor argentino célebre por cuentos filosóficos, laberintos y bibliotecas.",
    books: [
      {
        title: "Ficciones",
        description: "Colección de cuentos sobre identidad, tiempo y mundos posibles.",
        isbn: "978-0802130303",
        publishedYear: 1944,
        genre: "Cuento",
        pages: 174,
      },
      {
        title: "El Aleph",
        description: "Cuentos que exploran infinito, memoria y literatura.",
        isbn: "978-0142437889",
        publishedYear: 1949,
        genre: "Cuento",
        pages: 224,
      },
    ],
  },
];

async function main() {
  for (const author of authors) {
    const savedAuthor = await prisma.author.upsert({
      where: { email: author.email },
      update: {
        name: author.name,
        nationality: author.nationality,
        birthYear: author.birthYear,
        bio: author.bio,
      },
      create: {
        name: author.name,
        email: author.email,
        nationality: author.nationality,
        birthYear: author.birthYear,
        bio: author.bio,
      },
    });

    for (const book of author.books) {
      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {
          title: book.title,
          description: book.description,
          publishedYear: book.publishedYear,
          genre: book.genre,
          pages: book.pages,
          authorId: savedAuthor.id,
        },
        create: {
          ...book,
          authorId: savedAuthor.id,
        },
      });
    }
  }

  const [authorCount, bookCount] = await Promise.all([
    prisma.author.count(),
    prisma.book.count(),
  ]);

  console.log(`Seed completado: ${authorCount} autores y ${bookCount} libros.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
