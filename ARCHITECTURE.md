# Documentation Architecture - Club Ciné Système d'Information

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture générale](#architecture-générale)
3. [Backend - Architecture en couches](#backend---architecture-en-couches)
4. [Base de données MongoDB](#base-de-données-mongodb)
5. [Authentification et autorisation JWT](#authentification-et-autorisation-jwt)
6. [Frontend React](#frontend-react)
7. [Flux de données](#flux-de-données)
8. [Composants et leurs rôles](#composants-et-leurs-rôles)

---

## Vue d'ensemble

### Caractéristiques de l'API (Backend)

L'**API REST** est développée en **.NET 8** avec ASP.NET Core. Elle suit une architecture en **couches (3-tier)** :
- **Couche Présentation** : Controllers (API REST)
- **Couche Métier** : Services (BLL - Business Logic Layer)
- **Couche Accès aux Données** : Repositories (DAL - Data Access Layer)

**Caractéristiques principales :**
- API RESTful avec endpoints standardisés (`/api/{controller}`)
- Authentification JWT (JSON Web Tokens) pour sécuriser les endpoints
- Autorisation par rôles (`user` et `admin`)
- Base de données NoSQL MongoDB (via MongoDB.Driver)
- CORS configuré pour permettre les requêtes depuis le frontend
- Swagger/OpenAPI pour la documentation interactive (en développement)
- Injection de dépendances native (.NET DI)

**Technologies utilisées :**
- ASP.NET Core 8
- MongoDB.Driver
- JWT Bearer Authentication
- BCrypt pour le hachage des mots de passe
- Swagger/OpenAPI

### Caractéristiques du Frontend

Le **frontend** est développé en **React 19** avec **Vite** comme bundler.

**Caractéristiques principales :**
- Application SPA (Single Page Application)
- Routing avec React Router DOM v7
- Appels API via Axios
- Gestion d'état locale avec React Hooks (useState, useEffect)
- Stockage du token JWT dans `localStorage`
- Interface responsive avec Bootstrap 5
- Composants réutilisables modulaires

**Technologies utilisées :**
- React 19.1.1
- React Router DOM 7.9.5
- Axios 1.13.1
- Bootstrap 5.3.8
- React Calendar 6.0.0
- Vite (rolldown-vite 7.1.14)

### Caractéristiques du Backend

Le backend suit une **architecture en couches séparées** :

```
┌─────────────────────────────────────────┐
│         API (Controllers)                │  ← Couche Présentation
│  UserController, FilmController, etc.   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      BLL (Business Logic Layer)         │  ← Couche Métier
│  UserService, FilmService, etc.         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      DAL (Data Access Layer)            │  ← Couche Accès Données
│  UserRepository, FilmRepository, etc.  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      MongoDB Atlas (Cloud)              │  ← Base de données
│  Collections: User, Film, Seance, etc.  │
└─────────────────────────────────────────┘
```

---

## Architecture générale

### Schéma d'architecture complet

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Pages   │  │Components│  │   API    │  │  Router  │       │
│  │          │  │          │  │  Calls   │  │          │       │
│  │ Dashboard│  │ Sidebar  │  │ authApi  │  │  Routes  │       │
│  │  Login   │  │  Cards   │  │filmAPI   │  │          │       │
│  │  Admin   │  │  Panel   │  │seanceAPI │  │          │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │              │             │              │
│       └─────────────┴──────────────┴─────────────┘              │
│                          │                                       │
│                          │ HTTP/HTTPS (REST API)                 │
│                          │ Headers: Authorization: Bearer {JWT}  │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    BACKEND (.NET 8 API)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              COUCHE PRÉSENTATION (API)                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │UserController│  │FilmController│  │SeanceController│ │  │
│  │  │VoteController│  │SortieCineCtrl│  │InscriptionCtrl│ │  │
│  │  │AdminStatsCtrl│  │              │  │              │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │         │ [Authorize]      │ [Authorize]     │          │  │
│  │         │ [Roles="admin"]  │                 │          │  │
│  └─────────┼──────────────────┼──────────────────┼──────────┘  │
│            │                  │                  │              │
│  ┌─────────▼──────────────────▼──────────────────▼──────────┐  │
│  │         COUCHE MÉTIER (BLL - Business Logic)            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │UserService│ │FilmService│ │SeanceService│VoteService│ │  │
│  │  │          │  │          │  │            │          │ │  │
│  │  │• Register│ │• AddFilm │ │• Create    │• AddVote │ │  │
│  │  │• Login   │ │• Update  │ │• Update    │• GetStats│ │  │
│  │  │• Generate│ │• Delete  │ │• GetProchaine│         │ │  │
│  │  │  JWT     │ │• Validate│ │• Validate  │          │ │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬──────┘ └────┬─────┘ │  │
│  └───────┼─────────────┼─────────────┼─────────────┼───────┘  │
│          │             │             │             │           │
│  ┌───────▼─────────────▼─────────────▼─────────────▼───────┐  │
│  │      COUCHE ACCÈS DONNÉES (DAL - Repositories)         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │UserRepo  │  │FilmRepo  │  │SeanceRepo│  │VoteRepo │ │  │
│  │  │          │  │          │  │          │  │         │ │  │
│  │  │• GetByEmail│• GetAll  │ │• GetAll  │ │• AddVote │ │  │
│  │  │• AddUser │ │• GetById │ │• Insert  │ │• HasVoted│ │  │
│  │  │• GetAll  │ │• Insert  │ │• Update  │ │• GetStats│ │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │  │
│  └───────┼─────────────┼─────────────┼─────────────┼───────┘  │
│          │             │             │             │           │
│  ┌───────▼─────────────▼─────────────▼─────────────▼───────┐  │
│  │              MongoDbContext (Connexion)                 │  │
│  │  • Configure MongoDB Connection                         │  │
│  │  • Expose IMongoCollection<T> pour chaque entité       │  │
│  └───────────────────────┬─────────────────────────────────┘  │
└──────────────────────────┼────────────────────────────────────┘
                           │
                           │ MongoDB Driver
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Database)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  User    │  │  Film    │  │  Seance │  │  Vote    │        │
│  │  Collection│ Collection│ Collection│ Collection│        │
│  │          │  │          │  │          │  │          │        │
│  │• Email   │  │• Titre   │  │• Date   │  │• UserId  │        │
│  │• Role    │  │• Genre   │  │• Lieu   │  │• SeanceId│        │
│  │• Password│  │• Rating  │  │• FilmIds│  │• FilmId  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐                                   │
│  │SortieCine│  │Inscription│                                   │
│  │Collection│  │Collection │                                   │
│  └──────────┘  └──────────┘                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## Backend - Architecture en couches

### 1. Couche DTO (Data Transfer Objects)

**Rôle :** Les DTOs sont des objets de transfert de données qui représentent les entités métier. Ils servent de contrat entre les différentes couches et la base de données MongoDB.

**Localisation :** `ClubCine.DTO/`

**DTOs disponibles :**

#### UserDto
```csharp
- Id (ObjectId MongoDB)
- Nom, Prenom
- Email (unique)
- Classe
- Role ("user" ou "admin")
- PasswordHash (haché avec BCrypt)
```

#### FilmDto
```csharp
- Id (ObjectId MongoDB)
- Titre (obligatoire, unique)
- Description
- ImageUrl
- Year (1900-2100)
- Genre
- Rating (0-10)
```

#### SeanceDto
```csharp
- Id (ObjectId MongoDB)
- Date (DateTime - date et heure)
- Lieu (nom/salle)
- FilmIds (List<string> - IDs des films proposés)
- SelectedFilmId (ID du film gagnant après vote)
- Statut ("vote", "inscription", "terminée")
- HelloAssoUrl (lien optionnel pour paiement)
```

#### SortieCineDto
```csharp
- Id (ObjectId MongoDB)
- Date (DateTime)
- Prix
- Emplacement
- FilmId (ID du film projeté)
- HelloAssoUrl (lien optionnel)
```

#### VoteDto
```csharp
- Id (ObjectId MongoDB)
- UserId (qui vote)
- SeanceId (sur quelle séance)
- FilmId (pour quel film)
```

#### InscriptionDto
```csharp
- Id (ObjectId MongoDB)
- UserId
- SeanceId
- SortieCineId
- DateInscription
```

**Fonction :** Les DTOs sont sérialisés/désérialisés automatiquement par MongoDB.Driver grâce aux attributs `[BsonId]` et `[BsonRepresentation(BsonType.ObjectId)]`.

---

### 2. Couche DAL (Data Access Layer)

**Rôle :** La couche DAL encapsule toute la logique d'accès à la base de données MongoDB. Elle utilise le pattern Repository pour isoler la logique métier de la persistance.

**Localisation :** `ClubCine.DAL/`

#### MongoDbSettings
**Fichier :** `MongoDbSettings.cs`

**Rôle :** Classe de configuration qui stocke les paramètres de connexion MongoDB :
- `ConnectionString` : Chaîne de connexion MongoDB Atlas
- `DatabaseName` : Nom de la base de données ("ClubCine")

**Configuration :** Chargée depuis `appsettings.json` via `builder.Configuration.GetSection("MongoDbSettings")`.

#### MongoDbContext
**Fichier :** `MongoDbContext.cs`

**Rôle :** Classe centrale qui établit la connexion à MongoDB et expose les collections typées pour chaque entité.

**Fonctionnement :**
```csharp
public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    
    // Initialise la connexion MongoDB
    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }
    
    // Expose les collections comme propriétés typées
    public IMongoCollection<FilmDto> Films => _database.GetCollection<FilmDto>("Film");
    public IMongoCollection<SeanceDto> Seances => _database.GetCollection<SeanceDto>("Seance");
    // ... autres collections
}
```

**Collections exposées :**
- `Films` → Collection "Film"
- `Seances` → Collection "Seance"
- `SortiesCine` → Collection "SortiesCine"
- `Votes` → Collection "Vote"
- `Inscriptions` → Collection "Inscription"
- `Users` → Collection "User"

#### Repositories

Chaque Repository encapsule les opérations CRUD pour une entité spécifique.

**Pattern commun :**
```csharp
public class XxxRepository
{
    private readonly IMongoCollection<XxxDto> _collection;
    
    public XxxRepository(MongoDbContext context)
    {
        _collection = context.Xxx; // Injection de la collection
    }
    
    // Méthodes CRUD standard
    public async Task<List<XxxDto>> GetAllAsync() => ...
    public async Task<XxxDto> GetByIdAsync(string id) => ...
    public async Task AddAsync(XxxDto item) => ...
    public async Task UpdateAsync(string id, XxxDto item) => ...
    public async Task DeleteAsync(string id) => ...
}
```

**Repositories disponibles :**

1. **UserRepository**
   - `GetByEmailAsync(email)` : Récupère un utilisateur par email
   - `GetUserByIdAsync(id)` : Récupère un utilisateur par ID
   - `GetAllAsync()` : Liste tous les utilisateurs
   - `AddUserAsync(user)` : Ajoute un nouvel utilisateur

2. **FilmRepository**
   - `GetAllAsync()` : Liste tous les films
   - `GetByIdAsync(id)` : Récupère un film par ID
   - `AddAsync(film)` : Ajoute un film
   - `UpdateAsync(id, film)` : Met à jour un film
   - `DeleteAsync(id)` : Supprime un film

3. **SeanceRepository**
   - Opérations CRUD pour les séances
   - Recherche de séances par date, statut, etc.

4. **SortieCineRepository**
   - Opérations CRUD pour les sorties cinéma

5. **VoteRepository**
   - `AddVote(vote)` : Enregistre un vote
   - `HasUserVoted(userId, seanceId)` : Vérifie si un utilisateur a déjà voté
   - `GetStats(seanceId)` : Calcule les statistiques de vote par film

6. **InscriptionRepository**
   - Gestion des inscriptions aux séances et sorties

**Avantages de cette architecture :**
- Séparation claire des responsabilités
- Testabilité (mock facile des repositories)
- Réutilisabilité (même repository utilisé par plusieurs services)
- Abstraction de MongoDB (changement de BDD plus facile)

---

### 3. Couche BLL (Business Logic Layer)

**Rôle :** La couche BLL contient la logique métier de l'application. Elle orchestre les opérations entre les repositories et applique les règles de gestion.

**Localisation :** `ClubCine.BLL/`

**Services disponibles :**

#### UserService
**Fichier :** `UserService.cs`

**Responsabilités :**
- Gestion de l'inscription des utilisateurs
- Validation des identifiants (login)
- Génération des tokens JWT
- Vérification des rôles (admin/user)
- Hachage des mots de passe avec BCrypt

**Méthodes principales :**
```csharp
- RegisterUser(user) : Inscription avec hachage du mot de passe
- GetUserByEmail(email) : Récupération d'un utilisateur
- CheckUserLogin(email, password) : Vérification identifiants user
- CheckAdminLogin(email, password) : Vérification identifiants admin
- GenerateJwt(user) : Génération du token JWT avec claims (email, role)
- GetAll() : Liste tous les utilisateurs
```

**Logique métier :**
- Vérifie l'unicité de l'email avant inscription
- Force le rôle "user" pour les nouveaux utilisateurs
- Hache les mots de passe avec BCrypt avant stockage
- Génère des tokens JWT valides 3 heures avec claims (email, role)

#### FilmService
**Fichier :** `FilmService.cs`

**Responsabilités :**
- Gestion CRUD des films
- Validation de l'unicité des titres

**Méthodes principales :**
```csharp
- GetAllFilms() : Liste tous les films
- GetFilmById(id) : Récupère un film
- AddFilm(film) : Ajoute un film (vérifie l'unicité du titre)
- UpdateFilm(id, film) : Met à jour un film
- DeleteFilm(id) : Supprime un film
```

**Règles métier :**
- Un film avec le même titre (insensible à la casse) ne peut pas être ajouté deux fois

#### SeanceService
**Fichier :** `SeanceService.cs`

**Responsabilités :**
- Gestion des séances
- Validation des dates et des films associés
- Recherche de la prochaine séance

**Méthodes principales :**
```csharp
- GetAll() : Liste toutes les séances
- GetById(id) : Récupère une séance
- InsertAsync(seance) : Crée une séance (vérifie la date unique)
- UpdateAsync(id, seance) : Met à jour une séance
- Delete(id) : Supprime une séance
- GetProchaine() : Retourne la prochaine séance à venir
```

**Règles métier :**
- Une séance ne peut pas avoir la même date qu'une autre
- Les FilmIds doivent référencer des films existants

#### VoteService
**Fichier :** `VoteService.cs`

**Responsabilités :**
- Gestion des votes des utilisateurs
- Calcul des statistiques de vote
- Prévention des votes multiples

**Méthodes principales :**
```csharp
- AddVote(vote) : Enregistre un vote (vérifie qu'il n'a pas déjà voté)
- HasUserVoted(userId, seanceId) : Vérifie si un utilisateur a voté
- GetStats(seanceId) : Calcule les pourcentages de vote par film
```

**Règles métier :**
- Un utilisateur ne peut voter qu'une seule fois par séance
- Les statistiques sont calculées en pourcentage de votes par film

#### SortieCineService
**Fichier :** `SortieCineService.cs`

**Responsabilités :**
- Gestion des sorties cinéma
- Validation des données

#### InscriptionService
**Fichier :** `InscriptionService.cs`

**Responsabilités :**
- Gestion des inscriptions aux séances et sorties
- Validation des inscriptions

**Avantages de cette architecture :**
- Logique métier centralisée et réutilisable
- Contrôleurs légers (délèguent aux services)
- Testabilité (mock des repositories)
- Évolutivité (ajout de règles métier sans toucher aux repositories)

---

### 4. Couche API (Controllers)

**Rôle :** Les Controllers exposent les endpoints REST de l'API. Ils reçoivent les requêtes HTTP, valident les données, appellent les services appropriés et retournent les réponses.

**Localisation :** `ClubCineAPI/Controllers/`

**Configuration dans Program.cs :**
```csharp
builder.Services.AddControllers();
app.MapControllers(); // Active le routing automatique
```

**Pattern de routing :**
- Tous les controllers suivent le pattern `/api/[controller]`
- Exemple : `FilmController` → `/api/film`

**Controllers disponibles :**

#### UserController
**Route :** `/api/user`

**Endpoints :**
- `POST /api/user/register` : Inscription d'un nouvel utilisateur (public)
- `POST /api/user/login` : Connexion et génération du token JWT (public)
- `GET /api/user/{email}` : Récupération d'un utilisateur par email
- `POST /api/user/adminlogin` : Connexion admin (caché dans Swagger)

**Réponse login :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "prenom": "...",
    "nom": "...",
    "email": "...",
    "role": "user",
    "classe": "..."
  }
}
```

#### FilmController
**Route :** `/api/film`

**Endpoints :**
- `GET /api/film` : Liste tous les films (public)
- `GET /api/film/{id}` : Détail d'un film (public)
- `POST /api/film` : Ajoute un film (**[Authorize(Roles = "admin")]**)
- `PUT /api/film/{id}` : Modifie un film (**[Authorize(Roles = "admin")]**)
- `DELETE /api/film/{id}` : Supprime un film (**[Authorize(Roles = "admin")]**)

#### SeanceController
**Route :** `/api/seance`

**Endpoints :**
- `GET /api/seance/all` : Liste toutes les séances
- `GET /api/seance/{id}` : Détail d'une séance (**[Authorize]**)
- `GET /api/seance/prochaine` : Prochaine séance à venir (public)
- `POST /api/seance` : Crée une séance (**[Authorize(Roles = "admin")]**)
- `PUT /api/seance/{id}` : Met à jour une séance (**[Authorize(Roles = "admin")]**)
- `DELETE /api/seance/{id}` : Supprime une séance (**[Authorize(Roles = "admin")]**)

#### VoteController
**Route :** `/api/vote`

**Endpoints :**
- `POST /api/vote/vote` : Enregistre un vote
- `GET /api/vote/has-voted?userId=...&seanceId=...` : Vérifie si un utilisateur a voté
- `GET /api/vote/stats?seanceId=...` : Statistiques de vote pour une séance

#### SortieCineController
**Route :** `/api/sortiecine`

**Endpoints :**
- CRUD complet pour les sorties cinéma
- Certains endpoints nécessitent l'autorisation admin

#### InscriptionController
**Route :** `/api/inscription`

**Endpoints :**
- Gestion des inscriptions aux séances et sorties

#### AdminStatsController
**Route :** `/api/adminstats`

**Endpoints :**
- Statistiques administratives (réservé aux admins)

**Attributs de sécurité :**
- `[Authorize]` : Nécessite un token JWT valide
- `[Authorize(Roles = "admin")]` : Nécessite un token JWT avec le rôle "admin"

---

## Base de données MongoDB

### Structure de la base de données

**Nom de la base :** `ClubCine`

**Collections :**

### 1. Collection "User"

**Rôle :** Stocke les informations des utilisateurs (membres et administrateurs).

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "Nom": "Dupont",
  "Prenom": "Jean",
  "Email": "jean.dupont@example.com",
  "Classe": "Terminale A",
  "Role": "user" | "admin",
  "PasswordHash": "$2a$11$..." // Hash BCrypt
}
```

**Index :** Email devrait être unique (géré au niveau application).

**Fonctions :**
- Authentification (login)
- Autorisation (vérification du rôle)
- Gestion des membres

### 2. Collection "Film"

**Rôle :** Catalogue des films disponibles pour les séances.

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "Titre": "Inception",
  "Description": "Un voleur entre dans les rêves...",
  "ImageUrl": "https://...",
  "Year": 2010,
  "Genre": "Science-Fiction",
  "Rating": 8.8
}
```

**Fonctions :**
- Référence pour les séances (FilmIds)
- Affichage dans le catalogue
- Statistiques de vote

### 3. Collection "Seance"

**Rôle :** Gère les séances de projection organisées par le club.

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "Date": ISODate("2026-01-15T20:00:00Z"),
  "Lieu": "Salle A",
  "FilmIds": [ObjectId("..."), ObjectId("...")], // Films proposés
  "SelectedFilmId": ObjectId("..."), // Film gagnant (après vote)
  "Statut": "vote" | "inscription" | "terminée",
  "HelloAssoUrl": "https://..."
}
```

**Fonctions :**
- Organisation des projections
- Gestion du cycle de vie (vote → inscription → terminée)
- Association avec les films proposés

### 4. Collection "Vote"

**Rôle :** Enregistre les votes des utilisateurs pour choisir le film d'une séance.

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "UserId": ObjectId("..."),
  "SeanceId": ObjectId("..."),
  "FilmId": ObjectId("...")
}
```

**Contraintes :**
- Un utilisateur ne peut voter qu'une fois par séance (géré au niveau application)

**Fonctions :**
- Démocratie participative (choix du film)
- Calcul des statistiques de vote

### 5. Collection "SortiesCine"

**Rôle :** Gère les sorties cinéma organisées (projections en salle de cinéma).

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "Date": ISODate("2026-01-20T19:00:00Z"),
  "Prix": 8.50,
  "Emplacement": "Cinéma Pathé",
  "FilmId": ObjectId("..."),
  "HelloAssoUrl": "https://..."
}
```

**Fonctions :**
- Organisation des sorties externes
- Gestion des inscriptions et paiements (via HelloAsso)

### 6. Collection "Inscription"

**Rôle :** Enregistre les inscriptions des utilisateurs aux séances et sorties.

**Schéma :**
```json
{
  "_id": ObjectId("..."),
  "UserId": ObjectId("..."),
  "SeanceId": ObjectId("..."), // Optionnel
  "SortieCineId": ObjectId("..."), // Optionnel
  "DateInscription": ISODate("2026-01-10T10:00:00Z")
}
```

**Fonctions :**
- Suivi des participants
- Gestion des places disponibles
- Historique des inscriptions

### Relations entre collections

```
User ──┐
       ├──> Vote (UserId)
       └──> Inscription (UserId)

Film ──┐
       ├──> Seance (FilmIds[])
       ├──> Seance (SelectedFilmId)
       └──> SortieCine (FilmId)

Seance ──┐
         ├──> Vote (SeanceId)
         └──> Inscription (SeanceId)

SortieCine ──> Inscription (SortieCineId)
```

---

## Authentification et autorisation JWT

### Vue d'ensemble

L'application utilise **JWT (JSON Web Tokens)** pour l'authentification et l'autorisation. Le système distingue deux rôles :
- **`user`** : Utilisateur standard (membre du club)
- **`admin`** : Administrateur (gestion complète)

### Flux d'authentification

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ MongoDB  │
│ (Front)  │                    │          │                    │          │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ 1. POST /api/user/login       │                               │
     │    {email, password}           │                               │
     ├───────────────────────────────>│                               │
     │                               │                               │
     │                               │ 2. UserService.GetUserByEmail│
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ 3. UserDto (avec PasswordHash)│
     │                               │<──────────────────────────────┤
     │                               │                               │
     │                               │ 4. BCrypt.Verify(password)    │
     │                               │    Si OK → GenerateJwt()     │
     │                               │                               │
     │                               │ 5. Token JWT généré           │
     │                               │    Claims: email, role         │
     │                               │    Expiration: +3h            │
     │                               │                               │
     │ 6. Response {token, user}      │                               │
     │<───────────────────────────────┤                               │
     │                               │                               │
     │ 7. Stockage token dans        │                               │
     │    localStorage                │                               │
     │    Key: "clubcine_token"       │                               │
     │                               │                               │
     │ 8. Requêtes suivantes          │                               │
     │    Header: Authorization:     │                               │
     │    Bearer {token}              │                               │
     ├───────────────────────────────>│                               │
     │                               │                               │
     │                               │ 9. Validation JWT             │
     │                               │    • Signature valide ?        │
     │                               │    • Expiration OK ?           │
     │                               │    • Claims extraits           │
     │                               │                               │
     │                               │ 10. [Authorize(Roles="admin")] │
     │                               │     Vérifie role dans claims   │
     │                               │                               │
     │ 11. Response (si autorisé)    │                               │
     │<───────────────────────────────┤                               │
```

### Détails techniques

#### 1. Configuration JWT (Program.cs)

```csharp
// Clé secrète depuis appsettings.json
var jwtKey = builder.Configuration["JwtSettings:Key"];

// Configuration de l'authentification JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,           // Pas de vérification de l'émetteur
        ValidateAudience = false,          // Pas de vérification de l'audience
        ValidateLifetime = true,           // Vérifie l'expiration
        ValidateIssuerSigningKey = true,  // Vérifie la signature
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});
```

**Ordre des middlewares (CRUCIAL) :**
```csharp
app.UseAuthentication();  // AVANT UseAuthorization
app.UseAuthorization();
```

#### 2. Génération du token (UserService.GenerateJwt)

```csharp
public string GenerateJwt(UserDto user)
{
    // Clé de signature (HMAC-SHA256)
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
    
    // Claims (données dans le token)
    var claims = new[]
    {
        new Claim("email", user.Email),
        new Claim("role", user.Role)  // "user" ou "admin"
    };
    
    // Création du token
    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddHours(3),  // Expiration 3h
        signingCredentials: credentials
    );
    
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

