if command -v brew &> /dev/null
then
    if ! command -v vault &> /dev/null
    then
        echo "vault not found! installing.."
        brew tap hashicorp/tap
        brew install hashicorp/tap/vault
    fi
    if ! command -v redis-server &> /dev/null
    then
        echo "redis not found! installing.."
        brew install redis
        brew services start redis
    fi
    if ! command -v mysql &> /dev/null
    then
        echo "mysql not found! installing.."
        brew install mysql@5.7
        brew services start mysql@5.7
    fi
elif command -v apt &> /dev/null
then
    if ! command -v vault &> /dev/null
    then
        echo "vault not found! installing.."
        sudo apt update
        sudo apt install gpg
        if ! command -v wget &> /dev/null
        then
            sudo apt install wget
        fi
        wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
        gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt update
        sudo apt install vault
    fi
    if ! command -v redis-server &> /dev/null
    then
        echo "redis not found! installing.."
        sudo apt install lsb-release curl gpg
        curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
        sudo apt-get update
        sudo apt-get install redis
    fi
    if ! command -v mysql &> /dev/null
    then
        echo "mysql not found! installing.."
        sudo apt update
        sudo apt install mysql-server
        sudo systemctl start mysql.service
    fi

elif command -v pacman &> /dev/null
then
    if ! command -v vault &> /dev/null
    then
        echo "vault not found! installing.."
        sudo pacman -S vault
    fi
    if ! command -v redis-server &> /dev/null
    then
        echo "redis not found! installing.."
        sudo pacman -S redis
    fi
    if ! command -v mysql &> /dev/null
    then
        echo "mysql not found! installing.."
        sudo pacman -S mysql
        mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
        echo "two users created. need to create a new user. One is root@localhost, it has no password, but you need to \
be system 'root' user to connect. Use, for example, sudo mysql \
The second is mysql@localhost, it has no password either, but \
you need to be the system 'mysql' user to connect. \
After connecting you can set the password, if you would need to be \
able to connect as any of these users with a password and without sudo."
    fi
else
    if ! command -v vault &> /dev/null
    then
        echo "failed to install vault! exiting!"
        exit
    fi
    if ! command -v redis-server &> /dev/null
    then
        if command -v snap &> /dev/null
        then
            echo "redis not found! installing.."
            sudo snap install redis
        else
            echo "failed to install redis! exiting!"
            exit
        fi
    fi
fi
