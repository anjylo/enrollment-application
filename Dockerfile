FROM node:18-alpine

WORKDIR /projects/enrollment-application

COPY . .

RUN npm install nodemon -g

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]