**Structure du token JWT :**
```
Header.Payload.Signature

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"email": "...", "role": "user", "exp": 1234567890}
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

#### 3. Hachage des mots de passe (BCrypt)

**Lors de l'inscription :**
```csharp
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
```

**Lors de la connexion :**
```csharp
BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash)
```

**Avantages de BCrypt :**
- Hachage unidirectionnel (impossible de retrouver le mot de passe)
- Salt automatique (chaque hash est unique)
- Résistant aux attaques par force brute

#### 4. Protection des endpoints

**Endpoint public (pas d'authentification) :**
```csharp
[HttpGet]
public async Task<IActionResult> GetAll()
    => Ok(await _service.GetAllFilms());
```

**Endpoint protégé (authentification requise) :**
```csharp
[Authorize]
[HttpGet("{id}")]
public async Task<IActionResult> GetById(string id)
{
    // Seuls les utilisateurs avec un token valide peuvent accéder
}
```

**Endpoint admin uniquement :**
```csharp
[Authorize(Roles = "admin")]
[HttpPost]
public async Task<IActionResult> Add([FromBody] FilmDto film)
{
    // Seuls les admins peuvent accéder
}
```

#### 5. Utilisation côté frontend

**Stockage du token :**
```javascript
// Après login réussi
localStorage.setItem("clubcine_token", token);
```

**Envoi du token dans les requêtes :**
```javascript
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("clubcine_token") || ""}`
  }
});

// Utilisation
const res = await axios.get(API_URL, getAuthHeaders());
```

