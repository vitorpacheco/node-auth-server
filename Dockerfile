FROM node:16.14.0

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

USER node

COPY package*.json .

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
