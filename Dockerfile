FROM node:lts-buster
WORKDIR /photo_mosaic_ui
EXPOSE 8112

RUN npm install --global http-server

# install python opencv (workaround for dependency bug)
RUN apt-get update && apt-get install -y python3-opencv

# copy src
COPY src/ ./src

# run app
CMD ["http-server", "src/", "-p", "8112"]