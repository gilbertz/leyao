# Leyao 
本项目作为乐摇项目的前端部分，包括web后台和mobile端，整个采用的是前端构建公交yeoman来生成，已经集成了开发任务的自动化命令行工具grunt和一个HTML,CSS,Javascript和图片等前端资源的包管理器Bower

项目采用的angular框架来构建，已经集成了前端oauth2.0验证请求后端API的功能了，这个功能使用的是Angular-oauth2的包，还采用了grunt-connect-proxy作为前端代理，将涉及到API的请求转发到服务器端url
## 使用说明
### liunx 安装说明
* 先安装nodejs

    选择合适目录，比如/usr/local/

    wget https://nodejs.org/dist/v0.12.6/node-v0.12.6-linux-x64.tar.gz

    tar zxvf node-v0.12.6-linux-x64.tar.gz

    然后软连ln -s /usr/local/node-v0.12.6-linux-x64/bin/node /usr/local/bin/node 

* 再安装npm

    参考 https://www.npmjs.com/package/npm

```
curl -L https://npmjs.org/install.sh | sh
```
* 安装grunt yoeman bower

    记得先npm config set registry http://registry.npmjs.org/，再npm install

    sudo npm install -g grunt yo grunt-cli bower

    安装过程如出错

       Please report this full log at https://github.com/Medium/phantomjs

       npm ERR! Linux 3.13.0-32-generic

       npm ERR! argv "node" "/usr/bin/npm" "install"

    或者如果出现registry error, 则可以运行npm config set registry http://registry.cnpmjs.org,记得命令行改源链接，原因是被墙

* npm install 安装所需npm_modules

* bower install 安装前端包

* grunt serve ，启动nodejs服务器，在浏览器打开localhost:9001

### mac安装说明
1. brew install nodejs

2. brew install npm

3. 如果出现registry error, 则可以运行npm config set registry http://registry.cnpmjs.org

4. sudo npm install -g grunt yo grunt-cli bower

5. npm install 安装所需npm_modules

6. bower install 安装前端包

7. grunt serve ，启动nodejs服务器，在浏览器打开localhost:9001






