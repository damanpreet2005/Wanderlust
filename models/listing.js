const mongoose= require("mongoose");
const Review = require("./reviews");
const Schema= mongoose.Schema;

const listingScheme= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default-image"
        },
        url: {
            type: String,
            default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flexjobs.com%2Fblog%2Fpost%2Fflexible-companies-that-help-pay-for-your-vacation&psig=AOvVaw1r47YBgG55WV4Ik-I9RIRi&ust=1747633335384000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICqqdOnrI0DFQAAAAAdAAAAABAE"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // category: {
    //     type: String,
    //     enum: ["Woods", "Snow", "Party", "Pool","Castle","Gaming","Mountain"],
    //     default: "city"
    // },
})

listingScheme.post("findOneAndDelete", async function(listing) {
    if(listing){
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

const listing= mongoose.model("Listing", listingScheme);
module.exports= listing;
