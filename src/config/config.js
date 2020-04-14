'use strict';

export const config = {
  $meta: 'This file configures the plot device.',
  projectName: 'cm-robot',
  port: {
    web: 8000,
  },
  backend: {
    domain: "http://gateway/ui",
    url: "/api/backend"
  },
  gateway: {
    domain: 'http://gateway',
  },
  storage: {
    mongodb: {
      url: "mongodb://localhost:27017/storage"
    },
    redis: {
        host: "localhost",
        opts: {
          parser: "javascript"
        },
        password: "myPass1@#"
    }
  },
  app: {
    integrate: true,
    version: 'JS_V1.03P2',
    portal: '/',
    context: '',
    jwtSecret: "fcff344ad870205f9e2f5c9a30928ee5112c0c78",
    config: {
      appCode: 'JCFX',
      appName: "江苏省检察机关刑事案件办理科学决策系统",
      icpNo: "苏ICP备15052717-1号",
      copyright: '2018 北京赛迪时代信息技术股份有限公司',
      views: {
        cache: false
      }
    },
    env:  "production",
    domain: "www.ccidit.com",
    meta: {
      "qc:admins": "2544126266641672526375",
      "wb:webmaster": "0ce41f66da7269f0"
    },
    entry: {
      key: "d4624c36b6795d1d99dcf0547af5443d"
    },
    provence: {
      shortCode: "32",
      code: "320",
      name: "江苏省",
    },
    task: {
      condition : [
        {
          "ysay": "交通肇事罪",
          "ajmc": []
        },
        {
          "ysay": "危险驾驶罪",
          "ajmc": []
        }
      ]
    },
    process: {
      simple: ['交通肇事罪'],
    }
  },
  oauth2: {
    callback: "http://www.lingber.com/passport",
    weixin: {
      clientID: "wxf1c90a358975b48c",
      clientSecret: "d4624c36b6795d1d99dcf0547af5443d"
    },
    weibo: {
      clientID: "2600977444",
      clientSecret: "ab30bab7d3721304537ae8b24616c542"
    },
    qq: {
      clientID: "101296564",
      clientSecret: "3dd4b5508e8dc153ac2790e89653b8f6"
    }
  }
};
