### Icon 组件用法

```tsx
import { Icon } from '@ss/mtd-react3'

// 基础用法
<Icon type="search" />
<Icon type="bell" style={{ fontSize: 18, color: '#ff6900' }} />
<Icon type="setting-fill" style={{ fontSize: 16 }} />
```

### Button 内嵌图标

```tsx
// icon prop 直接传图标名（与 Icon type 相同）
<Button icon="add">新建</Button>
<Button icon="search" type="primary">搜索</Button>
<Button shape="circle" icon="more" size="small" type="text" />
<Button shape="circle" icon="delete" size="small" type="text" />
<Button shape="circle" icon="edit" size="small" type="text" />
<Button shape="circle" icon="setting" size="small" type="text" />
```

### 完整图标名称速查（共 565 个，以下为常用分类）

**通用操作：** `add` / `add-circle` / `add-thick` / `delete` / `delete-o` / `edit` / `edit-o` / `copy` / `copy-o` / `search` / `filter` / `filter-o` / `refresh` / `refresh-o` / `download-o` / `upload-cloud-o` / `upload-cloud-fill` / `export-o` / `import-export-o` / `save` / `save-o` / `undo` / `undo-o` / `redo` / `close` / `close-thick` / `check` / `check-bold` / `check-thick` / `minus` / `more` / `more-circle` / `more-circle-fill` / `ellipsis` / `sort` / `sort-up-and-down-o`

**方向/箭头：** `arrow-up` / `arrow-down` / `arrow-left` / `arrow-right` / `up` / `down` / `left` / `right` / `up-thick` / `down-thick` / `left-thick` / `right-thick` / `triangle-up` / `triangle-down` / `triangle-left` / `triangle-right` / `fast-upword` / `fast-downword` / `fast-forward` / `fast-backward` / `top`

**状态/反馈：** `success-circle` / `success-circle-thick` / `success-o` / `error` / `error-circle` / `error-o` / `warning` / `warning-circle` / `warning-circle-o` / `warning-triangle-fill` / `warning-triangle-o` / `info-circle` / `info-circle-o` / `question-circle` / `question-circle-o` / `question-mark` / `fail` / `loading` / `loading-thick`

**导航/布局：** `home` / `home-o` / `menu-point` / `menus-o` / `collapse` / `expand` / `list-view` / `cards-view` / `compactview` / `cardview` / `table` / `table-fill` / `toc` / `folder` / `folder-fill` / `folder-list` / `folder-list-fill`

**用户/账号：** `avatar-fill` / `avatar-o` / `avatar-add` / `avatar-add-fill` / `avatar-group` / `avatar-group-fill` / `customer` / `customer-o` / `contacts` / `contacts-fill` / `id-card` / `id-card-fill` / `lock-fill` / `lock-o` / `unlock` / `unlock-fill` / `log-out`

**通知/消息：** `bell` / `bell-o` / `bell-slash-fill` / `unbell` / `comment` / `comment-fill` / `comment-o` / `comment-q-fill` / `comment-write` / `mail-fill` / `mail-o` / `at` / `message-r-point` / `message-s-point` / `badge` / `badge-fill`

**文件/文档：** `file` / `file-fill` / `file-o` / `file-add` / `file-add-o` / `file-export` / `file-export-fill` / `file-import` / `file-import-fill` / `file-send` / `file-send-fill` / `file-warning` / `file-warning-fill` / `filebox-o` / `annex` / `page-fill` / `page-o` / `page-lookup` / `page-lookup-fill`

**数据/图表：** `bar-chart` / `bar-chart-fill` / `barschart` / `barschart-o` / `areachart` / `areachart-o` / `piechart` / `piechart-o` / `funnel-chart` / `funnel-chart-fill` / `hierarchy-fill` / `hierarchy-o` / `mindmap-o` / `flowchart-o` / `database-fill` / `database-o`

**设置/工具：** `setting` / `setting-fill` / `slider-settings` / `filter` / `filter-o` / `custom` / `theme` / `theme-o` / `paint` / `ruler-pen` / `ruler-pen-o` / `broom` / `calculator` / `calculator-o` / `code` / `code-on` / `code-off`

**时间/日历：** `calendar` / `calendar-o` / `time` / `time-o` / `time-countdown-o` / `schedule` / `schedule-fill` / `history` / `clock-lightning`

**位置/地图：** `location` / `location-o` / `location-circle-o` / `location-point-o` / `map` / `map-fill` / `floor` / `floor-fill`

**商业/电商：** `cart` / `cart-fill` / `cart-o` / `shoppingcart-add` / `shoppingcart-add-fill` / `bag` / `bag-fill` / `price` / `price-fill` / `coupon` / `couponpackage` / `redpacket` / `wallet` / `money-circle` / `money-circle-fill` / `bank-card` / `bank-card-fill` / `bankcard` / `bill` / `bill-fill` / `invoice` / `invoice-fill` / `invoice-o` / `cashier` / `cashier-fill` / `refund` / `renewal` / `delivery-order` / `delivery-order-fill` / `truck-fill`

**媒体/内容：** `picture` / `picture-fill` / `picture-square` / `picture-square-fill` / `video` / `video-fill` / `camera` / `camera-fill` / `play` / `play-fill` / `volume` / `volume-fill` / `volume-slash` / `microphone` / `microphone-slash` / `image` (用 `picture`)

**社交/分享：** `share` / `share-o` / `share-arrow` / `share-arrow-fill` / `like` / `like-fill` / `dislike` / `dislike-fill` / `star` / `star-o` / `star-half` / `fabulous` / `fabulous-fill` / `comment` / `comment-fill`

**安全/权限：** `shield` / `shield-fill` / `shield-star` / `shield-star-fill` / `shield-success` / `shield-success-fill` / `shield-warning` / `shield-warning-fill` / `lock-fill` / `lock-o` / `unlock` / `unlock-fill`

**打印/设备：** `printing` / `printing-fill` / `monitor` / `monitor-fill` / `phone` / `telephone` / `telephone-fill` / `keyboard` / `qrcode` / `barcode`

**其他常用：** `link` / `link-o` / `link2` / `unlink` / `unlink-o` / `globe` / `wifi-fill` / `wifi-o` / `wifi-slash-fill` / `bolt` / `bolt-fill` / `flame` / `flame-fill` / `trophy` / `trophy-fill` / `education` / `education-fill` / `lab-o` / `research` / `cooperation` / `cooperation-fill` / `feedback` / `review` / `review-fill` / `read` / `note` / `note-fill` / `label` / `tag` (用 `label`) / `form` / `template` / `instructions` / `instructions-fill`

**使用规则：**
- `Icon type` 和 `Button icon` 均填写上方列表中的名称（不含 `icon-` 前缀）
- 带 `-fill` 后缀为实心版，带 `-o` 后缀为线框版，无后缀通常为默认版
- 若某图标有 `-fill`（实心）和 `-o`（线框）两个版本，根据视觉需要选择合适的版本；**同一页面/同一功能区域内必须统一风格，禁止实心与线框混用**
- 若需要的图标不在列表中，选择语义最接近的替代图标，**绝对不能用 emoji 代替**
- 图标大小通过 `style={{ fontSize: N }}` 控制，颜色通过 `style={{ color: '...' }}` 控制
