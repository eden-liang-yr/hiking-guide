import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Insert trails
await connection.execute(`DELETE FROM tour_groups`);
await connection.execute(`DELETE FROM reviews`);
await connection.execute(`DELETE FROM trails`);

const trails = [
  // ===== 新手线路 =====
  {
    name: "西湖环湖步道",
    slug: "xihu-lake-trail",
    difficulty: "beginner",
    region: "华东",
    province: "浙江",
    duration: "1天",
    distance: "15km",
    elevation: "最高海拔200m",
    bestSeason: "全年皆宜，春秋最佳（3-5月、9-11月）",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    summary: "西湖环湖步道是杭州最经典的城市徒步路线，全程沿湖而行，将断桥残雪、苏堤春晓、雷峰夕照等十景尽收眼底。路面平坦，适合全年龄段徒步爱好者，是新手入门的绝佳选择。",
    highlights: JSON.stringify(["断桥残雪观景", "苏堤六桥漫步", "雷峰塔日落", "灵隐寺文化体验", "茶园采摘体验"]),
    equipment: JSON.stringify(["舒适运动鞋", "防晒霜", "雨伞或雨衣", "水壶（1L）", "轻便背包", "相机"]),
    transportation: "高铁至杭州东站，地铁1号线至龙翔桥站，步行5分钟至断桥起点。自驾可停西湖周边停车场（建议早到，节假日较拥挤）。",
    accommodation: "西湖周边酒店众多，价格区间广。推荐住在湖滨路或南山路一带，步行即可抵达起点。民宿可选河坊街附近，体验老杭州风情。",
    costMin: 100,
    costMax: 300,
    pros: JSON.stringify(["路线平坦无难度，老少皆宜", "景点密集，文化底蕴深厚", "交通便利，配套设施完善", "全年可走，选择灵活"]),
    cons: JSON.stringify(["节假日游客极多，体验感下降", "部分路段商业化较重", "停车较困难"]),
    culturalBackground: "西湖自古便是文人墨客的精神家园，白居易、苏轼均曾主政杭州并留下千古名篇。\"欲把西湖比西子，淡妆浓抹总相宜\"道尽西湖之美。西湖文化景观于2011年被列入世界遗产名录，是中国唯一以湖泊为主体的世界文化遗产。",
    tips: "建议清晨6-7点出发，避开人流高峰。春季赏花需提前预约灵隐寺门票。雨天西湖别有韵味，备好雨具即可出行。",
    avgRating: 4.5,
    reviewCount: 128,
    featured: true,
  },
  {
    name: "黄山云谷寺-白鹅岭步道",
    slug: "huangshan-yungu-trail",
    difficulty: "beginner",
    region: "华东",
    province: "安徽",
    duration: "1天",
    distance: "8km",
    elevation: "最高海拔1690m",
    bestSeason: "4-11月，秋季（9-11月）云海最佳",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    summary: "黄山云谷寺至白鹅岭步道是黄山最适合新手的路线之一，可乘缆车上山后步行游览，沿途奇松怪石、云海佛光令人叹为观止。路程适中，景色震撼，是感受黄山精髓的入门之选。",
    highlights: JSON.stringify(["迎客松近距离观赏", "云海日出", "奇松怪石", "黄山温泉", "北海景区全景"]),
    equipment: JSON.stringify(["防滑登山鞋", "保暖外套（山顶温差大）", "雨衣", "登山杖（可租）", "防晒用品", "充足饮水"]),
    transportation: "高铁至黄山北站，大巴至汤口镇（约1小时），再乘景区大巴至云谷寺缆车站。自驾可直达汤口镇停车场。",
    accommodation: "山上有多家宾馆（西海饭店、白云宾馆等），价格较高（500-1500元/晚）。山下汤口镇住宿选择丰富，价格实惠（200-500元/晚）。",
    costMin: 400,
    costMax: 1200,
    pros: JSON.stringify(["可乘缆车减轻体力消耗", "景色世界级，震撼人心", "配套设施完善", "适合新手挑战"]),
    cons: JSON.stringify(["旺季人流量大，需提前订票", "山上住宿价格偏高", "天气多变，云海可遇不可求"]),
    culturalBackground: "黄山古称\"黟山\"，因传说轩辕黄帝在此炼丹升仙而更名。徐霞客两登黄山后感叹\"五岳归来不看山，黄山归来不看岳\"。黄山以\"奇松、怪石、云海、温泉\"四绝著称，1990年被列入世界自然与文化双遗产。",
    tips: "云海出现需特定气象条件，建议关注天气预报。山顶温度比山下低10-15℃，务必携带保暖衣物。旺季需提前1-2周预订门票和住宿。",
    avgRating: 4.7,
    reviewCount: 256,
    featured: true,
  },
  {
    name: "成都青城山前山环线",
    slug: "qingcheng-mountain-trail",
    difficulty: "beginner",
    region: "西南",
    province: "四川",
    duration: "1天",
    distance: "10km",
    elevation: "最高海拔1260m",
    bestSeason: "全年皆宜，春夏（3-8月）最佳",
    coverImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    summary: "青城山前山是道教圣地，林木葱郁、清幽宁静，步道修缮完善，沿途道观古朴，溪流潺潺。全程爬升不大，适合家庭出游和徒步新手，是感受道家文化与自然山林的绝佳去处。",
    highlights: JSON.stringify(["天师洞道教文化", "上清宫山顶全景", "古木参天森林浴", "道家美食体验", "索道观景"]),
    equipment: JSON.stringify(["运动鞋或轻型登山鞋", "雨衣（山区多雨）", "防虫喷雾", "水壶", "零食补给"]),
    transportation: "成都地铁4号线至青城山站，再乘景区大巴。高铁可至都江堰站，打车约20分钟。自驾走成灌高速，青城山出口。",
    accommodation: "山脚下泰安古镇有多家民宿和酒店，环境清幽，价格200-600元/晚。成都市区住宿选择更多，当日往返也可。",
    costMin: 200,
    costMax: 500,
    pros: JSON.stringify(["道教文化底蕴深厚", "空气清新，森林覆盖率高", "步道完善，安全性高", "距成都近，交通便利"]),
    cons: JSON.stringify(["山区多雨，晴天不稳定", "旺季人较多", "部分道观需另购门票"]),
    culturalBackground: "青城山是中国道教发祥地之一，东汉张道陵在此创立天师道，距今已有1900余年历史。\"青城天下幽\"与\"峨眉天下秀\"并称，2000年与都江堰一同被列入世界文化遗产。山中保存有大量道教建筑，是研究道教文化的重要场所。",
    tips: "建议上午9点前进山，避开人流高峰。山区气候多变，即使晴天也要备雨衣。道观内有素斋，可体验道家饮食文化。",
    avgRating: 4.3,
    reviewCount: 89,
    featured: false,
  },

  // ===== 中阶线路 =====
  {
    name: "张家界天门山穿越",
    slug: "tianmen-mountain-trail",
    difficulty: "intermediate",
    region: "华中",
    province: "湖南",
    duration: "2天1夜",
    distance: "25km",
    elevation: "最高海拔1518m",
    bestSeason: "4-6月、9-11月",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    summary: "天门山穿越是张家界最具挑战性的中阶线路，从山脚徒步至天门洞，再沿玻璃栈道俯瞰万丈深渊。沿途奇峰林立，云雾缭绕，是感受张家界\"阿凡达\"般奇幻地貌的最佳方式。",
    highlights: JSON.stringify(["天门洞奇观（世界最高天然石拱门）", "玻璃栈道极限体验", "鬼谷栈道悬崖漫步", "云雾中的奇峰", "索道俯瞰全景"]),
    equipment: JSON.stringify(["中帮登山鞋（防滑必备）", "登山杖", "防风防雨冲锋衣", "保暖层", "头灯", "急救包", "充足饮水和食物"]),
    transportation: "飞机或高铁至张家界荷花机场/张家界西站，市区打车至天门山索道站约20分钟。",
    accommodation: "山顶有天门山宾馆（价格较高，约800-2000元/晚），山下张家界市区住宿选择丰富（200-800元/晚）。建议住山下，第二天早起进山。",
    costMin: 600,
    costMax: 1800,
    pros: JSON.stringify(["景色极为震撼，世界级奇观", "玻璃栈道体验独特", "文化底蕴丰富（鬼谷子传说）", "适合中阶挑战"]),
    cons: JSON.stringify(["部分路段陡峭，需要一定体力", "旺季人流量大", "玻璃栈道有恐高风险", "天气影响较大"]),
    culturalBackground: "天门山古称\"云梦山\"，相传是鬼谷子修炼之地，战国时期著名谋略家苏秦、张仪均出自其门下。天门洞海拔1300米，高131.5米，宽57米，是世界上海拔最高的天然穿山溶洞，被誉为\"天门\"。",
    tips: "玻璃栈道限流，旺季需提前预约。恐高者慎选玻璃栈道路段。山顶温度较低，即使夏天也需备保暖衣物。建议两天行程，第一天上山游览，第二天下山。",
    avgRating: 4.6,
    reviewCount: 178,
    featured: true,
  },
  {
    name: "四姑娘山幺妹峰环线",
    slug: "siguniang-mountain-trail",
    difficulty: "intermediate",
    region: "西南",
    province: "四川",
    duration: "3天2夜",
    distance: "40km",
    elevation: "最高海拔4200m",
    bestSeason: "5-10月，7-9月高山花卉盛开",
    coverImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    summary: "四姑娘山幺妹峰环线是川西最经典的中阶徒步路线，穿越高山草甸、原始森林和冰川遗迹，近距离仰望幺妹峰（海拔6250m）雪峰。沿途高山花卉绚烂，牦牛成群，藏族文化浓郁。",
    highlights: JSON.stringify(["幺妹峰雪山近景", "高山草甸花海（7-8月）", "原始森林穿越", "藏族村寨文化体验", "冰川地貌景观"]),
    equipment: JSON.stringify(["防水登山鞋", "冲锋衣（防风防雨）", "保暖抓绒衣", "登山杖（必备）", "高原防晒霜SPF50+", "头灯", "睡袋（营地住宿）", "高原反应药物"]),
    transportation: "成都出发，大巴或自驾至日隆镇（约4-5小时）。成都西站有直达班车，约5小时。",
    accommodation: "日隆镇有多家客栈，价格150-400元/晚。线路中有营地，可选择帐篷露营（需自带装备或租借）。",
    costMin: 800,
    costMax: 2500,
    pros: JSON.stringify(["雪山近景震撼，摄影绝佳", "高山花卉种类丰富", "藏族文化体验真实", "难度适中，适合有一定基础者"]),
    cons: JSON.stringify(["海拔较高（4000m+），需适应高原", "天气多变，需做好防雨准备", "部分路段需要向导", "旺季需提前预订住宿"]),
    culturalBackground: "四姑娘山藏语称\"斯古拉\"，意为\"四个姑娘\"。当地藏族传说四座山峰是四位美丽姑娘的化身，守护着这片土地。该区域是嘉绒藏族的聚居地，保留有完整的藏族传统文化、建筑和宗教习俗。",
    tips: "出发前2-3天在成都适应高原（海拔500m），到达日隆镇（海拔3200m）后休息一天再出发。携带高原反应药物（红景天、高原安）。7-8月为最佳花期，但也是雨季，需做好防雨准备。",
    avgRating: 4.8,
    reviewCount: 203,
    featured: true,
  },
  {
    name: "武夷山天游峰-大王峰穿越",
    slug: "wuyi-mountain-trail",
    difficulty: "intermediate",
    region: "华东",
    province: "福建",
    duration: "2天1夜",
    distance: "20km",
    elevation: "最高海拔408m",
    bestSeason: "3-5月、9-11月",
    coverImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
    summary: "武夷山天游峰至大王峰穿越是体验丹霞地貌的经典中阶路线，沿九曲溪溯溪而上，攀登天游峰俯瞰全景，再挑战大王峰垂直岩壁。茶香弥漫，岩韵悠长，是茶文化与自然探索的完美结合。",
    highlights: JSON.stringify(["天游峰360度全景", "九曲溪竹筏漂流", "大王峰攀爬挑战", "岩茶产地参观", "悬棺文化探秘"]),
    equipment: JSON.stringify(["防滑登山鞋", "轻便冲锋衣", "登山杖", "防晒用品", "雨衣", "茶具（可选，品茶体验）"]),
    transportation: "高铁至武夷山东站，打车至景区约20分钟。也可乘大巴从福州、厦门出发，约3-4小时。",
    accommodation: "武夷山度假区有多家酒店，价格300-1500元/晚。推荐住在九曲溪附近，方便次日早起游览。",
    costMin: 500,
    costMax: 1500,
    pros: JSON.stringify(["丹霞地貌独特，景色优美", "茶文化体验丰富", "路线多样，可自由组合", "配套设施完善"]),
    cons: JSON.stringify(["旺季人流量大，需提前预约", "大王峰攀爬有一定难度", "部分路段需要体力储备"]),
    culturalBackground: "武夷山是朱子理学的发祥地，南宋大儒朱熹在此讲学40余年，留下了丰富的文化遗产。武夷岩茶（大红袍）是中国十大名茶之一，\"岩骨花香\"的独特风味源于丹霞地貌的特殊土壤。1999年武夷山被列入世界自然与文化双遗产。",
    tips: "大王峰攀爬路段较陡，需要手脚并用，恐高者慎选。九曲溪竹筏漂流需提前预约（旺季）。建议携带茶具，在山顶品一壶岩茶，别有风味。",
    avgRating: 4.4,
    reviewCount: 156,
    featured: false,
  },

  // ===== 高手线路 =====
  {
    name: "珠峰大本营徒步（EBC）",
    slug: "everest-base-camp-trail",
    difficulty: "advanced",
    region: "西藏",
    province: "西藏",
    duration: "14天",
    distance: "130km",
    elevation: "最高海拔5364m（大本营）",
    bestSeason: "4-5月、9-11月（避开雨季和严冬）",
    coverImage: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800&q=80",
    summary: "珠峰大本营徒步是全球最具挑战性的经典徒步路线之一，从西藏日喀则出发，穿越藏南高原，最终抵达世界之巅的大本营。沿途经过绒布寺、冰塔林，近距离仰望珠穆朗玛峰，是每位徒步高手的终极梦想。",
    highlights: JSON.stringify(["珠穆朗玛峰近景（世界最高峰）", "绒布寺（世界最高寺庙）", "冰塔林奇观", "藏族文化深度体验", "高原星空摄影", "日照金山奇景"]),
    equipment: JSON.stringify(["专业高山登山鞋", "四季睡袋（-20℃）", "高山帐篷", "冲锋衣+羽绒服", "高原防晒霜SPF100", "氧气瓶（备用）", "高原反应药物", "专业登山杖", "头灯+备用电池", "卫星电话（建议）", "GPS设备"]),
    transportation: "飞机至拉萨贡嘎机场，在拉萨适应3-5天，再乘车至日喀则（约5小时），办理边境证后前往珠峰保护区。",
    accommodation: "沿途有茶馆（Teahouse）提供住宿，条件简陋，价格50-200元/晚。大本营需自带帐篷或租借。",
    costMin: 8000,
    costMax: 25000,
    pros: JSON.stringify(["世界顶级徒步体验，终身难忘", "近距离仰望世界最高峰", "藏族文化深度沉浸", "高原星空极为壮观"]),
    cons: JSON.stringify(["高原反应风险高，需充分准备", "行程长，体力消耗极大", "天气变化剧烈，需灵活调整", "费用较高", "需要边境证等特殊许可"]),
    culturalBackground: "珠穆朗玛峰藏语意为\"大地之母\"，尼泊尔语称\"萨加玛塔\"。绒布寺建于1902年，是世界上海拔最高的寺庙（海拔5154m），供奉莲花生大师。沿途藏族村落保留着完整的传统文化，玛尼堆、经幡随处可见，是藏传佛教文化的活态展示。",
    tips: "必须在拉萨（海拔3650m）适应至少3-5天再出发。每天爬升不超过500m，\"爬高睡低\"原则。出现严重高原反应（头痛剧烈、呕吐、意识模糊）必须立即下撤。建议聘请有经验的藏族向导。",
    avgRating: 4.9,
    reviewCount: 87,
    featured: true,
  },
  {
    name: "贡嘎山东坡大环线",
    slug: "gongga-mountain-trail",
    difficulty: "advanced",
    region: "西南",
    province: "四川",
    duration: "10天",
    distance: "100km",
    elevation: "最高海拔4800m",
    bestSeason: "5-6月、9-10月",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    summary: "贡嘎山东坡大环线被誉为\"中国最美徒步路线\"之一，围绕\"蜀山之王\"贡嘎雪山（海拔7556m）东坡穿越，途经子梅垭口、贡嘎寺、燕子沟，集高山草甸、冰川、原始森林、藏族文化于一体。",
    highlights: JSON.stringify(["子梅垭口贡嘎雪山全景（最佳观景点）", "贡嘎寺藏传佛教文化", "燕子沟冰川近景", "高山草甸花海", "原始森林穿越", "藏族村寨夜宿"]),
    equipment: JSON.stringify(["专业登山鞋（防水高帮）", "四季睡袋", "帐篷", "冲锋衣+羽绒服", "登山杖（必备）", "高原防晒", "头灯", "急救包", "卫星通讯设备（建议）", "10天食物补给"]),
    transportation: "成都出发，大巴或自驾至泸定县（约4小时），再转车至磨西镇（约1小时）作为起点。",
    accommodation: "沿途有少量藏族民宿（100-300元/晚），部分路段需野营。建议携带帐篷，保证灵活性。",
    costMin: 3000,
    costMax: 8000,
    pros: JSON.stringify(["贡嘎雪山近景无与伦比", "路线多样性极高，景观丰富", "藏族文化体验真实深入", "中国最顶级徒步体验之一"]),
    cons: JSON.stringify(["难度极高，需要丰富徒步经验", "部分路段无明显标记，需向导", "天气变化剧烈", "补给点有限，需充分备粮"]),
    culturalBackground: "贡嘎山藏语意为\"洁白的雪山\"，是四川第一高峰，被称为\"蜀山之王\"。贡嘎寺建于1930年代，是藏传佛教宁玛派寺庙，保存有珍贵的唐卡和法器。沿途康定藏族（木雅藏族）文化独特，与西藏藏族有所不同，保留着更古老的传统。",
    tips: "必须有丰富的高海拔徒步经验才可挑战。强烈建议聘请当地向导（磨西镇有专业向导服务）。子梅垭口路段在雨雪天气极为危险，需根据天气灵活调整行程。",
    avgRating: 4.9,
    reviewCount: 64,
    featured: true,
  },
  {
    name: "狼塔C线（新疆天山穿越）",
    slug: "langtac-trail",
    difficulty: "advanced",
    region: "西北",
    province: "新疆",
    duration: "7天",
    distance: "80km",
    elevation: "最高海拔3800m",
    bestSeason: "7-9月",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    summary: "狼塔C线是新疆天山最经典的高难度穿越路线，从独库公路出发，穿越天山腹地，历经高山草甸、冰川湖泊、峡谷溪流，最终抵达库车大峡谷。被誉为\"中国最美徒步路线\"，是新疆徒步的王者线路。",
    highlights: JSON.stringify(["天山高山草甸全景", "冰川湖泊（天鹅湖）", "野生动物（雪豹、马鹿）", "库车大峡谷红色地貌", "天山腹地原始风光", "哈萨克族牧民文化"]),
    equipment: JSON.stringify(["专业防水登山鞋", "四季睡袋（-10℃）", "三季帐篷", "冲锋衣套装", "登山杖", "熊罐（防野生动物）", "卫星电话", "急救包", "10天食物", "净水器"]),
    transportation: "飞机至乌鲁木齐，再乘车至独库公路起点（约6-8小时）。建议在乌鲁木齐适应1-2天。",
    accommodation: "全程野营，无固定住宿设施。需携带帐篷和完整露营装备。",
    costMin: 4000,
    costMax: 10000,
    pros: JSON.stringify(["新疆天山原始风光，人迹罕至", "野生动物资源丰富", "景观多样性极高", "极致的荒野探险体验"]),
    cons: JSON.stringify(["难度极高，需要专业装备和经验", "全程野营，舒适度低", "通讯信号极差", "部分路段需涉水过河", "熊出没区域需特别注意"]),
    culturalBackground: "天山是古丝绸之路的重要地理屏障，也是哈萨克族世代游牧的家园。\"狼塔\"得名于当地哈萨克语，意为\"狼居住的山峰\"。沿途可见哈萨克族牧民的毡房（蒙古包），体验游牧文化。独库公路（独山子至库车）被称为\"中国最美公路\"，是中国公路建设史上的奇迹。",
    tips: "必须组队出行（至少4人），严禁单人挑战。必须携带卫星电话或定位设备。出发前向当地林业局登记备案。遇到熊时保持冷静，不要奔跑，缓慢后退。",
    avgRating: 4.8,
    reviewCount: 45,
    featured: false,
  },
];

