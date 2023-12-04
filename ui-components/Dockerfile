FROM node:21-alpine3.18 as builder
WORKDIR /app
COPY ./package.json ./
RUN npm i --force
COPY . .
RUN npm run build
RUN ls
RUN cd dist
RUN ls

FROM nginx
EXPOSE 3000
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
