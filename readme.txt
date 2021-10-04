# init sequelize in project
215 sequelize init
# create db due to date provided in config js
217 sequelize db:create
# Create new model with CLI
218  sequelize-cli model:generate --name Song --attributes title:string,duration:bigint
