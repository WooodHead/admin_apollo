const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

class Active extends Model {}
mongodb.register(Active);

const { applys } = mockjs.mock({'applys|20': [{
    'active_id|+1': 1,
    'active_name|1':  ['充100送100'],
    'active_title|1': ['充100送100'],
    'agent_id': 1,
    apply_time: moment().format('YYYY-MM-DD hh:mm:ss'),
    content: '某君的QQ状态很搞，上面浪漫的写着：“你五毛我五毛，那么咱俩就能凑一块了！”众人羡慕之时，另一女说到：“你六毛我六毛咱俩就能一块2了。”再另一女接到：“你七毛我七毛，咱俩就能一块死了……”',
    coupon_money: 1000,
    deposit_money: 1000,
    email: 'g@g.cn',
    'id|+1': 1,
    ip: '127.0.0.1',
    issue_mode: '1',
    level: '1',
    memo: '@cname',
    mobile: '13500119988',
    process_time: moment().format('YYYY-MM-DD hh:mm:ss'),
    state: 'pending',
    'status|1': ['pending', 'rejected', 'pass'],
    'type_id|0': [1],
    type_name: '充值',
    'user_id|+1': 1,
    user_name: '@cname',
    withdraw_require: '1',
  }]});
const { actives } = mockjs.mock({'actives|20': [{
    'id|+1': 1,
    'title|+1': ['充一百送一百','充话费送老婆', '送上月球，送飞船', '买一送一','活不见人'],
    'name': '哈哈',
  }]});
