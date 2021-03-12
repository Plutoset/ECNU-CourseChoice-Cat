const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({env:'chake-7g37b76526c08c7a'})

// 云函数入口函数
exports.main = async (event, context) => {
  let result = await db.collection('TestcmtCourses')
  .aggregate()
  .match({
    student: event.student
  })
  .count("count")
  .end()

  if (result.list.length == 0) {
    result.list = [{
      "count": 0
    }]
  }

  return result
}