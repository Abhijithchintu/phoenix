const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: process.env.VAULT_ADDR,
});
  
const roleId = process.env.ROLE_ID;
const secretId = process.env.SECRET_ID;

const init = async () => {
  const result = await vault.approleLogin({
    role_id: roleId,
    secret_id: secretId,
  });

  vault.token = result.auth.client_token;
};

const read = (path) =>  new Promise(async (resolve, reject) => {
  const {data} = await vault.read(path);
  resolve(data.data);
});
  
module.exports = { init, read };