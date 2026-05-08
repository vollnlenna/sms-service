FROM node:22

WORKDIR /app

COPY docs/package*.json ./
RUN npm install

COPY docs .

EXPOSE 5173

CMD ["npm", "run", "docs:dev", "--", "--host", "0.0.0.0"]
