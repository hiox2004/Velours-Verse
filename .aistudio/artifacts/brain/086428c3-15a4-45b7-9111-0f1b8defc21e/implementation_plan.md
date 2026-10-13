# Velours & Verse — Creative Writing Tracker & Writer's Sanctuary

A mobile-first, aesthetic-rich creative writing tracker and sanctuary for poems, short stories, and prose. Designed with Gen Z aesthetics (Coquette bows, Cyber Y2K stars, Matcha Latte, and Midnight Muse), smooth offline-first sync, rich visual stat cards, Penpal community sharing, print & export tools, and an exclusive Developer God Mode & Academy accessible strictly to authorized developer accounts (e.g. `hiox2004@gmail.com`).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Revisions & Core Specifications:**
> - **Visibility Modes**: Every piece can be designated as **Draft**, **Published** (public to feed), or **Shared with Penpals** (friends only).
> - **Profiles & Penpals System**: Users have customizable profiles with unique Penpal IDs (e.g. `PEN-8A9F2`), display name, avatar, and a "Get to Know Me" section (writing ritual, favorite quote, genre). Penpals can be added and managed via Penpal IDs.
> - **Privacy Guarantee**: Regular users and penpals can only view public display names, avatars, and bios. User Gmail addresses are strictly hidden and private.
> - **Print & Aesthetic Download**: Instant printing styled with clean editorial typography (`@media print`) and aesthetic download (formatted card preview, Markdown, and TXT).
> - **Developer "God Mode" & Ethical Moderation**: Accessible exclusively to `hiox2004@gmail.com` and authorized devs. Allows reviewing all pieces including drafts for ethical moderation, inspecting the user account directory, and managing developer access.

---

### 1. Overview & Core Concept

- **What It Does**: Velours & Verse is an intimate creative writing tracker where authors write, catalog, polish, and share poems and stories. It combines rich visual cards, penpal connections, offline resilience, and an educational Developer Academy.
- **Target Audience / Persona**: Creative writers, poets, and journaling authors who value a feel-good visual ambiance, tactile mobile ergonomics, and thoughtful peer connections.
- **Key Value**: A soothing, aesthetic creative space that turns writing into a mindful ritual while offering robust draft management, peer sharing, and offline reliability.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Authentication & Profile Setup**:
   - Google Sign-In with instant local profile generation.
   - Generates a unique Penpal ID (e.g. `PEN-3M8K1`). Users customize their Display Name, Avatar, and "Get to Know Me" card (favorite writing drink, favorite poets, current project).
   - Strict privacy: Gmail is never exposed to other users; only the display name and Penpal ID are visible.
2. **Writing Log & Discovery Feed**:
   - Filter by status (**All**, **Published**, **My Drafts**, **Penpal Circle**) and literary format (**Poetry**, **Short Stories**, **Prose**, **Journal**).
   - Fast sub-millisecond search across titles, moods, and content snippets.
   - Writing Cards display: Title, author display name, date, word count, read time, star count, comment count, status badge (Draft / Published / Penpals), and custom pastel card tint.
3. **Feel-Good Editor & Ambient Studio**:
   - Rich distraction-free writer with real-time statistics (words, characters, read time).
   - Visibility switcher: Draft 🔒, Shared with Penpals 💌, or Published 🌟.
   - Card styling options: Choose from 6 aesthetic tint colors and mood tags (e.g., Ethereal, Melancholy, Nostalgic, Euphoric, Midnight Thoughts).
   - Ambient Sound Studio: Native Web Audio synthesizer offering calming Rain, Café murmur, and Lo-Fi Vinyl warmth with zero external audio assets.
4. **Print & Aesthetic Download**:
   - One-click "Print Piece": Formatted using a clean, publication-grade print stylesheet suitable for physical paper or PDF export.
   - "Download Story": Export as styled Markdown, clean plain text, or formatted reading card.
5. **Penpal Connection Hub**:
   - "Add Penpal" modal using unique Penpal IDs.
   - View connected penpals, read pieces shared exclusively with friends, and exchange encouraging comments and stars.
6. **Developer God Mode & Academy (Restricted to `hiox2004@gmail.com`)**:
   - **God Mode / Ethical Moderation**: Overview of all pieces across the platform, including drafts, with content flagging and moderation controls.
   - **User Accounts Inspector**: Displays user display names, Penpal IDs, joined dates, and activity counts.
   - **Dev Academy**: Interactive visual lessons on App Architecture, Offline State Sync, Web Audio synthesis, and Supabase/Vercel production setups.
   - **Dev Roster**: Admin tool to grant or revoke developer status for secondary email addresses.