for (const trail of trails) {
  await connection.execute(
    `INSERT INTO trails (name, slug, difficulty, region, province, duration, distance, elevation, bestSeason, coverImage, summary, highlights, equipment, transportation, accommodation, costMin, costMax, pros, cons, culturalBackground, tips, avgRating, reviewCount, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [trail.name, trail.slug, trail.difficulty, trail.region, trail.province, trail.duration, trail.distance, trail.elevation, trail.bestSeason, trail.coverImage, trail.summary, trail.highlights, trail.equipment, trail.transportation, trail.accommodation, trail.costMin, trail.costMax, trail.pros, trail.cons, trail.culturalBackground, trail.tips, trail.avgRating, trail.reviewCount, trail.featured ? 1 : 0]
  );
}

// Get trail IDs
const [trailRows] = await connection.execute(`SELECT id, slug FROM trails`);

const trailMap = {};
for (const row of trailRows) {
  trailMap[row.slug] = row.id;
}

// Insert tour groups
const tourGroups = [
  {
    trailSlug: "huangshan-yungu-trail",
    name: "黄山2日精华游（含缆车+山顶住宿）",
    operator: "途牛旅游",
    price: 1280,
    duration: "2天1夜",
    departureCity: "上海/杭州/南京",
    nextDeparture: "每周五、六出发",
    maxGroupSize: 20,
    includes: JSON.stringify(["往返缆车票", "景区门票", "山顶宾馆住宿", "早餐", "专业导游"]),
    bookingUrl: "https://www.tuniu.com",
    description: "专业导游带领，含黄山最精华景点，山顶住宿体验日出云海，性价比极高的黄山深度游。",
  },
  {
    trailSlug: "siguniang-mountain-trail",
    name: "四姑娘山3日徒步团",
    operator: "磨房户外",
    price: 1680,
    duration: "3天2夜",
    departureCity: "成都",
    nextDeparture: "每周六出发",
    maxGroupSize: 15,
    includes: JSON.stringify(["往返交通", "住宿（客栈）", "专业向导", "保险", "部分餐食"]),
    bookingUrl: "https://www.mafengwo.cn",
    description: "专业户外领队带队，小团精品游，深度体验川西高原风光和藏族文化，安全有保障。",
  },
  {
    trailSlug: "everest-base-camp-trail",
    name: "西藏珠峰大本营14日深度游",
    operator: "西藏探险旅行社",
    price: 18800,
    duration: "14天",
    departureCity: "成都/拉萨",
    nextDeparture: "4月15日、5月1日、9月15日",
    maxGroupSize: 10,
    includes: JSON.stringify(["全程住宿", "专业藏族向导", "边境证办理", "高原医疗支持", "部分餐食", "保险"]),
    bookingUrl: "https://www.lvmama.com",
    description: "专业高山向导全程陪同，配备高原医疗设备，小团精品游，安全保障最高级别，是挑战珠峰大本营的最佳选择。",
  },
  {
    trailSlug: "gongga-mountain-trail",
    name: "贡嘎山东坡10日穿越团",
    operator: "四川山野户外",
    price: 5800,
    duration: "10天",
    departureCity: "成都",
    nextDeparture: "5月20日、9月10日",
    maxGroupSize: 12,
    includes: JSON.stringify(["往返交通", "专业向导（2名）", "营地装备", "保险", "紧急救援服务"]),
    bookingUrl: "https://www.8264.com",
    description: "资深向导团队，配备完整紧急救援方案，是挑战贡嘎大环线最专业的团队之一。",
  },
  {
    trailSlug: "tianmen-mountain-trail",
    name: "张家界天门山2日精品游",
    operator: "携程旅行",
    price: 980,
    duration: "2天1夜",
    departureCity: "长沙/武汉",
    nextDeparture: "每周四、六出发",
    maxGroupSize: 25,
    includes: JSON.stringify(["往返大巴", "景区门票", "玻璃栈道体验", "酒店住宿", "导游服务"]),
    bookingUrl: "https://www.ctrip.com",
    description: "含天门山最热门景点，玻璃栈道体验，专业导游讲解，是体验张家界精华的高性价比选择。",
  },
];

for (const tg of tourGroups) {
  const trailId = trailMap[tg.trailSlug];
  if (!trailId) continue;
  await connection.execute(
    `INSERT INTO tour_groups (trailId, name, operator, price, duration, departureCity, nextDeparture, maxGroupSize, includes, bookingUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [trailId, tg.name, tg.operator, tg.price, tg.duration, tg.departureCity, tg.nextDeparture, tg.maxGroupSize, tg.includes, tg.bookingUrl, tg.description]
  );
}

// Insert seed reviews (userId=1 as placeholder)
const seedReviews = [
  { slug: "xihu-lake-trail", rating: 5, title: "春天赏花绝佳", content: "三月份去的，苏堤两侧桃花盛开，美不胜收。路面非常平整，带着父母走完全程毫无压力。推荐清晨6点出发，人少景美。", hikingDate: "2024年3月", groupType: "family" },
  { slug: "xihu-lake-trail", rating: 4, title: "城市徒步的好去处", content: "作为城市徒步来说非常不错，沿湖风景优美。就是节假日人太多，建议工作日或者早晨去。雷峰塔日落真的很美，值得等待。", hikingDate: "2024年10月", groupType: "couple" },
  { slug: "huangshan-yungu-trail", rating: 5, title: "云海震撼，此生必来", content: "运气极好，遇到了绝美云海。凌晨4点起床等日出，当太阳从云海中升起的那一刻，所有的疲惫都值了。迎客松比想象中更有气势，一定要来！", hikingDate: "2024年11月", groupType: "friends" },
  { slug: "huangshan-yungu-trail", rating: 4, title: "景色一流，就是贵", content: "黄山的景色确实无可挑剔，奇松怪石云海温泉四绝名不虚传。山上住宿价格偏高，但为了看日出还是值得的。建议提前2周订票订房。", hikingDate: "2024年5月", groupType: "couple" },
  { slug: "siguniang-mountain-trail", rating: 5, title: "川西最美徒步，强烈推荐", content: "8月份去的，正值高山花卉盛开，满山遍野的杜鹃和各种野花，幺妹峰在云雾中若隐若现。高原反应不算严重，提前吃了红景天。向导非常专业，强烈推荐。", hikingDate: "2024年8月", groupType: "friends" },
  { slug: "everest-base-camp-trail", rating: 5, title: "人生中最难忘的14天", content: "站在珠峰大本营仰望世界之巅，那种震撼无法用语言描述。高原反应在4000m以上比较明显，但只要慢慢走、多喝水，都能克服。绒布寺的星空是我见过最美的星空。这辈子一定要来一次！", hikingDate: "2024年5月", groupType: "group" },
  { slug: "gongga-mountain-trail", rating: 5, title: "中国最顶级的徒步体验", content: "子梅垭口看到的贡嘎雪山全景，是我徒步多年见过的最震撼的景色。路线难度确实高，需要充分准备。向导是当地藏族小伙，非常专业，还给我们讲了很多藏族故事。", hikingDate: "2024年9月", groupType: "friends" },
  { slug: "tianmen-mountain-trail", rating: 4, title: "玻璃栈道刺激好玩", content: "玻璃栈道真的很刺激，站在上面腿都软了，但又忍不住往下看。天门洞从山脚仰望非常壮观。建议避开节假日，人太多会影响体验。", hikingDate: "2024年6月", groupType: "friends" },
];

for (const r of seedReviews) {
  const trailId = trailMap[r.slug];
  if (!trailId) continue;
  await connection.execute(
    `INSERT INTO reviews (trailId, userId, rating, title, content, hikingDate, groupType) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [trailId, 1, r.rating, r.title, r.content, r.hikingDate, r.groupType]
  );
}

// Insert buddy posts
const buddyPostsData = [
  { userId: 1, trailSlug: "siguniang-mountain-trail", title: "招募3人！8月四姑娘山幺妹峰环线，成都出发", content: "计划8月10日从成都出发，走四姑娘山幺妹峰环线3天2夜。已有2人（1男1女），寻找2-3名有高原徒步经验的伙伴。我们节奏适中，不赶路，享受风景。", departureDate: "2025年8月10日", departureCity: "成都", currentCount: 2, targetCount: 5, budget: "人均1500-2000元", requirements: "有高原徒步经验，体能良好，有自己的基础装备，性格开朗", contactInfo: "微信：hiking_sichuan" },
  { userId: 1, trailSlug: "everest-base-camp-trail", title: "寻找珠峰大本营同行者，5月出发，已规划详细行程", content: "计划2025年5月1日从拉萨出发，完整走珠峰大本营线路，约14天。已有详细行程规划，联系好了专业向导。寻找2-4名有高海拔经验的徒步者，费用AA制。", departureDate: "2025年5月1日", departureCity: "拉萨", currentCount: 1, targetCount: 4, budget: "人均15000-20000元（含向导）", requirements: "有4000m以上高海拔徒步经验，身体健康，能接受简陋住宿条件", contactInfo: "微信：tibet_hiker" },
  { userId: 1, trailSlug: "xihu-lake-trail", title: "周末西湖环湖徒步，欢迎新手加入！", content: "本周六早上7点，从断桥出发走西湖环湖步道，预计全天行程，中午在苏堤附近吃饭。欢迎徒步新手，轻松休闲节奏，重在交流和欣赏风景。", departureDate: "2025年3月15日", departureCity: "杭州", currentCount: 3, targetCount: 8, budget: "人均100-200元（餐饮自理）", requirements: "无特殊要求，穿舒适运动鞋即可，保持积极心态", contactInfo: "微信：westlake_walk" },
  { userId: 1, trailSlug: "langtac-trail", title: "狼塔C线7月穿越，寻找3名有经验的队友", content: "计划7月15日挑战狼塔C线，已有丰富高山穿越经验，有完整装备。寻找有类似经验的队友，安全第一，不接受零经验者。已联系好向导，有卫星电话。", departureDate: "2025年7月15日", departureCity: "乌鲁木齐", currentCount: 2, targetCount: 5, budget: "人均5000-8000元", requirements: "有高山穿越经验（3000m以上），有完整野营装备，体能优秀，有团队意识", contactInfo: "微信：xinjiang_explorer" },
];

for (const bp of buddyPostsData) {
  const trailId = trailMap[bp.trailSlug];
  await connection.execute(
    `INSERT INTO buddy_posts (userId, trailId, title, content, departureDate, departureCity, currentCount, targetCount, budget, requirements, contactInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [bp.userId, trailId || null, bp.title, bp.content, bp.departureDate, bp.departureCity, bp.currentCount, bp.targetCount, bp.budget, bp.requirements, bp.contactInfo]
  );
}

console.log("✅ Seed data inserted successfully!");
await connection.end();
