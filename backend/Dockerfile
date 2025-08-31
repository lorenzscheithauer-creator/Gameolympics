# Verwende das offizielle Node.js LTS Image (Alpine Linux für geringe Größe)
FROM node:lts-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Paketdateien
COPY package.json ./
# Kopiere die Lock-Datei, falls vorhanden (package-lock.json, pnpm-lock.yaml oder yarn.lock)
# Beispiel für NPM:
COPY package-lock.json ./

# Installiere Abhängigkeiten IM CONTAINER
# Beispiel für NPM (npm ci für Robustheit):
RUN npm ci
# Wenn du PNPM nutzt, müsstest du PNPM im Container installieren oder 'npm install' nutzen

# Kopiere den Rest des Quellcodes
COPY . .

# Definiere den Port (Anpassen, falls der Server nicht auf 3000 läuft)
EXPOSE 3000

# Befehl zum Starten des Servers (Anpassen, falls deine Startdatei anders heißt)
CMD ["node", "server.js"]
