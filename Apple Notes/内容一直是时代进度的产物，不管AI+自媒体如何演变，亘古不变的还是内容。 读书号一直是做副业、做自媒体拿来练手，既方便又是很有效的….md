[[a4086be4-da8e-11ed-aeb8-00163e0b5ff3.png.webp]]

内容一直是时代进度的产物，不管AI+自媒体如何演变，亘古不变的还是内容。 读书号一直是做副业、做自媒体拿来练手，既方便又是很有效的内容。
**分享coze工作流**
**制作炫酷开头书本解说，实现只需要输入书名，就拿到视频解说的剪映模板并生成图文并茂带有动效视频。**
# **步骤工作流**
1. 拆书解文案
2. 配音+字幕对齐并组合
3. 剪映小助手获得模板

[[fc3eae64-aac9-11f0-9e45-00163e4b86a1.jpg.webp]]

## **拆书解文案**
步骤1开始-输入书名

[[58dc678c-30e3-11ee-88e7-00163e0b5ff3.png.webp]]

<a href="https://ke.qidianla.com/courses/bcpm" rel="noopener" class="external-link" target="_blank"><b><u>产品经理如何做好B端数字化？</u></b></a>
<a href="https://ke.qidianla.com/courses/bcpm" rel="noopener" class="external-link" target="_blank"><u>各行各业都搭上了数字化转型的顺风车，实现了行业的迅速发展。由于B端产品是为企业所提供服务的产品，那么，企业应该如何乘上数字化的顺风车呢？</u></a>
<a href="https://ke.qidianla.com/courses/bcpm" rel="noopener" class="external-link" target="_blank"><u>查看详情 ></u></a>

[[a780459c-ab03-11f0-af85-00163e09d72f.png.webp]]


[[a780459c-ab03-11f0-af85-00163e09d72f.png 1.webp]]

步骤2 插件**豆瓣搜书**

[[ae78308a-ab03-11f0-8682-00163e09d72f.png.webp]]

步骤3 书名+作者文本处理

[[b4778aa8-ab03-11f0-af85-00163e09d72f.png.webp]]

步骤4 开场白文案文本处理

[[b9f81768-ab03-11f0-af85-00163e09d72f.png.webp]]

步骤5开场白配音语音合成
音色可以根据自己需要做变动

[[c327b410-ab03-11f0-82d2-00163e09d72f.png.webp]]

步骤6获取开场白时长-插件获取音频时长

[[ce3e63bc-ab03-11f0-af85-00163e09d72f.png.webp]]

步骤7计算时长
代码-

[[d7dc885e-ab03-11f0-af85-00163e09d72f.png.webp]]

Python语句
async def main(args: Args) -> Output:
params = args.params
duration = params\[‘duration’\]
audios = \[\]
audios.append({
“audio_url”: params\[‘link’\],
“duration”: int(duration * 1000000),
“start”: 0,
“end”: int(duration * 1000000),
})
# 开场白后增加1s间隔
ret: Output = {
“audios”: audios,
“duration”: int(duration * 1000000),
“next_duration”: int(duration * 1000000) + 1000000,
}
return ret
步骤8书单图片提示词
大模型-

[[df968b3a-ab03-11f0-af85-00163e09d72f.png.webp]]


[[ec853b84-ab03-11f0-82d2-00163e09d72f.png.webp]]

– 系统提示词
＃角色
你是一个AI绘画提示词生成专家。请根据用户提供的书籍《{{book_name}}》，生成一段符合Midjourney规范的插图画面描述。
＃核心要求
1. 内容与风格：描述必须忠实于书籍的内容、时代背景和核心氛围，并体现其文学风格（如哥特式、浪漫主义、存在主义等）。
2. 艺术风格：需指定一种或多种艺术风格（如炭笔画、水墨、暗调摄影、蚀刻版画等），以强化书籍的基调。
3. 色彩约束：画面必须避免使用亮色和红色。优先使用低饱和度、单色、柔和或深沉的色调。
＃输出格式
直接输出纯净、连贯的Midjourney提示词，无需额外解释。提示词应包含画面主体、环境、光影、氛围及技术参数。
步骤9生成书单图片
图像生成-

[[170db5fc-ab04-11f0-af85-00163e09d72f.png.webp]]

步骤10书单文案
大模型-

[[595ad764-ab04-11f0-af85-00163e09d72f.png.webp]]


[[31a7e14e-ab04-11f0-af85-00163e09d72f.png.webp]]

