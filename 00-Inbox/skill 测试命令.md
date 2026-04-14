python3 scripts/from_json.py case1.json 2>/dev/null   # 早餐·美好的一天从暖胃早餐开始
python3 scripts/from_json.py case2.json 2>/dev/null   # 早餐·周末brunch不出门
python3 scripts/from_json.py case3.json 2>/dev/null   # 午餐·轻盈一点好吃一点
python3 scripts/from_json.py case4.json 2>/dev/null   # 午餐·换个口味小众好吃安排上
python3 scripts/from_json.py case5.json 2>/dev/null   # 晚餐·闺蜜拼单外卖
python3 scripts/from_json.py case6.json 2>/dev/null   # 下午茶·续命必备这杯奶茶必须点
python3 scripts/from_json.py case7.json 2>/dev/null   # 下午茶·三点不甜哪有心情上班

全部跑
for f in case{1..7}.json; do python3 scripts/from_json.py $f 2>/dev/null & done


图像中不要出现提示词中没有的多余的物品，有几个出几个
图像中的物品不要太贴边 