**Vérification de l'authentification :**
```javascript
const token = localStorage.getItem("clubcine_token");
if (!token) {
  // Rediriger vers /login
}
```

### Rôles et permissions

| Action | User | Admin |
|--------|------|-------|
| Voir les films | ✅ | ✅ |
| Voir les séances | ✅ | ✅ |
| Voter pour un film | ✅ | ✅ |
| S'inscrire à une séance | ✅ | ✅ |
| Ajouter un film | ❌ | ✅ |
| Modifier un film | ❌ | ✅ |
| Supprimer un film | ❌ | ✅ |
| Créer une séance | ❌ | ✅ |
| Voir les statistiques admin | ❌ | ✅ |
| Voir la liste des membres | ❌ | ✅ |

### Sécurité

**Points forts :**
- Mots de passe hachés avec BCrypt
- Tokens JWT signés avec clé secrète
- Expiration des tokens (3h)
- Validation de la signature côté serveur
- Autorisation basée sur les rôles

**Recommandations pour la production :**
- Utiliser HTTPS uniquement
- Stocker la clé JWT dans Azure Key Vault (pas dans appsettings.json)
- Implémenter le refresh token pour prolonger les sessions
- Ajouter la vérification de l'issuer et de l'audience
- Limiter le taux de requêtes (rate limiting)
- Ajouter la validation CORS plus restrictive (pas "AllowAll")

