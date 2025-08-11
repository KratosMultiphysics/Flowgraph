FROM node:slim

WORKDIR /app
COPY package.json package.json

RUN npm install --production

COPY . .

CMD ["node", "app.js"]

# docker build -t flowgraph .
# docker run -p 8182:8182 flowgraph