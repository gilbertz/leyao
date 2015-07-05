liunx 安装说明
1、先安装nodejs
选择合适目录，比如/usr/local/
wget https://nodejs.org/dist/v0.12.6/node-v0.12.6-linux-x64.tar.gz
tar zxvf node-v0.12.6-linux-x64.tar.gz
然后软连ln -s /usr/local/node-v0.12.6-linux-x64/bin/node /usr/local/bin/node 

2、再安装npm
curl -L https://npmjs.org/install.sh | sh

参考 https://www.npmjs.com/package/npm

3、安装grunt yoeman bower
sudo npm install -g grunt yo grunt-cli bower
安装过程如出错
Please report this full log at https://github.com/Medium/phantomjs
npm ERR! Linux 3.13.0-32-generic
npm ERR! argv "node" "/usr/bin/npm" "install"
或者如果出现registry error, 则可以运行npm config set registry http://registry.cnpmjs.org
记得命令行改源链接，原因是被墙
npm config set registry http://registry.npmjs.org/


mac安装说明
1、brew install nodejs
2、如果出现registry error, 则可以运行npm config set registry http://registry.cnpmjs.org
3、brew install npm
4、sudo npm install -g grunt yo grunt-cli bower






