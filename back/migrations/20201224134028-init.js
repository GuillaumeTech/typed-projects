module.exports = {
  async up(db, client) {
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
          db.collection('projects').insertOne({_id:'test', name:'test', politic:
`- stepName: backlog
  fields: 
    - name
- stepName: todo
  order: 
    - priority
  display:  
    - points
    - priority
  fields:
    - name: description
      type: Text
    - name: points
      type: Number
      values: [1,2,3,5,8,13,21]
      #no type assume that it's a string
    - name: priority
      values: [P1, P2, P3]
- stepName: doing
  display:  
    - points
    - priority
  fields:
    - branch
- stepName: review
  display:  
    - pr
  fields:
    - pr
- stepName: done
  fields:
    - merged`
      })
        });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
          db.collection('projects').deleteOne({_id:'test'});
          })
    } finally {
      await session.endSession();
    }
  }
};
