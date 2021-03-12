// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env:'chake-7g37b76526c08c7a'})
const db = cloud.database({env:'chake-7g37b76526c08c7a'})
const MAX_LIMIT = 100
const $ = db.command.aggregate


exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('Evaluation')
  .aggregate()
  .unwind('$tag')
  .unwind('$teacher')
  .count("count")
  .end()
  const total = countResult.list[0].count
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  console.log("几次",batchTimes)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Evaluation')
    .aggregate()
    .unwind('$tag')
    .unwind('$teacher')
    .project({
      _id : 0,
      class: $.concat(['$class', '&', '$teacher']),
      student: 1,
      tag: 1,
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .end()
    tasks.push(promise)
  }
  
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => acc.concat(cur.list),[])

  // const fields = ['class','student','tag']
  // const json2csvParser = new Parser({ fields, quote: '' });

  // const csv = json2csvParser.parse(usertaglist);

  // var form = new FormData();
  // form.append( 'file', csv, 'data.csv' );


  // const res = await cloud.callContainer({
  //   path: '/container-python/updatedata',
  //   method: 'POST',
  //   data: form,
  //   header: { 
  //     ...form.getHeaders()
  //   },
  // })
  
  // return res
}