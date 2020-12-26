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
  fields:
    - description
    - points
- stepName: doing
  fields:
    - branch
- stepName: review
  fields:
    - pr   
- stepName: done
  fields:
    - merged
`
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