---

## Frontend React

### Architecture du frontend

```
clubcine-front-test/
├── src/
│   ├── api/              # Appels API (Axios)
│   │   ├── authApi.js
│   │   ├── filmAPI.js
│   │   ├── seanceAPI.js
│   │   └── sortieCineAPI.js
│   ├── components/       # Composants réutilisables
│   │   ├── Sidebar.jsx
│   │   ├── NextMovieCard.jsx
│   │   ├── UpcomingScreenings.jsx
│   │   └── SidePanelVote.jsx
│   ├── pages/            # Pages principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── AdminStatsPage.jsx
│   │   └── MembersPage.jsx
│   ├── App.jsx           # Composant racine + routing
│   └── main.jsx          # Point d'entrée
```

### Routing (App.jsx)

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin/stats" element={<AdminStatsPage />} />
    {/* ... autres routes */}
  </Routes>
</BrowserRouter>
```

### Appels API (Couche API)

**Pattern commun :**
```javascript
import axios from "axios";

const API_URL = "http://localhost:5091/api/xxx";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("clubcine_token") || ""}`
  }
});

export const getAllXxx = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};
```

**Fichiers API :**

1. **authApi.js**
   - `loginUser(email, password)` : Connexion
   - `registerUser(...)` : Inscription

2. **filmAPI.js**
   - `getAllFilms()` : Liste tous les films
   - `getFilmById(id)` : Détail d'un film
   - `addFilm(film)` : Ajoute un film (admin)
   - `updateFilm(id, film)` : Modifie un film (admin)
   - `deleteFilm(id)` : Supprime un film (admin)

