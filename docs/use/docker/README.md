# Docker 部署 JumpSSO

## 完整示例

```bash
# 拉取镜像
docker pull flex7746/jumpsso:v0.0.1

# 运行服务
docker run -d \
  --name sso \
  --restart unless-stopped \
  -p 17746:17746 \
  -v $(pwd)/runtime:/sso/runtime \
  -v $(pwd)/public:/sso/public \
  -e SSO_SERVER="https://sso.example.com" \
  -e SSO_REDIS="redis://redis-host:6379" \
  -e SSO_MYSQL="mysql://user:pass@mysql-host:3306/sso" \
  flex7746/jumpsso:v0.0.1
```

## 说明

### 目录映射

| 参数名       | 说明                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| /sso/runtime | 系统运行的缓存目录，存储了本地存储、本地缓存、上传图片、初始配置等运行时的文件，映射后，重置 docker 服务也不会丢失数据 |
| /sso/public  | 部署后静态资源文件，主要用于企微验证于明，假设部署为 a.com，public 下的 1.jpg 可 a.com/1.jpg 访问                      |

### 环境变量

| 参数名     | 说明                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| SSO_SERVER | 可选，外部服务实际地址，可无后缀，http 默认 80，https 默认 443，默认 http://localhost:17746               |
| SSO_REDIS  | 可选，使用 Redis 进行缓存，示例【username:password@host:port/database】、【:password@host:port/database】 |
| SSO_MYSQL  | 可选，使用 MySQL 进行存储，示例【username:password@host:port/database】                                   |

## 示例

假设端口映射 8080:17746，外部域名为 https://abc.com:8080 那么命令为：

```bash
docker run -d \
  --name sso \
  --restart unless-stopped \
  -p 8080:17746 \
  -v $(pwd)/runtime:/sso/runtime \
  -v $(pwd)/public:/sso/public \
  -e SSO_SERVER="https://abc.com:8080" \
  flex7746/jumpsso:v0.0.1
```
