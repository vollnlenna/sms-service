FROM node:22

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "until pg_isready -h \$POSTGRES_HOST -U \$POSTGRES_USER -d \$POSTGRES_DB; do sleep 1; done && npm run migrate && node dist/main.js"