3. **seanceAPI.js**
   - `getAllSeances()` : Liste toutes les séances
   - `getProchaineSeance()` : Prochaine séance
   - `addSeance(seance)` : Crée une séance (admin)
   - `updateSeance(id, seance)` : Met à jour (admin)
   - `deleteSeance(id)` : Supprime (admin)

4. **sortieCineAPI.js**
   - CRUD complet pour les sorties cinéma

### Pages principales

#### Login.jsx
- Formulaire de connexion
- Appel à `authApi.loginUser()`
- Stockage du token dans `localStorage`
- Redirection vers `/dashboard` si succès

#### Register.jsx
- Formulaire d'inscription
- Appel à `authApi.registerUser()`
- Redirection vers `/login` après inscription

#### Dashboard.jsx
- Page principale après connexion
- Affiche les prochaines séances
- Composants : `UpcomingScreenings`, `NextMovieCard`, `SidePanelVote`
- Navigation vers autres pages

#### CalendarPage.jsx
- Calendrier des séances (React Calendar)
- Affichage des événements passés et à venir
- Filtres par date

#### AdminPanel.jsx
- Interface d'administration
- Gestion des films, séances, sorties
- Réservé aux admins

#### AdminStatsPage.jsx
- Statistiques administratives
- Graphiques et données agrégées

