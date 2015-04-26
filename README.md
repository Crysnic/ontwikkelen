ontwikkelen
===========
Simple social network

####Node installing via git

    $ git clone https://github.com/joyent/node

    ./configure
    make
    sudo make install
    
####MongoDB installing
1. Import the public key used by the package management system

  `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`

2. Create a list file for MongoDB

  `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`

3. Reload local package database

  `sudo apt-get update`

4. Install the latest stable version of MongoDB

  `sudo apt-get install -y mongodb-org`

####Server installing
1. Install all modules

  `npm install`

2. Create database

  `node createDb.js`

3. Run the server
    
  `node app.js`
