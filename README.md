# Installation

In the following, you will find a description of how to install the software on an exemplary server.  You might have to adjuste the following commands in case of your own server.

## Basic tools

```bash
sudo apt-get install -y autojump htop unzip
echo ". /usr/share/autojump/autojump.bash" >> ~/.bashrc
```

## Docker

```bash
sudo apt-get update
sudo apt-get install \
  apt-transport-https \
  ca-certificates \
  curl \
  software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
sudo apt-get update
sudo apt-get install -y docker-ce

sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo usermod -aG docker fmocnik && newgrp docker
```

## Nodejs and pm2

```bash
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install pm2 -g
sudo startup ubuntu
# execute the command given in the result
```

## Install nginx

```batch
sudo apt-get install -y nginx
sudo service nginx status
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default
```

## Let's Encrypt

```bash
sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y certbot python-certbot-nginx

sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
sudo certbot --nginx --email mocnik@uni-heidelberg.de --agree-tos -n -d osm-data-quality.geog.uni-heidelberg.de -d osm-measure.geog.uni-heidelberg.de -d osm-measure-edit.geog.uni-heidelberg.de
#sudo certbot certonly --standalone --preferred-challenges http --email mocnik@uni-heidelberg.de --agree-tos -n -d osm-data-quality.geog.uni-heidelberg.de -d osm-measure.geog.uni-heidelberg.de -d osm-measure-edit.geog.uni-heidelberg.de
#  --staging
sudo shutdown -r now
```

Then use `crontab -e` to add:

```
14 3 * * * certbot renew --post-hook "service nginx restart"
```

## Firewall

```batch
sudo iptables-unblocktcp 80
sudo iptables-unblocktcp 443
sudo iptables-unblocktcp 2999
```

## Configure nginx

Create a file `/etc/nginx/sites-available/https-redirect` (via `sudo vi`) with the following content:

```
server {
  listen 80;
  
  server_name osm-measure.geog.uni-heidelberg.de osm-measure-edit.geog.uni-heidelberg.de;
  
  return 301 https://$host$request_uri;
}
```

Create a file `/etc/nginx/sites-available/osm-measure-edit` (via `sudo vi`) with the following content:

```
server {
  listen 443 ssl;
  listen [::]:443 ssl;

  server_name osm-measure-edit.geog.uni-heidelberg.de;

  ssl_certificate /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/privkey.pem;
  
  location / {
    proxy_pass http://localhost:2999;
  }
}
```

Then:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/https-redirect /etc/nginx/sites-enabled/https-redirect
sudo ln -s /etc/nginx/sites-available/osm-measure-edit /etc/nginx/sites-enabled/osm-measure-edit
sudo service nginx restart
```

## Measures-rest-oshdb

```bash
cd ~
git mkdir measures-rest-oshdb-users

cd ~
git clone https://gitlab.gistools.geog.uni-heidelberg.de/giscience/dfg-intrinsic-data-quality/measures-rest-oshdb-docker

cd ~
git clone https://gitlab.gistools.geog.uni-heidelberg.de/giscience/dfg-intrinsic-data-quality/measures-rest-oshdb-app
cd measures-rest-oshdb-app && npm install
npm run build
pm2 start pm2/osm-data-quality.geog.uni-heidelberg.de.yaml

cd ~
git clone https://gitlab.gistools.geog.uni-heidelberg.de/giscience/dfg-intrinsic-data-quality/measures-rest-oshdb-app measures-rest-oshdb-app-develop
cd measures-rest-oshdb-app-develop && git checkout develop && npm install
pm2 start pm2/osm-data-quality.geog.uni-heidelberg.de.dev.yaml

pm2 save
```

## Vocabulary

In addition, the needed vocabulary can be delivered using nginx:

```bash
mkdir -p www/osm-data-quality.geog.uni-heidelberg.de
```

Then, the data needs to be copy to this directory.  Thereafter, create a file `/etc/nginx/sites-available/osm-data-quality` (via `sudo vi`) with the following content:

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;

  server_name osm-data-quality.geog.uni-heidelberg.de;

  ssl_certificate /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/privkey.pem;
  
  root /home/f/fmocnik/www/osm-data-quality.geog.uni-heidelberg.de;
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/osm-data-quality /etc/nginx/sites-enabled/osm-data-quality
sudo service nginx restart
```

## Publish the measures

```bash
mkdir -p www/osm-measure.geog.uni-heidelberg.de

```

Create a file `/etc/nginx/sites-available/osm-measure` (via `sudo vi`) with the following content:

```
server {
  listen 443 ssl;
  listen [::]:443 ssl;

  server_name osm-measure.geog.uni-heidelberg.de;

  ssl_certificate /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/osm-data-quality.geog.uni-heidelberg.de/privkey.pem;
  
  root /home/f/fmocnik/www/osm-measure.geog.uni-heidelberg.de;
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/osm-measure /etc/nginx/sites-enabled/osm-measure
sudo service nginx restart
```