#### MembersPage.jsx
- Liste des membres du club
- Gestion des utilisateurs (admin)

### Composants réutilisables

#### Sidebar.jsx
- Barre de navigation latérale
- Liens vers les différentes pages
- Affichage conditionnel selon le rôle (user/admin)

#### NextMovieCard.jsx
- Carte affichant le prochain film à voir
- Informations : titre, date, lieu

#### UpcomingScreenings.jsx
- Liste des prochaines séances
- Affichage des films proposés

#### SidePanelVote.jsx
- Panneau de vote pour une séance
- Sélection d'un film parmi les propositions
- Envoi du vote via API

### Gestion de l'état

**État local (useState) :**
- Token stocké dans `localStorage`
- Données des pages chargées via `useEffect`
- Pas de state management global (Redux/Context) pour l'instant

**Cycle de vie typique :**
```javascript
const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const result = await api.getAllXxx();
    setData(result);
  };
  fetchData();
}, []);
```

---

## Flux de données

### Exemple : Ajout d'un film (Admin)

```
1. Frontend (AdminPanel.jsx)
   │
   │ User clique sur "Ajouter film"
   │ Remplit le formulaire
   │
   ▼
2. Appel API (filmAPI.js)
   │
   │ axios.post("/api/film", filmData, {
   │   headers: { Authorization: "Bearer {token}" }
   │ })
   │
   ▼
3. Backend - FilmController
   │
   │ [Authorize(Roles = "admin")]
   │ [HttpPost]
   │ public async Task<IActionResult> Add([FromBody] FilmDto film)
   │
   │ • Vérifie le token JWT
   │ • Vérifie le rôle "admin"
   │ • Si OK → appelle FilmService
   │
   ▼
4. Backend - FilmService
   │
   │ public async Task AddFilm(FilmDto film)
   │
   │ • Vérifie l'unicité du titre
   │ • Si OK → appelle FilmRepository
   │
   ▼
5. Backend - FilmRepository
   │
   │ public async Task AddAsync(FilmDto film)
   │
   │ • Insère dans MongoDB via MongoDbContext
   │
   ▼
6. MongoDB Atlas
   │
   │ Collection "Film"
   │ InsertOneAsync(film)
   │
   ▼
7. Réponse remontée
   │
   │ Repository → Service → Controller → API Response
   │
   ▼
8. Frontend reçoit la réponse
   │
   │ • Affiche un message de succès
   │ • Rafraîchit la liste des films
```