– 提示词
#角色:你是一位专业的书评作家，擅长以精炼、生动且有深度的语言，向读者介绍书籍的核心价值与独特魅力。
# 技能:
基于用户指定的书籍《{{book_name}}》，生成一篇结构完整、内容深刻的书评。
# 书评要求
1.内容风格: 使用第三人称和口语化表达，确保语言流畅自然，观点鲜明;2.金句引用: 每个核心观点中须至少嵌入一句书中原文作为支撑;
3.结构规范:
(1)开篇直接切入主题，不设引言或铺垫;
(2)围绕三个核心观点展开，每段观点内容不少于100字，不超过200字;
(3)避免使用’第一个观点’、’第二个观点’等刻板表述，改用自然过渡;
(4)文未需有简要总结，并附上引导读者进一步行动的语句;
# 限制
书评内容中每句话≤15个字(不包含标点符号);
示例:
“今天星期五，明天可以休息啦。”中“今天是星期五，”算作一句话:
# 输出格式
书评内容
用户提示词 ①
步骤11分割文案文本处理

[[5ffc2ef6-ab04-11f0-af85-00163e09d72f.png.webp]]

步骤12循环配音-节点

[[65625514-ab04-11f0-82d2-00163e09d72f.png.webp]]

步骤12.1 判断是否为空
选择器

[[6b931ae0-ab04-11f0-82d2-00163e09d72f.png.webp]]

步骤12.2 分句

[[7a816d7c-ab04-11f0-af85-00163e09d72f.png.webp]]

