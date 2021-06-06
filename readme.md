
## mongo


 docker run -d --name container_name -p 27017:27017 \
       -e MONGO_INITDB_ROOT_USERNAME=root \
             -e MONGO_INITDB_ROOT_PASSWORD=tNomeeroZLbx \
	           mongo


## migrations

npm install -g migrate-mongo
and then
migrate-mongo up