### Exemple : Vote d'un utilisateur

```
1. Frontend (SidePanelVote.jsx)
   │
   │ User sélectionne un film
   │ Clique sur "Voter"
   │
   ▼
2. Appel API (voteAPI.js ou similaire)
   │
   │ axios.post("/api/vote/vote", {
   │   userId: "...",
   │   seanceId: "...",
   │   filmId: "..."
   │ })
   │
   ▼
3. Backend - VoteController
   │
   │ [HttpPost("vote")]
   │ public async Task<IActionResult> Vote([FromBody] VoteDto vote)
   │
   │ • Appelle VoteService.AddVote()
   │
   ▼
4. Backend - VoteService
   │
   │ public async Task AddVote(VoteDto vote)
   │
   │ • Vérifie si l'utilisateur a déjà voté (HasUserVoted)
   │ • Si non → ajoute le vote via VoteRepository
   │ • Si oui → lance une exception (Conflict)
   │
   ▼
5. Backend - VoteRepository
   │
   │ • Insère le vote dans MongoDB
   │
   ▼
6. MongoDB Atlas
   │
   │ Collection "Vote"
   │ InsertOneAsync(vote)
   │
   ▼
7. Réponse
   │
   │ • Succès : "Vote enregistré !"
   │ • Erreur : "Vous avez déjà voté pour cette séance"
```

