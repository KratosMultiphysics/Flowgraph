FROM fjgarate/kratos-run:latest

# install nodejs
RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /flowgraph
COPY package.json package.json

RUN npm install --production

COPY . .
RUN mv config/docker.json config/default.json

CMD ["node", "app.js"]

# docker build -t flowgraph .
# docker run -p 8182:8182 flowgraph
# docker run -it -p 8182:8182 flowgraph bash

# Instructions
# the model must be in /model. Mount there your files using -v /path/to/your/model:/model
# 