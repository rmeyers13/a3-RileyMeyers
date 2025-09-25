const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    mpg: {
        type: Number,
        required: true,
        min: 0
    },
    efficiency: {
        type: String,
        enum: ['Poor', 'Average', 'Good', 'Excellent']
    },
    age: {
        type: Number
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

carSchema.pre('save', function(next) {
    const currentYear = new Date().getFullYear();
    this.age = currentYear - this.year;

    if (this.mpg >= 40) {
        this.efficiency = 'Excellent';
    } else if (this.mpg >= 30) {
        this.efficiency = 'Good';
    } else if (this.mpg >= 20) {
        this.efficiency = 'Average';
    } else {
        this.efficiency = 'Poor';
    }

    next();
});

module.exports = mongoose.model('Car', carSchema);