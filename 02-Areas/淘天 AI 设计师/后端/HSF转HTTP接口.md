# HSF转HTTP接口

预发环境域名：https://pre-ai-designer.alibaba-inc.com/api/rpc/call 

线上域名：https://ai-designer.alibaba-inc.com/api/rpc/call 

下面所有接口中， parameterValues 是数组，值是 千牛接口的入参转字符串后的内容，[接口](https://aliyuque.antfin.com/wanyi.lyd/aagsfz/lpcsq3nifu0agog9?singleDoc#)

# 千牛 - 同步提交图片处理

Method： POST

Context-type: application/json

参数

```json
{
  "appName": "comfyui",
  "sign": "3fr51Q456j23cv5w",
  "serviceName": "qianniuImageService",
  "methodName": "syncSubmit",
  "parameterValues": ["{\"sdkAiType\":\"single_white_img\",\"params\":{\"fileUrls\":[\"https://img.alicdn.com/imgextra/i4/123/O1CN01lHnr7G1CmNn9TM9uK_!!123-2-qnaigc.png\"],\"wbImg\":false,\"transImg\":true}}"],
  "parameterTypes": [
      "com.taobao.designer.rpc.ai.params.QnAigcSdkRequest"
  ]
}
```

返回例子：

```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "success": true,
        "errorCode": null,
        "errorMessage": null,
        "data": {
            "qnAigcImageList": [
                {
                    "imageType": "wbImg",
                    "imageUrl": null
                },
                {
                    "imageType": "transImg",
                    "imageUrl": "https://is-content-gen.oss-cn-zhangjiakou.aliyuncs.com/AIGC/wbg_img_gen/result/2025-08-26/wbg_m2f_f94baf26eaddf5316b2717a0268cfd15.png"
                }
            ]
        },
        "traceId": null
    }
}
```

# 千牛 - 异步提交图片处理

Method： POST

Context-type: application/json

参数

```json
{
  "appName": "comfyui",
  "sign": "3fr51Q456j23cv5w",
  "serviceName": "qianniuImageService",
  "methodName": "asyncSubmit",
  "parameterValues": ["{\"sdkAiType\":\"model_img\",\"mainUser\":\"233637\",\"currentUser\":\"233637\",\"imageUrlList\":[\"https://img.alicdn.com/imgextra/i3/2256639331/O1CN012Inee6UwkEd7lLm_!!2256639331.jpg\"],\"params\":{\"imgUrl\":\"https://img.alicdn.com/imgextra/i3/2256639331/O1CN012Inee6UwkEd7lLm_!!2256639331.jpg\",\"maskUrl\":\"https://img.alicdn.com/imgextra/i2/2256639331/O1CN01uxovN32Ineluh9Iro_!!2256639331-2-qnaigc.png\",\"background\":{\"cid\":\"bg000\"},\"model\":{\"cid\":\"woman20040\"},\"ratio\":\"invariant\",\"version\":2,\"qualityLevel\":\"normal\",\"imgSize\":2}}"],
  "parameterTypes": [
        "com.taobao.designer.rpc.ai.params.QnAigcSdkRequest"
  ]
}
```

返回例子：

```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "success": true,
        "errorCode": null,
        "errorMessage": null,
        "data": "682c8908-2dc4-449b-8625-288d36c99246",
        "traceId": null
    }
}
```

拿到data.data 也就是任务ID后，不断调用下面的查询结果接口 拿最终结果

**千牛 - 轮询图片处理结果**

Method： POST

Context-type: application/json

参数

```json
{
  "appName": "comfyui",
  "sign": "3fr51Q456j23cv5w",
    "serviceName": "qianniuImageService",
    "methodName": "fetchAsyncTaskResult",
    "parameterValues": ["682c8908-2dc4-449b-8625-288d36c99246"],
    "parameterTypes": [
        "com.taobao.designer.rpc.ai.params.QnAigcSdkRequest"
    ]
}
```

返回例子：

主要看 data.success, data.data.imageList 的数据

```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "success": true,
        "errorCode": null,
        "errorMessage": null,
        "data": {
            "status": "RUNNING",
            "imageList": null,
            "submitTime": 1756190433901
        },
        "traceId": null
    }
}
```

# HomeLabeAPI - 提交任务   [**原始接口文档**](https://alidocs.dingtalk.com/i/nodes/m9bN7RYPWdyrPBREc35K3xQxVZd1wyK0?cid=66640452978&utm_source=im&utm_scene=team_space&iframeQuery=utm_medium%3Dim_card%26utm_source%3Dim&utm_medium=im_card&corpId=dingd8e1123006514592)

Method： POST

Context-type: application/json

参数

```json
{
  "appName": "comfyui",
  "sign": "3fr51Q456j23cv5w",
    "serviceName": "homelabApiService",
    "methodName": "inferenceAsync",
    "parameterValues": ["{\"workflowVerId\":0,\"resource\":\"resource_edf490334d58\",\"param\":\"{\\"logoUrl\\":\\"http://a.com/123.jpg\\"}\",\"context\":{}}"],
    "parameterTypes": [
        "com.taobao.designer.rpc.homelab.params.InferenceRequest"
    ]
}
```

返回例子：

```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "reqId": "02bf24b5-4947-4d51-b376-ef4a243827bb-pre"
    }
}
```

# HomelabAPI获取结果

Method： POST

Context-type: application/json

参数

```json
{
  "appName": "comfyui",
  "sign": "3fr51Q456j23cv5w",
    "serviceName": "homelabApiService",
    "methodName": "fetchResult",
    "parameterValues": ["{\"resource\":\"resource_037eda0c8744\",\"reqId\":\"reqId_c12c9295ce63\"}"],
    "parameterTypes": [
        "com.taobao.designer.rpc.homelab.params.InferenceResultFetchRequest"
    ]
}
```

返回例子：

```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "workflowVerId": null,
        "costTime": null,
        "context": null,
        "progress": null,
        "workflowId": null,
        "status": "PROCESS",
        "outputs": null
    }
}
```
```json
{
    "success": true,
    "errorCode": null,
    "errorMessage": null,
    "data": {
        "workflowVerId": 1952972803966758913,
        "costTime": 0,
        "context": {
            "workflowVerId": "1952972803966758913",
            "workflowId": "1952972768822685698"
        },
        "progress": {},
        "workflowId": 1952972768822685698,
        "status": "SUCCESS",
        "outputs": {
            "output": {
                "data": {
                    "images": [
                        {
                            "filename": "https://ai-designer-comfyui.cn-zhangjiakou.oss.aliyuncs.com/homelab_output/HomeLab_1756347902_73e867d2-0419-4752-923c-09978368d3af.png?security-token=CAISyQJ1q6Ft5B2yfSjIr5nSAM2D1ZVb4vqaWlfAjDUsdbt03rD42jz2IHhMfHZhA%2B4dtv4%2BmmpX6f8clqJzTJpIQUXOKMxr9cySVcQ9hdGT1fau5Jko1beHewHKeTOZsebWZ%2BLmNqC%2FHt6md1HDkAJq3LL%2Bbk%2FMdle5MJqP%2B%2FUFB5ZtKWveVzddA8pMLQZPsdITMWCrVcygKRn3mGHdfiEK00he8Tohtfvgk5PBukOG0wagm7Yvyt6vcsT%2BXa5FJ4xiVtq55utye5fa3TRYgxowr%2F8u1PMVo2mc5ovMXQMOvEzYKZDV8tpqIUpyb7M3Xq5DqfX4nPdoWQc5MHRKVXynVMMisES3LOjIqKOsk2N8pF0igm%2BDJG471P6FAIvInRXlnR50z%2FuygjPo%2B5Kh2PHho%2BAr62Z%2BIZ0jCOzZKNduqEpdivLYUZhco7LiTxqAAXNqcqTDm353EP4klS486SE6ULUWZl0pjU4eIb7v%2FlOrFAS3kvCG214WhPZ3CO2vEYQ7p80ih%2BCb20%2BYTRqSMpbpvguPPYqn0%2FTrEQMGIth2UPBU2dubcx1lm7hbPW9xKaOphhLWkDUqwgrd9%2FHLM5fz2I3Y2tHMNf%2B%2BdRo4OuJwIAA%3D&OSSAccessKeyId=STS.NZgKw78JzU8qXqqh5yy4X1uS8&Expires=1756952702&Signature=o7sFfSIL3l4VOas23jUF2GlZuD0%3D",
                            "type": "raw",
                            "url": "https://ai-designer-comfyui.cn-zhangjiakou.oss.aliyuncs.com/homelab_output/HomeLab_1756347902_73e867d2-0419-4752-923c-09978368d3af.png?security-token=CAISyQJ1q6Ft5B2yfSjIr5nSAM2D1ZVb4vqaWlfAjDUsdbt03rD42jz2IHhMfHZhA%2B4dtv4%2BmmpX6f8clqJzTJpIQUXOKMxr9cySVcQ9hdGT1fau5Jko1beHewHKeTOZsebWZ%2BLmNqC%2FHt6md1HDkAJq3LL%2Bbk%2FMdle5MJqP%2B%2FUFB5ZtKWveVzddA8pMLQZPsdITMWCrVcygKRn3mGHdfiEK00he8Tohtfvgk5PBukOG0wagm7Yvyt6vcsT%2BXa5FJ4xiVtq55utye5fa3TRYgxowr%2F8u1PMVo2mc5ovMXQMOvEzYKZDV8tpqIUpyb7M3Xq5DqfX4nPdoWQc5MHRKVXynVMMisES3LOjIqKOsk2N8pF0igm%2BDJG471P6FAIvInRXlnR50z%2FuygjPo%2B5Kh2PHho%2BAr62Z%2BIZ0jCOzZKNduqEpdivLYUZhco7LiTxqAAXNqcqTDm353EP4klS486SE6ULUWZl0pjU4eIb7v%2FlOrFAS3kvCG214WhPZ3CO2vEYQ7p80ih%2BCb20%2BYTRqSMpbpvguPPYqn0%2FTrEQMGIth2UPBU2dubcx1lm7hbPW9xKaOphhLWkDUqwgrd9%2FHLM5fz2I3Y2tHMNf%2B%2BdRo4OuJwIAA%3D&OSSAccessKeyId=STS.NZgKw78JzU8qXqqh5yy4X1uS8&Expires=1756952702&Signature=o7sFfSIL3l4VOas23jUF2GlZuD0%3D",
                            "subfolder": ""
                        }
                    ],
                    "urls": [
                        "https://ai-designer-comfyui.cn-zhangjiakou.oss.aliyuncs.com/homelab_output/HomeLab_1756347902_73e867d2-0419-4752-923c-09978368d3af.png?security-token=CAISyQJ1q6Ft5B2yfSjIr5nSAM2D1ZVb4vqaWlfAjDUsdbt03rD42jz2IHhMfHZhA%2B4dtv4%2BmmpX6f8clqJzTJpIQUXOKMxr9cySVcQ9hdGT1fau5Jko1beHewHKeTOZsebWZ%2BLmNqC%2FHt6md1HDkAJq3LL%2Bbk%2FMdle5MJqP%2B%2FUFB5ZtKWveVzddA8pMLQZPsdITMWCrVcygKRn3mGHdfiEK00he8Tohtfvgk5PBukOG0wagm7Yvyt6vcsT%2BXa5FJ4xiVtq55utye5fa3TRYgxowr%2F8u1PMVo2mc5ovMXQMOvEzYKZDV8tpqIUpyb7M3Xq5DqfX4nPdoWQc5MHRKVXynVMMisES3LOjIqKOsk2N8pF0igm%2BDJG471P6FAIvInRXlnR50z%2FuygjPo%2B5Kh2PHho%2BAr62Z%2BIZ0jCOzZKNduqEpdivLYUZhco7LiTxqAAXNqcqTDm353EP4klS486SE6ULUWZl0pjU4eIb7v%2FlOrFAS3kvCG214WhPZ3CO2vEYQ7p80ih%2BCb20%2BYTRqSMpbpvguPPYqn0%2FTrEQMGIth2UPBU2dubcx1lm7hbPW9xKaOphhLWkDUqwgrd9%2FHLM5fz2I3Y2tHMNf%2B%2BdRo4OuJwIAA%3D&OSSAccessKeyId=STS.NZgKw78JzU8qXqqh5yy4X1uS8&Expires=1756952702&Signature=o7sFfSIL3l4VOas23jUF2GlZuD0%3D"
                    ]
                },
                "class": "com.taobao.ihome.aigc.resource.dto.homelab.OutputNode",
                "key": "output"
            }
        }
    }
}
```