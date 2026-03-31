# MediPeyi

Plateforme sante de proximite pour la Martinique.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:5173`.

## Build de production

```bash
npm run build
```

Le site statique genere est dans `dist/`.

## Publication gratuite recommandee

La solution la plus simple pour ce projet est :

- GitHub pour stocker le code
- Cloudflare Pages pour l'hebergement gratuit

### Option A : GitHub + Cloudflare Pages

1. Cree un depot GitHub vide, par exemple `medipeyi`.
2. Envoie les fichiers du projet dans ce depot.
3. Ouvre Cloudflare Pages.
4. Clique sur `Create a project`.
5. Choisis `Connect to Git`.
6. Selectionne le depot GitHub.
7. Configure :
   - Framework preset : `Vite`
   - Build command : `npm run build`
   - Build output directory : `dist`
8. Lance le deploy.
9. Cloudflare te donnera une URL gratuite en `pages.dev`.

### Option B : publication sans Git

1. Lance `npm run build`
2. Prends le dossier `dist`
3. Envoie-le sur :
   - Cloudflare Pages en `Direct Upload`
   - ou Netlify Drop

Cette option est tres rapide, mais moins pratique si tu veux des mises a jour automatiques.

## Notes importantes

- Le site est une application Vite statique.
- Le manifeste PWA et l'icone sont deja inclus.
- Un fichier `_redirects` est fourni pour simplifier l'hebergement statique.

## Si Git n'est pas installe sur la machine

Tu peux quand meme publier :

- soit en utilisant GitHub Desktop
- soit en creant le depot sur GitHub puis en envoyant les fichiers depuis l'interface web
- soit en passant par un `Direct Upload` de `dist`

