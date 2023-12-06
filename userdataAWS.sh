#!/bin/bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
sudo yum install git -y
git version
git clone https://github.com/AbhinanduReddy/Movie-Theater-booking.git
cd Movie-Theater-booking
sudo docker-compose up -d
sudo docker ps