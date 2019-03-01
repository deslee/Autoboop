FROM node:11
WORKDIR /app

COPY ./package*.json ./
RUN npm install
COPY ./ ./

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

RUN npm install --quiet --no-progress --unsafe-perm -g zero
CMD ["zero"]