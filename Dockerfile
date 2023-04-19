#each dockerfile creates an empty virtual machine (container)

#base image
FROM node:17-alpine

#setting the directory name
WORKDIR /backend

#copy package.json onto the empty workdir
COPY package.json .

RUN npm install

COPY . .

EXPOSE 1050

WORKDIR /backend/src

CMD ["node", "app.js"]