#### Visual Identity & Theme Engine
- **4 Bespoke Aesthetics** with adaptive Light & Dark modes:
  1. **Coquette Blush** 🎀: Silk blush pinks, rose gold borders, ribbon motifs, literary serif titles.
  2. **Cyber Y2K Stars** ✧: Twilight indigo, holographic silver starlight, starburst accents, modern geometric sans.
  3. **Matcha Latte** 🌿: Calming sage and cream tones, organic leaf emblems, warm coffeehouse comfort.
  4. **Midnight Muse** 🌙: Deep obsidian velvet, ethereal lavender nebulae, celestial moon icons.
- **Tactile Ergonomics**: Mobile-first bottom navigation, $\ge 44\text{px}$ touch targets, smooth card springs, unboxed text metadata with typographic separators.

---

### 3. Key Product Decisions & Trade-Offs

- **Penpal ID System vs Public Email**: Users connect via unique 8-character Penpal IDs. This guarantees privacy and prevents email harvesting while keeping friendship sharing effortless.
- **Client-Side Print Engine**: Native browser print stylesheet (`@media print`) strips app navigation and formats the poem or story into a book-leaf page with elegant margins and author credits.
- **Developer God Mode Transparency**: God Mode draft access is explicitly documented in the built-in Privacy & Ethical Moderation section so users know drafts are only reviewable for platform safety guidelines.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                 VELOURS & VERSE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ UI Shell & Navigation ]                                      │
│  ├── Top Bar (Theme switch, Search, Profile modal)              │
│  ├── Feed Views: Discover, My Works (Drafts/Pubs), Penpals     │
│  ├── Rich Card Editor & Reading Drawer                          │
│  ├── Print & Export Sheet (@media print styled)                 │
│  ├── Penpal Hub (Connect by ID, view friend circle)            │
│  └── Dev God Mode & Academy (Gated to hiox2004@gmail.com)       │
│                                                                 │
│  [ State & Service Modules ]                                    │
│  ├── Auth & Profile Store (Google Sign-In + Penpal ID + Bio)    │
│  ├── Writing Store (Drafts, Pubs, Friends, Stars, Comments)     │
│  ├── Privacy & RBAC Engine (God Mode permissions for admin)     │
│  ├── Theme System (4 Themes × Light/Dark + Note Tint Palette)   │
│  └── Ambient Sound Synthesizer (Web Audio API)                  │
│                                                                 │
│  [ Offline & Sync Engine ]                                      │
│  ├── LocalStorage / IndexedDB Synchronized Cache               │
│  ├── Network Online/Offline Status Listeners                    │
│  └── Supabase & Vercel Migration Blueprints                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Core Data Models
- `WritingPiece`:
  - `id`: string
  - `title`: string
  - `content`: string
  - `type`: `'poem' | 'story' | 'prose' | 'journal'`
  - `status`: `'draft' | 'published' | 'penpals'`
  - `authorId`: string
  - `authorName`: string (display name only)
  - `authorPenpalId`: string
  - `authorEmail`: string (private; visible only to author and Dev God Mode)
  - `createdAt`: string
  - `updatedAt`: string
  - `stars`: number
  - `starredByMe`: boolean
  - `comments`: `Array<{ id, authorName, authorPenpalId, text, createdAt }>`
  - `moodTags`: string[]
  - `colorTheme`: string (card tint)
  - `wordCount`: number
  - `readTimeMinutes`: number
- `UserProfile`:
  - `id`: string
  - `email`: string (private)
  - `displayName`: string
  - `penpalId`: string (e.g. `PEN-8A9F2`)
  - `avatar`: string
  - `bio`: string
  - `favoriteDrink`: string
  - `favoriteQuote`: string
  - `penpalIds`: string[] (list of connected Penpal IDs)
  - `role`: `'developer' | 'writer'`
- `DevRoster`: Authorized developer emails list (seeded with `hiox2004@gmail.com`).

#### Implementation Steps
1. **Design System & Aesthetics**: Implement the 4 themes (Coquette, Y2K Stars, Matcha, Midnight), light/dark mode, and customizable card tints.
2. **Auth, Profiles & Penpal IDs**: Google Sign-In with private Gmail storage, public display name, Penpal ID generation, and "Get to Know Me" bio modal.
3. **Writing Engine & Status Filter**: Support for Drafts, Published, and Penpal-only pieces with instant search and star/comment interactions.
4. **Rich Editor & Ambiance Player**: Visual card writing environment with live word count, read time, mood tags, and Web Audio ambient background sound.
5. **Print & Export Engine**: High-fidelity `@media print` styling for clean paper/PDF printing and formatted file downloads.
6. **Penpal Circle**: Add friends via Penpal ID, view their shared works, and manage connections.
7. **Developer God Mode & Academy**: Exclusive access for `hiox2004@gmail.com` to view all drafts for moderation, inspect accounts, manage dev roster, and explore interactive app architecture guides.
