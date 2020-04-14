# latj-frontend 电子卷宗前端代码框架

## 安装依赖
```$xslt
npm install
```

## 开发调试
```$xslt
npm start
```

## 部署
* nginx配置
```
location ^~ /dzjz/static/ {
   root /path/to/dist/;
}

location ^~ /dzjz {
    root /path/to/dist;
    rewrite ^(.*)$ /index.html break;
}

```

