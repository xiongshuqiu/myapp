const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/authModel'); // 确保路径正确
const dotenv = require('dotenv');

dotenv.config();

async function encryptPasswords() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const users = await User.find({});
  for (let user of users) {
    if (!user.passWord.startsWith('$2b$')) { // 检查密码是否已加密
      const hashedPassword = await bcrypt.hash(user.passWord, 10);
      user.passWord = hashedPassword;
      await user.save();
    }
  }

  console.log('User passwords encrypted successfully');
  mongoose.connection.close();
}

encryptPasswords().catch(err => console.error(err));
