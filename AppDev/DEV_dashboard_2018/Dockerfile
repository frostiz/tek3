FROM node:8.12.0

RUN mkdir /src

RUN npm install -g nodemon
RUN npm install -g webpack

WORKDIR /src
ADD app/package.json /src/package.json

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]