FROM node:12
WORKDIR /usr/app
COPY ./package.json .
RUN npm install --quiet
COPY . .
RUN ["chmod", "+x", "run.sh"]

ENV NODE_ENV=production

CMD ["./run.sh"]