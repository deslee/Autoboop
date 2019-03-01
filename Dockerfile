FROM node:alpine
WORKDIR /app

COPY ./package*.json ./
RUN npm install
COPY ./ ./

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD ["zero"]