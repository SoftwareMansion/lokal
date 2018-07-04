# lok.al

## Installation & running

Install dependencies:
```
yarn
yarn global add typescript tslint
tsc
brew install mongodb
```
Configure mongodb:
```
$ mongo 
...
MongoDB shell version v3.4.7
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.7
> use api
> exit
```
Run in background:
```
mongod
node dist/index.js
```
