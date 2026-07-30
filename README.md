# Geodata

Le site n'appelle pas REST Countries depuis le navigateur. Pendant chaque
déploiement, GitHub Actions utilise une clé secrète pour télécharger les données
de l'API v5 et génère `public/data/europe.json`. Le site publié ne contient que
ces données publiques, jamais la clé.

## Configurer ou remplacer la clé

1. Révoquer toute clé qui a été partagée publiquement et en générer une nouvelle.
2. Dans le dépôt GitHub, ouvrir **Settings → Secrets and variables → Actions**.
3. Cliquer sur **New repository secret**.
4. Utiliser exactement le nom `RESTCOUNTRIES_API_KEY` et coller la nouvelle clé
   dans **Secret**.
5. Pour remplacer une clé, ouvrir ce même secret, puis choisir **Update secret**.
6. Relancer **Actions → Deploy to GitHub Pages → Run workflow**.

La clé ne doit jamais être placée dans le code, dans un fichier `VITE_*`, dans
`public/` ou dans `europe.json`.

## Actualiser les données localement

Dans PowerShell, définir temporairement la clé pour le terminal courant, puis
exécuter le script :

```powershell
$env:RESTCOUNTRIES_API_KEY = "COLLER_LA_CLE_ICI"
npm.cmd run data:refresh
Remove-Item Env:RESTCOUNTRIES_API_KEY
```

Le fichier JSON déjà versionné permet de développer sans clé :

```powershell
npm.cmd run dev
```

Le déploiement actualise également les données chaque lundi et à chaque
publication sur `main`.
