# Develop stage
FROM node:18-alpine as develop

RUN mkdir -p /fakehome
ENV HOME /fakehome

WORKDIR /usr/src/app/
ENV NODE_ENV development

# Install dependencies.
RUN apk add --no-cache vim unzip make git python3 py3-pip

# Make the terminal pretty.
RUN echo "PS1='\[\033[1;36m\]\u\[\033[1;31m\]@\[\033[1;32m\]\h:\[\033[1;35m\]\w\[\033[1;31m\]\$\[\033[0m\] '" >> /etc/profile \
    && echo "export TERM=xterm" >> /etc/profile

# Make ng binaries available to the system path.
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Configure the entrypoint script.
COPY /docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

# Build Stage
FROM node:18-alpine as build

RUN mkdir -p /fakehome
ENV HOME /fakehome

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

# Nginx Prod Stage
FROM nginx:1.23-alpine as prod

RUN mkdir -p /fakehome
ENV HOME /fakehome

WORKDIR /usr/share/nginx/html

COPY ${PWD}/nginx.conf /etc/nginx/conf.d
COPY --from=build /usr/src/app/dist/plaisure-frontend .
