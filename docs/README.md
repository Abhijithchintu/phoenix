# Setup
## Packages/Frameworks
- npm/node.js/react.js
- MySql
- Redis
- Elasticsearch / Opensearch
- MongoDB
- Vault
- bash/zsh for vault dev setup
- docsify (documentation only)
- swagger (documentation only)
# Build/Deploy/Run
## Configuration
Add the relevant credentials/config in vault setup, if running locally use vault_setup.sh
```bash
. ./vault_setup.sh
```
This will export the required variables as well as write the secrets to vault.
## commands for starting website
```bash
npm start
```
Run these commands from root (instead of going to each service and running commands individually, all the commands can be run from root itself)  
a. npm install: to install node_modules in oauth, people, chat and phoenixfe.   
b. npm run removen: to remove already installed node modules and packagae-lock.json file in above mentioned services.  
c. npm run start: It starts the node in oauth, people and chat services. And also run build in phoenixfe.   
# APIs
[APIs](https://manu156.github.io/phoenix/apis)