router.get('/copywriter/float', async function login(req, res, next) {
  const { data } = mockjs.mock({'data|20': [{
      'active_id|+1': 1,
      'active_name|1':  ['充100送100'],
      'active_title|1': ['充100送100'],
      'agent_id': 1,
      apply_time: moment().format('YYYY-MM-DD hh:mm:ss'),
      content: '某君的QQ状态很搞，上面浪漫的写着：“你五毛我五毛，那么咱俩就能凑一块了！”众人羡慕之时，另一女说到：“你六毛我六毛咱俩就能一块2了。”再另一女接到：“你七毛我七毛，咱俩就能一块死了……”',
      coupon_money: 1000,
      deposit_money: 1000,
      email: 'g@g.cn',
      'id|+1': 1,
      ip: '127.0.0.1',
      issue_mode: '1',
      level: '1',
      memo: '@cname',
      mobile: '13500119988',
      process_time: moment().format('YYYY-MM-DD hh:mm:ss'),
      'state|1': ['pending', 'pass', 'rejected'],
      status: '2',
      'type_id': [1],
      type_name: '充值',
      'user_id|+1': 1,
      user_name: 'cnname',
      withdraw_require: '1',
    }]})
  res.json(resultOk(data));
});
router.get('/active/applys', async function login(req, res, next) {
  res.json(resultOk(applys));
});
router.put('/active/apply.comment/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
router.get('/active/apply/:id', async function save(req, res, next) {
  res.json(resultOk(applys[0]))
});
router.patch('/active.withdraw/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
router.patch('/active.discount/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
// 优惠活动标题
router.get('/actives', async function save(req, res, next) {
  res.json(resultOk(actives))
});
// 优惠活动状态
router.put('/active/apply/status', async function save(req, res, next) {
  res.json(resultOk(actives))
});


const { types } = mockjs.mock({'types|3': [{
    'id|+1': 1,
    'name|+1': ['充值', '满减', '幸运'],
    'description|+1': ['充值送啊送', '满多少减多少', '随机送'],
    'sort|1-100': 1,
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});
// 优惠类型
router.get('/active/types', async function save(req, res, next) {
  res.json(resultOk(types));
});
router.delete('/active/types/:id', async function save(req, res, next) {
  const n = types.findIndex(v => req.params.id === String(v.id));
  types.splice(n, 1);
  res.json(resultOk({}))
});
router.post('/active/types/:id', async function save(req, res, next) {
  res.json(resultOk(types[0]))
});
router.put('/active/types/:id', async function save(req, res, next) {
  res.json(resultOk(types[0]))
});



const { activities } = mockjs.mock({'activities|20': [{
        'id|+1': 1,
        begin_time: moment().format('YYYY-MM-DD hh:mm:ss'),
        cover: `https://placeholdit.imgix.net/~text?txtsize=23&bg=a9160f&txtclr=ffffff&txt=@cname&w=360&h=60`,
        created: moment().format('YYYY-MM-DD hh:mm:ss'),
        created_uname: '@cname',
        description: '@city',
        end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
        issue_mode: '1',
        language_id: '1',
        language_name: '中文',
        open_type: '4',
        'name|1': ['充一百送一百', '充话费送老婆', '送上月球，送飞船', '买一送一', '活不见人'],
        rule: '充1000000才送',
        'sort|+1': 1,
        status: 'enabled',
        'title|1': ['充一百送一百', '充话费送老婆', '送上月球，送飞船', '买一送一', '活不见人'],
        'types|1-2': [{ 'name|1': ['充值','满减','幸运'] }],
        updated: moment().format('YYYY-MM-DD hh:mm:ss'),
        updated_uname: '@cname',
    }]});
// 列表
router.get('/activity/content', async function list(req, res, next) {
  res.json(resultOk(activities))
});
// 开始
router.patch('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 删除
router.delete('/active/manual/:id', async function save(req, res, next) {
  const n = activities.findIndex(v => req.params.id === String(v.id));
  activities.splice(n, 1);
  res.json(resultOk({}))
});
// 添加
router.put('/active/manual', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 详情
router.get('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 修改
router.put('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});

module.exports = {
  Active,
  router,
}


// 返水活动设置
const { discountSetting } = mockjs.mock({'discountSetting|3': [{
    'id|+1': 1,
    'valid_money|1-100.1-2': 1.0,
    memo: '反水好',
    status: 'enabled',
    'upper_limit|1-100.1-2': 1.0,
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});

// 列表
router.get('/discountSetting', async function list(req, res, next) {
  res.json(resultOk(discountSetting))
});
// 修改
router.put('/discountSetting/:id?', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 删除
router.delete('/discountSetting/:id', async function save(req, res, next) {
  const n = discountSetting.findIndex(v => req.params.id === String(v.id));
  discountSetting.splice(n, 1);
  res.json(resultOk(activities[0]))
});

//反水活动
// 返水活动
const { discount } = mockjs.mock({'discount|20': [{
    'id|+1': 1,
    'name|1': ['充一百送一百', '充话费送老婆', '送上月球，送飞船', '买一送一', '活不见人'],
    effect_time: moment().format('YYYY-MM-DD hh:mm:ss'),
    'people_coupon': '@integer(1, 100) / @integer(500, 10000)',
    'withdraw_per|1-100': 1,
    'member_level|1-5': 1,
    'games|+1': ['竞技', '角色'],
    'valid_money|1-100.1-2': 1.0,
    memo: '反水好',
    status: 'enabled',
    'upper_limit|1-100.1-2': 1.0,
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});

// 列表
router.get('/discount', async function list(req, res, next) {
  res.json(resultOk(discount))
});
// 修改
router.put('/discount/:id?', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 删除
router.delete('/discount/:id', async function save(req, res, next) {
  const n = discount.findIndex(v => req.params.id === String(v.id));
  discount.splice(n, 1);
  res.json(resultOk(activities[0]))
});


// 反水活动详情
const { discountDetail } = mockjs.mock({'discountDetail|20': [{
    'id|+1': 1,
    'user_name': '@cname',
    status: 0,
    agent_name: '@city',
    'valid_coupon': 'a,b,c,d',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});

// 列表
router.get('/discountDetail', async function list(req, res, next) {
  res.json(resultOk(discountDetail))
});

router.post('/discountDetail/status/:id', async function list(req, res, next) {
  res.json(resultOk(discountDetail))
});
router.put('/discountManage/:id', async function list(req, res, next) {
  res.json(resultOk(discountDetail))
});