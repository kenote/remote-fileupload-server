# remote-fileupload-server
Remote Fileupload Server

### 上传文件配置

```yaml
---
# 上传文件配置 

default:
  # 类型
  type            : local
  # 文件存储目录
  root_dir        : uploadfiles
  # 文件下载入口
  root_url        : http://localhost:3000/uploadfiles
  # 最大上传文件大小
  max_size        : 4MB
  # 支持文件类型
  mime_type       :
    - image/png
    - image/jpeg
  # 是否使用源文件名
  original_name   : true
```

### 上传文件

`POST` -->  `/upload[/:type][?dir={dir}]`

### 下载文件

`GET` --> `/download[/:type]/:filename[?sub_dir={sub_dir}]`

### 获取上传文件列表

`POST` --> `/api/v1/uploadfiles[/:type][?dir={dir}]`

### 解压 ZIP 文件

`POST` --> `/api/v1/unzip[/:type]`

```yaml
# ZIP文件路径
zipfile  : src/test.zip
# 解压路径
target   : src
# 完成后是否删除ZIP文件
remove   : true
```

### 删除文件

`DELETE` --> `/api/v1/uploadfiles[/:type]`

```yaml
# 要删除的文件路径
files  :
  - src/001.js
  - src/002.js
  - src/003.js
```

### 获取日志文件列表

`GET` --> `/api/v1/logs`

### 下载日志文件

`GET` --> `/api/v1/logs/:filename`

### 删除日志文件

`DELETE` --> `/api/v1/logs`

```yaml
# 要删除的文件路径
files  :
  - bak.2019-12-19-14.log
  - bak.2019-12-19-15.log
  - bak.2019-12-19-16.log
```

## License

this repo is released under the [MIT License](https://github.com/kenote/remote-fileupload-server/blob/master/LICENSE).