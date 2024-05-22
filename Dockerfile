FROM node:18-alpine

WORKDIR /projects/note-application

COPY . .

RUN npm install nodemon -g

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]