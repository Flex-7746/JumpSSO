# JumpSSO

支持私有部署的轻量单点登录服务端，支持主流的 OIDC、SAML2 客户端进行接入，支持飞书、钉钉、企微、飞书作为身份源实现免密码登录，解决企业内部各类系统不同账户的登录问题。

[使用说明](docs/README.md)

[服务接入](docs/JOIN.md)

## 部署

### 环境依赖

本人开发与部署环境均为 nodejs v22.22.0，推荐此版本部署。

低 nodejs 版本亦可能部署，但可能出现兼容性问题，若出现问题可 issues 中反馈并提交 nodejs 版本。

### 首次

从 Release 中下载最新代码，解压后执行下方命令即可。

```bash
npm i
npm run prod
```

首次运行时，会自动生成超级管理员并 log 输出相关信息，您可访问 web 端操作界面进行账户操作。

初始密码存储在 runtime/config.json 文件中，<font color="red">请注意，如果您在操作界面修改超级管理员密码，配置文件并不会同步更新</font>

### 更新

从 Release 中下载最新代码，拷贝并覆盖，重启服务：

```bash
npm i
npm run prod
```

此时日志不会输出账户信息，仅提示服务已启动。

## 参数

除了上面的简单部署外，提供一系列的可选参数按需设置，参数传递使用如下命令：

```bash
npm run prod -- --port=xxx --server=xxx
```

### 域名与端口

一般服务会使用 https 代理，所以会存在服务运行端口和外部服务端口不一致的情况，提供两个配置项：

| 参数名 | 说明                                                                                          |
| ------ | --------------------------------------------------------------------------------------------- |
| port   | 本机端口：服务运行在机器上的端口，默认 17746                                                  |
| server | 服务地址：实际使用的地址，可无后缀，http 默认 80，https 默认 443，默认 http://localhost:17746 |

https 反向代理示例：

```bash
npm run prod -- --port=27746 --server=https://jumpsso.com:7443
```

运行此服务后，你应当添加反向代理服务，将 https://jumpsso.com:7443 代理至 http://127.0.0.1:27746

### 缓存数据

默认使用本地文件进行缓存，缓存位于 runtime/cache 目录下。

支持使用 Redis 进行缓存，拼接您的 Redis 配置项，如果存在账户名，应该为以下文本：

- username:password@host:port/database

如果不存在账户名，应该为以下文本：

- :password@host:port/database

得到对应文本后，在运行时使用如下命令即可：

```bash
# 有账户名
npm run prod -- --redis=username:password@host:port/database

# 无账户名
npm run prod -- --redis=:password@host:port/database
```

### 存储数据

默认使用 sqlite 本地文件进行存储，存储库为 runtime/db.sqlite 文件。

支持使用 MySQL 进行存储，拼接您的 MySQL 配置项，应该为以下文本：

- username:password@host:port/database

```bash
npm run prod -- --mysql=username:password@host:port/database
```

## 鸣谢

我仅仅站在巨人肩膀上做了一些简单的工作，特别感谢有这些好用的开源项目：

- [node-oidc-provider](https://github.com/panva/node-oidc-provider)
- [samlify](https://github.com/tngan/samlify)

## 其他

我正在观望新的工作机会，岗位为前端/全栈开发工程师，工作地方期望为中国武汉本地或全球远程办公（中文环境），如果您认可我的能力，欢迎于 issues 中进行洽谈。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=FNOSP/App.Bin.CodeEditor&type=timeline&legend=top-left)](https://www.star-history.com/#FNOSP/App.Bin.CodeEditor&type=timeline&legend=top-left)
