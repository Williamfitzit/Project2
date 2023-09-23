const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/goals")

const goalsDB = new  mongoose.Schema(
    {name:{

    type:String,
    required: true
    },
    description:{

        type:String,
        required: true
        },
        createdDate:{

            type:Date,
            required: true
            },
            targetDate:{

                type:Date,
                required: true
                },
                objectives:{

                    type:Array,
                    required: true
                    }
}
)

module.exports=mongoose.model("goalsDB", goalsDB)