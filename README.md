Comment lancer le projet ? 

Lancer l'API :
dans ClubCineAPI  :dotnet run

Lancer le front :
dans ClubCineAPI.Tests : npm run dev

pour MongoDB Atlas en local:
Dans ClubCineAPI :
dotnet user-secrets set "MongoDbSettings:ConnectionString" "TA_CHAINE_ATLAS_ICI"
(Avec ASPNETCORE_ENVIRONMENT=Development, la clé JWT vient de appsettings.Development.json ; tu peux aussi la surcharger avec dotnet user-secrets set "JwtSettings:Key" "...".)
