FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine as runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 3000
CMD ["npm", "start"]
