const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide your name'],
    },
    email:{
        type:String,
        required:[true, 'Please provide your email address'],
        validate:[validator.isEmail, 'Please provide a valid email address'],
        unique:true
    },
    phone:{
        type:String,
        required:[true, 'Please provide your phone number'],
        unique:true
    },   
    photo:String,

    role:{
        type:String,
        enum:{
            values:['user', 'admin'],
            message:'Role is either: admin or user. Got {VALUE}'
        },
        default:'user'
    },
    status:{
        type:String,
        enum:{
            values:['active', 'deactivated'],
            message:'Status is either:active, or deactivated. Got {VALUE}'
        },
        default:'active'
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    accountId:{
        type:String,
        default:`tradeInvest-${Date.now()}`
    },
    referralId:{
        type:String,
        trim:true
    },

    password:{
        type:String,
        required:[true, 'Please provide your password'],
        minlength:[8, 'The password field must be at least 8 characters.'],
        select:false
    },

    passwordConfirm:{
        type:String,
        required:[true, 'Please confirm your password'],
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:'The password field confirmation does not match.'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,

    emailVerificationExpires:Date,
    emailVerificationCode:String,

    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

userSchema.virtual('wallet', {
    ref:'Wallet',
    foreignField:'user',
    localField:'_id'
});
userSchema.virtual('bankAccounts', {
    ref:'BankAccount',
    foreignField:'user',
    localField:'_id'
});


userSchema.pre('save', async function(next){
    //Only run this function when the password field is actually  modified
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
});

userSchema.pre('save', function(next){
    if(!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    this.find({status:{$ne:false}});
    next();
})



userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function(JWTtime){
    //User change password
    if(this.passwordChangedAt){
        const changeTimestamp = this.passwordChangedAt.getTime() / 1000
        return changeTimestamp > JWTtime
    }

    //Password was not change
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

userSchema.methods.createEmailVerificationCode = function(){
    const code = crypto.randomInt(1000, 9999).toString();
    this.emailVerificationCode = code;
    this.emailVerificationExpires =  new Date(Date.now() + 15 * 60 * 1000) // Code valid for 15 minutes
    return code;
}
const User = mongoose.model('User', userSchema);
module.exports = User;

