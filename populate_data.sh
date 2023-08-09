# Setup
## get all credentials
read -p "Enter mysql user: " mysqlUser
read -p "Enter mysql password: " mysqlPassword

## create mysql tables if not exists
for table in ./Chat/scripts/mysql/*
do
    echo running $table
    mysql -u$mysqlUser -p$mysqlPassword < "$table"
done

for table in ./People/scripts/mysql/*
do
    echo running $table
    mysql -u$mysqlUser -p$mysqlPassword < "$table"
done

for table in ./Oauth/scripts/mysql/*
do
    echo running $table
    mysql -u$mysqlUser -p$mysqlPassword < "$table"
done


# Data Population
## Oauth


## People
for table in ./data/testData/*
do
    echo running $table
    mysql -u$mysqlUser -p$mysqlPassword < "$table"
done

## Chat
