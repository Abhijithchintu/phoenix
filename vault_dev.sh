pkill -9 vault
rm ~/vault.log
nohup vault server -dev > ~/vault.log &

i=1
while true
do
    sleep 1
    token=$(perl -nle'print $1 while m{Root Token:[ ]*(.*)}g' ~/vault.log)
    if [ ${#token} -ge 1 ]; then break; fi
    if [ $i -ge 10 ]; then exit 255; fi
    ((i+=1))
done

export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=$token

vault auth enable approle
vault policy write app-policy ./vault_dev_policy

vault write auth/approle/role/node-app-role \
    token_ttl=1h \
    token_max_ttl=4h \
    token_policies=app-policy

vault kv put secret/oauth/mysql username="nerd" password="Rahul@2000"
vault kv put secret/oauth/jwt jwt_secret="secret_token"

vault kv put secret/chat/mysql username="root" password=""

vault kv put secret/people/mysql username="root" password=""

roleId=$(vault read auth/approle/role/node-app-role/role-id | perl -nle'print $1 while m{role_id[ ]*(.*)}g')
roleId=$(vault read auth/approle/role/node-app-role/role-id | perl -nle'print $1 while m{role_id[ ]*(.*)}g')
secretId=$(vault write -f auth/approle/role/node-app-role/secret-id | perl -nle'print $1 while m{secret_id[ ]*([^ ]*)$}g')
export ROLE_ID=$roleId
export SECRET_ID=$secretId