import re
async def main(args: Args) -> Output:
params = args.params
pattern = r'\[,，.。！？；：-\]\s*’
content = params\[‘content’\]
# 通过分隔符分割数组 sentences = re.split(pattern, content)
str_list = \[\]
for s in sentences:
# 去除中英文单引号、双引号、换行符
s = re.sub(r'\[\'””‘’“”\n\]’, ”, s)
# 跳过空串
if not s:
continue
s = s.replace(‘——’, ‘，’)
s = s.replace(‘、’, ‘，’)
str_list.append(s)
ret: Output = {
“sentence_list”: “\n”.join(str_list)
}
return ret
步骤12.3 继续循环

[[8e61c5b2-ab04-11f0-82d2-00163e09d72f.png.webp]]

步骤12.4 视频文案配音
语音合成

[[9476cca4-ab04-11f0-af85-00163e09d72f.png.webp]]

步骤12.5 字幕音频对齐
搜索插件字幕音频自动对齐

[[9d86242a-ab04-11f0-82d2-00163e09d72f.png.webp]]

步骤12.6 素材组合
代码

[[a9281d06-ab04-11f0-af85-00163e09d72f.png.webp]]

async def main(args: Args) -> Output:
params = args.params
# 中间变量
pre_time = params\[‘pre_time’\]
captions = params\[‘caption_list’\]
audios = params\[‘audio_list’\]
# 循环变量
timelines = params\[‘timelines’\]
audio = params\[‘audio’\]
texts = params\[‘texts’\]
duration = params\[‘duration’\]
# 添加基本验证
if not timelines or not texts:
return {
“captions”: captions,
“audios”: audios,
“end_time”: pre_time
}
# 确保两个列表长度一致
min_length = min(len(timelines), len(texts))
if len(timelines) != len(texts):
print(f”警告：timelines长度({len(timelines)})与texts长度({len(texts)})不一致”)
audios.append({
“audio_url”: audio,
“duration”: int(duration),
“start”: pre_time,
“end”: pre_time + int(duration),
})
# 设置字幕时长
each_pause_duration = 0
length = len(timelines)
if length > 1:
pause_duration = int(duration) – int(timelines\[-1\]\[‘end’\] – timelines\[0\]\[‘start’\]) – timelines\[0\]\[‘start’\]
each_pause_duration = max(0, int(pause_duration / (length – 1))) # 确保不为负数
for i in range(min_length): # 使用min_length而不是直接使用timelines
time = timelines\[i\]
start_time = int(pre_time + time\[‘start’\])
end_time = int(pre_time + time\[‘end’\])
if i != 0:
start_time += each_pause_duration * i
end_time += each_pause_duration * i
caption = {
‘text’: texts\[i\], # 现在确保i不会越界
‘start’: start_time,
‘end’: end_time,
}
captions.append(caption)
ret = {
“captions”: captions,
“audios”: audios,
“end_time”: pre_time + int(duration)
}
return ret
**步骤12.7 设置变量**
变量

[[b8b8f5e2-ab04-11f0-82d2-00163e09d72f.png.webp]]

到此循环体的节点就结束了。

[[be7b5696-ab04-11f0-af85-00163e09d72f.png.webp]]

步骤13 获取所有变量
代码-

[[cbe52a96-ab04-11f0-af85-00163e09d72f.png.webp]]

import json
async def main(args: Args) -> Output:
params = args.params
# 获取输入参数
width = params\[‘width’\]
height = params\[‘height’\]
pre_time = params\[‘pre_time’\]
audios = params\[‘audio_list’\]
cover_img = params\[‘cover_img’\]
background_img = params\[‘background_img’\]
# 开场白时长
audio_duration = params\[‘audio_duration’\]
top_title = params\[‘top_title’\]
title_captions = \[\]
title_captions.append({
‘text’: params\[‘title’\],
‘start’: audio_duration + 1000000,
‘end’: pre_time,
“in_animation”: “缩小”,
“in_animation_duration”: 2000000
})
top_captions = \[\]
top_captions.append({
‘text’: top_title,
‘start’: audio_duration + 1000000,
‘end’: pre_time,
“in_animation”: “渐显”,
“in_animation_duration”: 1000000
})
# 添加翻书声音和背景乐
bgm_audios = \[\]
bgm_audios.append({
“audio_url”: “https://houht.oss-cn-shanghai.aliyuncs.com/public/booklist/book.MP3”,
“duration”: 2000000,
“start”: 0,
“end”: 2000000
})
bgm_audios.append({
“audio_url”: “https://ve-template-0920.oss-cn-shanghai.aliyuncs.com/uploads/1747213706549_bzwh21eozgv.mp3”,
“duration”: pre_time – 2000000,
“start”: 2000000,
“end”: pre_time,
“volume”: 0.7
})
# 增加开场封面和背景图片的入场动画和转场特效
images1 = \[\]
images2 = \[\]
# 开场白时长+1.5秒 后开始转场特效“中心切开”，持续一秒
images1.append({
“image_url”: cover_img,
“width”: 768,
“height”: 1024,
“start”: 0,
“end”: audio_duration + 1500000,
“transition”: “中心切开”,
“transition_duration”: 1000000
})
# 开场白时长+1秒 后开始动画“翻书”，持续一秒
images2.append({
“image_url”: cover_img,
“width”: 768,
“height”: 1024,
“start”: 0,
“end”: audio_duration + 1000000,
“in_animation”: “翻书”,
“in_animation_duration”: audio_duration,
“transition”: “中心切开”,
“transition_duration”: 1000000
})
images2.append({
“image_url”: background_img,
“width”: width,
“height”: height,
“start”: audio_duration + 1000000,
“end”: pre_time
})
# 添加视频特效
effects1 = \[\]
effects1.append({
“effect_title”: “模糊开幕”,
“start”: 0,
“end”: audio_duration + 1000000,
})
effects2 = \[\]
effects2.append({
“effect_title”: “星火”,
“start”: audio_duration + 1000000,
“end”: pre_time,
})
# 构建输出对象
ret = {
“captions”: json.dumps(params\[‘caption_list’\]),
“audios”: json.dumps(audios),
“bgm_audios”: json.dumps(bgm_audios),
“images1”: json.dumps(images1),
“images2”: json.dumps(images2),
“effects1”: json.dumps(effects1),
“effects2”: json.dumps(effects2),
“title_captions”: json.dumps(title_captions),
“top_captions”: json.dumps(top_captions)
}
return ret
步骤14 视频合成-剪映小助手10个节点

[[dac8bef6-ab04-11f0-8fba-00163e09d72f.png.webp]]

**步骤14.1 创建剪映草稿**
视频合成_剪映小助手create_draft

[[e3caa17c-ab04-11f0-af85-00163e09d72f.png.webp]]

**步骤14.2 背景音乐**
视频合成_剪映小助手add_audios

[[f082cc64-ab04-11f0-af85-00163e09d72f.png.webp]]

**步骤14.3 文案配音**
视频合成_剪映小助手add_audios

[[f7a53478-ab04-11f0-af85-00163e09d72f.png.webp]]

**步骤14.4 开场图片1**
视频合成_剪映小助手add_images

[[04538fda-ab05-11f0-af85-00163e09d72f.png.webp]]

**步骤14.5 开场图片2**
视频合成_剪映小助手add_images

[[0d05cef4-ab05-11f0-af85-00163e09d72f.png.webp]]

**步骤14.6 开场迷糊特效**
视频合成_剪映小助手add_effects

[[12a84c7e-ab05-11f0-af85-00163e09d72f.png.webp]]

**步骤14.7 星火特效**
视频合成_剪映小助手add_effects

[[1a8c1b6e-ab05-11f0-82d2-00163e09d72f.png.webp]]

**步骤14.8 添加书名**
视频合成_剪映小助手add_captions

[[20ce6aea-ab05-11f0-af85-00163e09d72f.png.webp]]

**步骤14.9 添加字幕**
视频合成_剪映小助手add_captions

[[2e514cdc-ab05-11f0-af85-00163e09d72f.png.webp]]

**步骤14.10 添加顶部标题**
视频合成_剪映小助手add_captions

[[36cd988e-ab05-11f0-af85-00163e09d72f.png.webp]]

步骤14 结束

[[3d5958e6-ab05-11f0-af85-00163e09d72f.png.webp]]

步骤15 试运行

[[4609fb26-ab05-11f0-82d2-00163e09d72f.png.webp]]

步骤16 剪映小助手
**– https://www.51aigc.cc/#/cozeToJianyin**

[[4b08715c-ab05-11f0-8fba-00163e09d72f.png.webp]]

步骤16 剪映展示

[[502bf474-ab05-11f0-8fba-00163e09d72f.png.webp]]

本次分享就到这里了，我是陌晨，分享有用的AI知识与工具，喜欢记得关注。