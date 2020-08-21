FROM node:10-alpine
WORKDIR /src

ADD package*.json ./

RUN npm install

ADD . /src
# COPY . .
EXPOSE 1234
CMD ["npm", "start"]

