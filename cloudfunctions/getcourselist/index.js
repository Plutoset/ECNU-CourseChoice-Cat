const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({env:'chake-7g37b76526c08c7a'})
const $ = db.command.aggregate
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  
  const result = await db.collection('peclass').aggregate()
  .group({
    _id: '$class',
    teachers: $.addToSet('$teacher')
  })
  .end()

  return (result)
}