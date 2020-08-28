FROM node:10-alpine
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install

RUN npm install -g parcel-bundler

# ADD . /src
COPY . .
EXPOSE 1234
CMD ["npm", "start"]

