const Chapter = require("./models/admin/Chapter");

const cfsCronTask = async () => {
    const result = await Chapter.find({assigned_at: {$lte: Date.now()}});
    if(result?.length > 0){
        result.map( async data => {
            await Chapter.findOneAndUpdate({_id: data._id},{$set: { 
                assigned: false, 
                assigned_to: '', 
                flag: '', 
                assigned_at: '' 
            }});
            console.log(`Data Updated`);
        })
    }else{
        console.log(`No Task Available`);
    }
    
}
module.exports = {
    cfsCronTask
}