const mongoose = require("mongoose");

const fieldforms = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Types.ObjectId,
            required:[true , 'user is required'],
            ref:'User'
        },
        sowWorksheet:{
            scopeFromReceivedDoc:{
                type:String,
            },
            scopeFromInterview: {
                type:String,
            },
       },
        sowStatement: {
            standardScope:{
                type:String,
                required:false,
            },
            expertsCraft:{
                type:String,
                required:false,
            },
        },
        propertyStructure: [{
            buildingType:{
                type:String,
                required:false,
                maxLength:255,
            },
            numberOfStories:{
                type:String,
                required:false,
                maxLength:255,
            },
            storyBySubLoc:{
                type:String,
                required:false,
                maxLength:255,
            },
            constructionType:{
                type:String,
                required:false,
                maxLength:255,
            },
            foundationType:{
                type:String,
                required:false,
                maxLength:255,
            },
        }],
        propertyAppraiserRecord: {
                type:String,
                required:false,
                maxLength:255,
            
        },
        permitInformation: {
                type:String,
                required:false,
                maxLength:255,
            
        },
        topographicMap: {
                type:String,
                required:false,
                maxLength:255,
            
        },
        
        interviewee: [{
            contactMethod:{
                type:String,
                required:false,
                maxLength:255,
            },
            mrOrms:{
                type:String,
                required:false,
                maxLength:255,
            },
            firstName:{
                type:String,
                required:false,
                maxLength:255,
            },
            lastName:{
                type:String,
                required:false,
                maxLength:255,
            },
            title:{
                type:String,
                required:false,
                maxLength:255,
            },
            company:{
                type:String,
                required:false,
                maxLength:255,
            },
            significance:{
                type:String,
                required:false,
                maxLength:255,
            },
            businessCardFront:{
                Bucket:{
                    type:String,
                    required:[true, 'BusinessCardFront Image is required'],

                },
                Key:{
                    type:String,
                    required:[true, 'BusinessCardFront is required'],

                },
                Url:{
                    type:String,
                    required:[true, 'BusinessCardFront is required'],

                }
            },
            businessCardBack:{
                Bucket:{
                    type:String,
                    required:[true, 'Business Card Back Image is required'],

                },
                Key:{
                    type:String,
                    required:[true, 'Business Card Back Image is required'],
                    maxLength:255,
                },
                Url:{
                    type:String,
                    required:[true, 'Business Card Back Image is required'],
                    maxLength:255,
                }
            },
            document:{
                Bucket:{
                    type:String,
                    required:[true, 'document is required'],

                },
                Key:{
                    type:String,
                    required:[true, 'document is required'],

                },
                Url:{
                    type:String,
                    required:[true, 'document is required'],

                }
            },
        }],
        propertyPurchesTime:{
            type:String,
            required:false,
            maxLength:255,
        },
        dolPerInterviewee:{
            type:String,
            required:false,
            maxLength:255,
        },
        interviewRecord:{
            type:String,
            required:false,
            maxLength:255,
        },
        interviewStructure: [{
            structureBuilt:{
                type:String,
                required:false,
                maxLength:255,
            },
            roofLastReplaceTime:{
                type:String,
                required:false,
                maxLength:255,
            },
            interiorDamageInfo:{
                type:String,
                required:false,
                maxLength:255,
            },
            exterior:{
                exteriorDamageInfo:[{
                    type:String,
                    required:false,
                    maxLength:255,
                }],
                notes:{
                    type:String,
                    required:false,
                    maxLength:255,
                },
            },
            roof:{
                roofDamageInfo:[{
                    type:String,
                    required:false,
                    maxLength:255,
                }],
                notes:{
                    type:String,
                    required:false,
                    maxLength:255,
                },
            },
            roomArea:[{
                roomNumber:{
                    type:String,
                    required:false,
                    maxLength:255,
                },
                damage:[{
                    damageNumber:{
                        type:String,
                        maxLength:255,
                    },
                    damageLocation:{
                        type:String,
                        maxLength:255,
                    },
                    atticInfo:{
                        type:String,
                        maxLength:255,
                    },
                    notes:{
                        type:String,
                        maxLength:255,
                    },
                    
                }],
            }],
        }],
        fieldSketch:[{
            interiorDamageSketch:{ 
                type:String,
                maxLength:255,
            },
            roofSketch:{ 
                type:String,
                required:false,
                maxLength:255,
            }
        }],
        docOverView:[{
            constructionEstimateAndPhoto:{ 
                type:String,
                maxLength:255,
            },
            estimateAndPhotoSheet:{ 
                type:String,
                required:false,
                maxLength:255,
            },
            itemsList:{ 
                type:String,
                maxLength:255,
            }
        }],
        weatherData:{
            windData:{
                  type:String,
                  required: false,
                  maxLength:255,
            },
            hailData:{
                  type:String,
                  required: false,
                  maxLength:255,
            },
            tornadoData:{
                  type:String,
                  required: false,
                  maxLength:255,
            },
            additionalData:{
                    type:String,
                    required: false,
                    maxLength:255,
              },
       },
       lightningStrikeData:{
               type:String,
               required: false,
               maxLength:255,
        },
        floodData:[{
            gangaData:{ 
                type:String,
                required:false,
                maxLength:255,
            },
            waterMarkData:{ 
                type:String,
                required:false,
                maxLength:255,
            },
            gageData:{ 
                type:String,
                required:false,
                maxLength:255,
            },
            distanceData:{ 
                type:String,
                required:false,
                maxLength:255,
            }
        }],
        aerialImageNotes:{
            type:String,
            required:false,
            maxLength:255,

        },
        
        aerialImages:[{
            Bucket:{
                type:String,
                required:[true, 'Aerial Image is required'],
            },
            Key:{
                type:String,
                required:[true, 'Aerial Image is required'],
            },
            Url:{
                type:String,
                required:[true, 'Aerial Image is required'],
            }
        }],
        realtorImageNotes:{
            type:String,
            required:false,
            maxLength:255,

        },
        zillowImageNotes:{
            type:String,
            required:false,
            maxLength:255,

        },
        redfinImageNotes:{
            type:String,
            required:false,
            maxLength:255,

        },
        
        historicalImages:[{
            Bucket:{
                type:String,
                required:[true, 'Historical Image is required'],

            },
            Key:{
                type:String,
                required:[true, 'Historical Image is required'],

            },
            Url:{
                type:String,
                required:[true, 'Historical Image is required'],

            }
        }],
        soilData:{
            type:String,
            required:false,
            maxLength:255,

        },
    }
);
module.exports = mongoose.model("FieldForm", fieldforms);