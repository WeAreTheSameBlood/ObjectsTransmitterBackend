FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN apk add --no-cache postgresql-client
RUN npm run build

CMD ["node", "dist/main"]
# CMD ["npm", "run", "start:dev"]