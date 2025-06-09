    // backend/models/User.js
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');

    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, '유효한 이메일 주소를 입력해주세요.'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    // 비밀번호를 저장하기 전에 해싱 (암호화)
    userSchema.pre('save', async function (next) {
      if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      next();
    });

    // 비밀번호 일치 여부 확인 메서드
    userSchema.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    const User = mongoose.model('User', userSchema);

    module.exports = User;