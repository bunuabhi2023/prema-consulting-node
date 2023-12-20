const mongoose = require("mongoose");

const fieldforms = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'user is required'],
            ref: 'User'
        },

        projectId: {
            type: String,
            required: true,
        },

        currentTab: {
            type: Number,
            required: false,
            default: 0
        },

        sowData: {
            scopeFromReceivedDocuments: {
                type: String,
                required: false,
                maxLength: 2000,
            },
            scopeFromInterview: {
                type: String,
                required: false,
                maxLength: 2000,
            },
            sowStatement: {
                type: String,
                required: false,
            },
            selectedStandardScope: {
                type: String,
                required: false,
            },
        },

        propertyData: {
            structures: [{
                numberOfStories: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
                storyBySubLoc: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
                constructionType: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
                foundationType: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
            }],
            appraisersRecord: {
                propertyAppraiserRecord: {
                    type: String,
                    required: false,
                    maxLength: 255,

                },
                permitInformation: {
                    type: String,
                    required: false,
                    maxLength: 255,

                },
                topographicMap: {
                    type: String,
                    required: false,
                    maxLength: 255,

                },
            }
        },

        interviewee: [{
               buildingType: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
            contactMethod: {
                type: String,
                required: false,
                maxLength: 255,
            },
            title: {
                type: String,
                required: false,
                maxLength: 255,
            },
            firstName: {
                type: String,
                required: false,
                maxLength: 255,
            },
            lastName: {
                type: String,
                required: false,
                maxLength: 255,
            },
            roofingContract: {
                type: String,
                required: false,
                maxLength: 255,
            },
            companyName: {
                type: String,
                required: false,
                maxLength: 255,
            },
            interviewSignificance: {
                type: String,
                required: false,
                maxLength: 255,
            },
            businessCardFront: {
                type: String,
                required: false,
            },
            businessCardBack: {
                type: String,
                required: false,
            },
            document: {
                type: String,
                required: false,
            },
        }],

        propertyPurchasedTime: {
            type: String,
            required: false,
            maxLength: 255,
        },

        dolPerInterviewee: {
            type: String,
            required: false,
            maxLength: 255,
        },

        interviewRecord: {
            type: String,
            required: false,
            maxLength: 255,
        },

        interviewStructure: [{
            buildDate: {
                type: String,
                required: false,
                maxLength: 255,
            },
            roofReplacementDate: {
                type: String,
                required: false,
                maxLength: 255,
            },
            interiorDamageGeneralInfo: {
                type: String,
                required: false,
                maxLength: 255,
            },
            exteriorDamageDescription: {
                type: String,
                required: false,
                maxLength: 255,
            },
            exteriorDamageNotes: {
                type: String,
                required: false,
                maxLength: 255,
            },
            roofDamageDescription: {
                type: String,
                required: false,
                maxLength: 255,
            },
            roofNotes: {
                type: String,
                required: false,
                maxLength: 255,
            },
            rooms: [{
                roomArea: {
                    type: String,
                    required: false,
                    maxLength: 255,
                },
                damages: [{
                    damageLocation: {
                        type: String,
                        maxLength: 255,
                    },
                    atticInfo: {
                        type: String,
                        maxLength: 255,
                    },
                    notes: {
                        type: String,
                        maxLength: 255,
                    },

                }],
            }],
        }],

        sketches: {
            interiorDamageSketch: {
                type: String,
                maxLength: 500,
                required: false,

            },

            roofSketch: {
                type: String,
                maxLength: 5000,
                required: false,

            },
        },

        documents: [{
            constructionEstimate: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            documentReviewNotes: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            noteworthyItems: {
                type: String,
                required: false,
                maxLength: 5000,
            }
        }],

        wrht: {
            windAndRainfallData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            hailData1: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            tornadoData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            additionalWeatherData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
        },

        lightningStrike: {
            type: String,
            required: false,
            maxLength: 5000,
        },

        floodData: [{
            usgsRiverGageData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            usgsHighWaterMarkData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            noaaBuoyStreamGageData: {
                type: String,
                required: false,
                maxLength: 5000,
            },
            fetchDistanceData: {
                type: String,
                required: false,
                maxLength: 5000,
            }
        }],

        historicalImageryReview: {
            aerial: {
                type: String,
                required: false,
                maxLength: 5000,

            },
            realtor: {
                type: String,
                required: false,
                maxLength: 5000,

            },
            zillow: {
                type: String,
                required: false,
                maxLength: 5000,

            },
            redfin: {
                type: String,
                required: false,
                maxLength: 5000,

            },
        },

        soilData: {
            type: String,
            required: false,
            maxLength: 5000,

        },
    }
);
module.exports = mongoose.model("FieldForm", fieldforms);
