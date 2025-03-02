
const mealschedules = [

        {
            mealScheduleId: 'MS001',
            mealType: 'breakfast',
            mealContent: '面包',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS002',
            mealType: 'breakfast',
            mealContent: '鸡蛋',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS003',
            mealType: 'breakfast',
            mealContent: '橙汁',
            nutritionType: 'beverage',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS004',
            mealType: 'breakfast',
            mealContent: '牛奶',
            nutritionType: 'beverage',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS005',
            mealType: 'breakfast',
            mealContent: '燕麦片',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS006',
            mealType: 'lunch',
            mealContent: '米饭',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS007',
            mealType: 'lunch',
            mealContent: '鸡肉',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS008',
            mealType: 'lunch',
            mealContent: '青菜',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS009',
            mealType: 'lunch',
            mealContent: '鱼肉',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS010',
            mealType: 'lunch',
            mealContent: '豆腐',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS011',
            mealType: 'lunch',
            mealContent: '胡萝卜',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS012',
            mealType: 'dinner',
            mealContent: '馒头',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS013',
            mealType: 'dinner',
            mealContent: '豆腐',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS014',
            mealType: 'dinner',
            mealContent: '西红柿',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS015',
            mealType: 'dinner',
            mealContent: '玉米',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS016',
            mealType: 'dinner',
            mealContent: '虾仁',
            nutritionType: 'protein',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS017',
            mealType: 'dinner',
            mealContent: '绿豆汤',
            nutritionType: 'beverage',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS018',
            mealType: 'dinner',
            mealContent: '红豆汤',
            nutritionType: 'beverage',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS019',
            mealType: 'dinner',
            mealContent: '菠菜',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        {
            mealScheduleId: 'MS020',
            mealType: 'dinner',
            mealContent: '苹果',
            nutritionType: 'vegetable',
            createdAt: '2025-02-11T18:16:00Z'
        },
        // 新增早餐数据
        {
            mealScheduleId: 'MS021',
            mealType: 'breakfast',
            mealContent: '全麦三明治',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-12T08:00:00Z'
        },
        {
            mealScheduleId: 'MS022',
            mealType: 'breakfast',
            mealContent: '坚果',
            nutritionType: 'fat',
            createdAt: '2025-02-12T08:00:00Z'
        },
        {
            mealScheduleId: 'MS023',
            mealType: 'breakfast',
            mealContent: '酸奶',
            nutritionType: 'protein',
            createdAt: '2025-02-12T08:00:00Z'
        },
        {
            mealScheduleId: 'MS024',
            mealType: 'breakfast',
            mealContent: '香蕉',
            nutritionType: 'fruit',
            createdAt: '2025-02-12T08:00:00Z'
        },
        {
            mealScheduleId: 'MS025',
            mealType: 'breakfast',
            mealContent: '黑咖啡',
            nutritionType: 'beverage',
            createdAt: '2025-02-12T08:00:00Z'
        },
        // 新增午餐数据
        {
            mealScheduleId: 'MS026',
            mealType: 'lunch',
            mealContent: '意大利面',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-12T12:00:00Z'
        },
        {
            mealScheduleId: 'MS027',
            mealType: 'lunch',
            mealContent: '牛排',
            nutritionType: 'protein',
            createdAt: '2025-02-12T12:00:00Z'
        },
        {
            mealScheduleId: 'MS028',
            mealType: 'lunch',
            mealContent: '西兰花',
            nutritionType: 'vegetable',
            createdAt: '2025-02-12T12:00:00Z'
        },
        {
            mealScheduleId: 'MS029',
            mealType: 'lunch',
            mealContent: '烤鸡胸肉',
            nutritionType: 'protein',
            createdAt: '2025-02-12T12:00:00Z'
        },
        {
            mealScheduleId: 'MS030',
            mealType: 'lunch',
            mealContent: '南瓜',
            nutritionType: 'vegetable',
            createdAt: '2025-02-12T12:00:00Z'
        },
        {
            mealScheduleId: 'MS031',
            mealType: 'lunch',
            mealContent: '番茄鸡蛋汤',
            nutritionType: 'beverage',
            createdAt: '2025-02-12T12:00:00Z'
        },
        // 新增晚餐数据
        {
            mealScheduleId: 'MS032',
            mealType: 'dinner',
            mealContent: '紫薯',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS033',
            mealType: 'dinner',
            mealContent: '豆腐脑',
            nutritionType: 'protein',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS034',
            mealType: 'dinner',
            mealContent: '凉拌黄瓜',
            nutritionType: 'vegetable',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS035',
            mealType: 'dinner',
            mealContent: '红薯粥',
            nutritionType: 'carbohydrate',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS036',
            mealType: 'dinner',
            mealContent: '清蒸鱼',
            nutritionType: 'protein',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS037',
            mealType: 'dinner',
            mealContent: '蔬菜沙拉',
            nutritionType: 'vegetable',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS038',
            mealType: 'dinner',
            mealContent: '梨',
            nutritionType: 'fruit',
            createdAt: '2025-02-12T18:00:00Z'
        },
        {
            mealScheduleId: 'MS039',
            mealType: 'dinner',
            mealContent: '冬瓜汤',
            nutritionType: 'beverage',
            createdAt: '2025-02-12T18:00:00Z'
        }
    ];
    

module.exports = mealschedules
