# 使用说明

部署后，您可以查看服务日志，得到相应信息，可通过浏览器访问服务地址，若重复部署则不会再显示账户信息。

初始密码存储在 runtime/config.json 文件中，<font color="red">请注意，如果您在操作界面修改超级管理员密码，配置文件并不会同步更新</font>

![应用列表](assets/start_init.png)

## 应用

在这里您可以创建应用，创建应用后，再创建对应入口，一个应用可创建多个入口，入口创建可以参考这些文档：[添加 OIDC 入口](oidc/README.md)、[添加 SAML 入口](saml/README.md)

入口创建完成后，可进行服务接入：[示例文档](JOIN.md)

![应用列表](assets/start_app.png)

![添加应用](assets/start_app_add.png)

## 用户

在这里您可以查看 JumpSSO 所有的登录账户，账户类型分为：

- 内置：系统内置账户，除了用于授权登录应用，管理员和超级管理员还可以登录后台系统进行管理。
- 飞书：飞书账户同步展示，配置参考：[使用飞书作为身份源](user/feishu/README.md)
- 钉钉：钉钉账户同步展示，配置参考：[使用钉钉作为身份源](user/dingding/README.md)
- 企微：企微账户同步展示，配置参考：[使用企微作为身份源](user/qiwei/README.md)
- 飞牛：飞牛账户同步展示，配置参考：[使用飞牛作为身份源](user/feiniu/README.md)

创建时，仅可以创建内置账户，编辑时，内置账户可编辑角色和密码。

![应用列表](assets/start_user.png)

![添加应用](assets/start_user_add.png)
