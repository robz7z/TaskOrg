FROM node:22-alpine
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
RUN npm install -g tsx dotenv-cli
COPY . .
EXPOSE 3035
CMD ["npm", "run", "dev"]