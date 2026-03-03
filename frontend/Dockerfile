FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Waitress or standard Next.js starts
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
