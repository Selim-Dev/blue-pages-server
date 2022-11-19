FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install -g rimraf node-pre-gyp n


# RUN npm config set legacy-peer-deps true
RUN npm install  


COPY . .

CMD ["npm","run","start:debug"]

# RUN npm run build

# FROM node:12.19.0-alpine3.9 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/src/main"]