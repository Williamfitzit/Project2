const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/objectives")

const goalsDB = new  mongoose.Schema(
    {name:{

    goalID:String,
    required: true
    },
    description:{

        type:String,
        required: true
        },
        completed:{

            type:Boolean,
            required: true
            }
}
)

module.exports=mongoose.model("objectivesDB", objectivesDB)