### Exemple : Connexion utilisateur

```
1. Frontend (Login.jsx)
   │
   │ User entre email + password
   │ Clique sur "Se connecter"
   │
   ▼
2. Appel API (authApi.js)
   │
   │ axios.post("/api/user/login", { email, password })
   │
   ▼
3. Backend - UserController
   │
   │ [HttpPost("login")]
   │ public async Task<IActionResult> Login([FromBody] LoginRequest request)
   │
   │ • Appelle UserService.GetUserByEmail()
   │ • Vérifie le mot de passe avec BCrypt.Verify()
   │ • Si OK → appelle UserService.GenerateJwt()
   │
   ▼
4. Backend - UserService
   │
   │ GenerateJwt(user)
   │
   │ • Crée les claims (email, role)
   │ • Génère le token JWT (expiration 3h)
   │ • Retourne le token
   │
   ▼
5. Réponse
   │
   │ {
   │   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   │   "user": { id, prenom, nom, email, role, classe }
   │ }
   │
   ▼
6. Frontend
   │
   │ • Stocke le token : localStorage.setItem("clubcine_token", token)
   │ • Stocke les infos user (optionnel)
   │ • Redirige vers /dashboard
```

---

## Composants et leurs rôles

### Résumé des interactions

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                        │
│                                                             │
│  Pages ──> Composants ──> API Calls ──> HTTP Request      │
│                                                             │
│  • Login.jsx                                                │
│  • Dashboard.jsx ──> Sidebar, NextMovieCard,               │
│                      UpcomingScreenings, SidePanelVote      │
│  • AdminPanel.jsx                                           │
│  • CalendarPage.jsx                                         │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS + JWT Token
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    BACKEND (.NET)                            │
│                                                             │
│  Controllers ──> Services ──> Repositories ──> MongoDB     │
│                                                             │
│  • UserController ──> UserService ──> UserRepository       │
│  • FilmController ──> FilmService ──> FilmRepository       │
│  • SeanceController ──> SeanceService ──> SeanceRepository │
│  • VoteController ──> VoteService ──> VoteRepository       │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ MongoDB Driver
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                 MONGODB ATLAS                                │
│                                                             │
│  Collections: User, Film, Seance, Vote,                   │
│               SortieCine, Inscription                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Rôles des couches

| Couche | Rôle | Responsabilités |
|--------|------|-----------------|
| **Frontend (React)** | Interface utilisateur | Affichage, interactions, appels API |
| **API Controllers** | Points d'entrée HTTP | Validation, routage, sécurité |
| **Services (BLL)** | Logique métier | Règles de gestion, orchestration |
| **Repositories (DAL)** | Accès données | CRUD MongoDB, requêtes |
| **MongoDB** | Persistance | Stockage des données |

### Injection de dépendances

**Configuration dans Program.cs :**
```csharp
// Singleton : une seule instance pour toute l'application
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<UserService>();

// Scoped : une instance par requête HTTP
builder.Services.AddScoped<SeanceService>();
builder.Services.AddScoped<SeanceRepository>();
```

**Avantages :**
- Découplage des composants
- Testabilité (mock facile)
- Gestion du cycle de vie automatique
- Réutilisabilité

---

## Conclusion

Cette architecture en couches séparées offre :
- **Maintenabilité** : Code organisé et modulaire
- **Testabilité** : Chaque couche peut être testée indépendamment
- **Évolutivité** : Ajout de fonctionnalités sans impact sur les autres couches
- **Sécurité** : Authentification JWT et autorisation par rôles
- **Performance** : Utilisation de MongoDB pour la flexibilité et la scalabilité

Le système est prêt pour un déploiement en production sur Azure avec MongoDB Atlas.


