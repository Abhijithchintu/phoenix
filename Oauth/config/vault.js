const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: "http://127.0.0.1:8200",
  });
  
  const roleId = process.env.ROLE_ID;
  const secretId = process.env.SECRET_ID;
  
  const init = async () => {
    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
  
    vault.token = result.auth.client_token;
    const { data } = await vault.read("secret/data/oauth/mysql");
  
    const username = data.data.username;
    const password = data.data.password;
  
    console.log({
      username,
      password,
    });
  };
  
init();