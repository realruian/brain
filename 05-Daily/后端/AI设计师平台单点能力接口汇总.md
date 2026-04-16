# AI设计师平台单点能力接口汇总

# 图像能力

灰色文字  表示非常不推荐，但可作为兜底

蓝色文字  表示接口在idealab中提供

~~划线文字~~  表示无法接入或者接入难度巨大

黑色文字  表示正在接入，还没有拿到

红色文字  表示需要自己搭建工作流和服务

| 板块 | 所需能力 | 方案1 | 方案2 | 方案3 | 方案4 | 建议 |
| --- | --- | --- | --- | --- | --- | --- |
| 自由模式 | 文生图 | gpt-image-1 | 火山 Seedream 3.0 |  |  | 火山 Seedream 3.0 |
|  | 图生图 | gpt-image-1-edit | 火山 SeedEdit 3.0 |  |  | 火山 SeedEdit 3.0 |
| 图片编辑 | 高清放大 | ComfyUI工作流 | 千牛接口 | ~~火山 Upscale~~ |  | 千牛接口 |
|  | 局部重绘 | gpt-image-1-edit | Flux Fill | 千牛接口 | ~~火山 Inpainting~~ | 千牛接口 |
|  | 扩图 | Flux Kontext | 千牛接口 | ~~火山 Outpainting~~ |  | 千牛接口 |
|  | AI滤镜 | gpt-image-1-edit | 火山 SeedEdit 3.0 | Flux + Lora |  | 火山 SeedEdit 3.0 |
|  | AI证件照 | ComfyUI工作流 | Flux Kontext | 火山 SeedEdit 3.0 | gpt-image-1-edit | ComfyUI工作流 |
|  | AI证件照（二次修改） | Flux Fill | Flux Kontext Dev | 火山 SeedEdit 3.0 | gpt-image-1-edit | 火山 SeedEdit 3.0 |
|  | 最美工牌照片 | ComfyUI工作流 | Flux Kontext Dev | 火山 SeedEdit 3.0 | gpt-image-1-edit | 待测 |
|  | 最美工牌照片（二次修改） | Flux Fill | Flux Kontext Dev | 火山 SeedEdit 3.0 | gpt-image-1-edit | 待测 |
|  | 宠物证件照 | ComfyUI工作流 | Flux Kontext Dev | 火山 SeedEdit 3.0 | gpt-image-1-edit | 待测 |
|  | 宠物证件照（二次修改） | Flux Fill | Flux Kontext Dev | 火山 SeedEdit 3.0 | gpt-image-1-edit | 待测 |
|  | 抠图 | ComfyUI工作流 | 千牛接口 |  |  | 千牛接口 |
|  | AI表情包 | gpt-image-1-edit | 火山 SeedEdit 3.0 |  |  | gpt-image-1-edit |
| 模版模式<br>（对单点能力进行组合） | 商品海报/频道版头/手淘资源位 | ComfyUI工作流+火山 SeedEdit 3.0+火山 Seedream 3.0+扩图 |  |  |  |  |