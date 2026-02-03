# Folplex Vector

Generator plików wektorowych SVG i PDF dla frezarek CNC.

**Repozytorium:** [github.com/monsterkil/folplex-vector](https://github.com/monsterkil/folplex-vector)

![Folplex Vector](https://img.shields.io/badge/CNC-Vector%20Generator-22c55e)

## Funkcje

- ✅ Tworzenie prostokątów i kwadratów
- ✅ Zaokrąglanie rogów (promień w cm)
- ✅ Podgląd na żywo z siatką
- ✅ Eksport do SVG (skala 1:1)
- ✅ Eksport do PDF (format A4)
- ✅ Zapisywanie i wczytywanie projektów
- ✅ Współdzielone projekty dla zespołu

## Technologie

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Baza danych:** PostgreSQL + Prisma ORM
- **Eksport:** jsPDF

## Instalacja lokalna

```bash
# Klonuj repozytorium
git clone <repo-url>
cd folplex-vector

# Zainstaluj zależności
npm install

# Skonfiguruj bazę danych
cp .env.example .env
# Edytuj .env i dodaj DATABASE_URL

# Wygeneruj klienta Prisma
npx prisma generate

# Utwórz tabele w bazie
npx prisma db push

# Uruchom serwer deweloperski
npm run dev
```

## Deployment na Vercel

**Opcja A – przez Vercel Dashboard (najprostsza):**

1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się.
2. **Add New** → **Project** → **Import Git Repository**.
3. Wybierz **monsterkil/folplex-vector** (lub podłącz swoje konto GitHub i wybierz to repo).
4. W **Environment Variables** dodaj `DATABASE_URL` (PostgreSQL – np. Vercel Postgres, Supabase, Neon).
5. Kliknij **Deploy**. Vercel zbuduje i wdroży projekt.
6. Po wdrożeniu: w projekcie Vercel → **Storage** utwórz bazę Postgres (jeśli jej nie masz), skopiuj `DATABASE_URL` do zmiennych, następnie w **Settings** → **Functions** możesz uruchomić ponowny deploy, żeby migracje Prisma się wykonały (lub uruchom lokalnie `npx prisma db push` z tym samym `DATABASE_URL`).

**Opcja B – przez Vercel CLI:**

### 1. Przygotuj bazę danych

Zalecamy użycie [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres):

1. Przejdź do dashboardu Vercel
2. Storage → Create Database → Postgres
3. Skopiuj `DATABASE_URL`

Alternatywnie możesz użyć:
- [Supabase](https://supabase.com) (darmowy tier)
- [Neon](https://neon.tech) (darmowy tier)
- [Railway](https://railway.app)

### 2. Deploy

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Zaloguj się
vercel login

# Deploy
vercel

# Dodaj zmienną środowiskową
vercel env add DATABASE_URL

# Deploy produkcyjny
vercel --prod
```

### 3. Migracja bazy

Po pierwszym deploymencie uruchom migrację:

```bash
npx prisma db push
```

Lub przez Vercel dashboard → Functions → uruchom endpoint testowy.

## Użycie

1. **Wprowadź wymiary** - szerokość i wysokość w centymetrach
2. **Ustaw zaokrąglenie** - opcjonalny promień rogów
3. **Podgląd** - sprawdź kształt na żywo
4. **Eksport** - pobierz SVG lub PDF
5. **Zapisz** - zachowaj projekt do późniejszej edycji

## Format plików

### SVG

```xml
<svg width="200mm" height="150mm" viewBox="0 0 20 15">
  <path d="..." fill="none" stroke="#000" stroke-width="0.1"/>
</svg>
```

- Jednostki: milimetry (1cm = 10mm)
- ViewBox: centymetry
- Tylko obrys (stroke), bez wypełnienia

### PDF

- Format: A4 (210×297mm)
- Orientacja: automatyczna (pionowa/pozioma)
- Skala: 1:1 jeśli mieści się na stronie
- Wymiary i informacje techniczne

## Przyszły rozwój

- [ ] Tryb rysowania interaktywnego
- [ ] Więcej kształtów (koło, elipsa, wielokąt)
- [ ] Dowolne ścieżki (krzywe Beziera)
- [ ] System logowania i ról
- [ ] Eksport DXF
- [ ] Import SVG

## Licencja

Wewnętrzne narzędzie Folplex.
