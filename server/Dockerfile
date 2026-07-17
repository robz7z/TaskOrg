FROM node:22-alpine
ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    npm install --include=dev --verbose

RUN npx --yes tsx --version || (echo "tsx não instalado!" && exit 1)

COPY . .

EXPOSE 3035
CMD ["npm", "run", "dev"]