import mongoose from 'mongoose';
import Account from './Account.js';
import Address from './Address.js';
import Identification from './Identification.js';
import MyPhoto from './MyPhoto.js';
import Trip from './Trip.js';
import Hobby from './Hobby.js';
import Article from './Article.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  identification: {
    type: Schema.Types.ObjectId,
    ref: 'Identification',
    // required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  hashtag: {
    type: String,
    trim: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    // required: true,
  },
  avt: [{
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto',
  }],
  aboutMe: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  hobbies: [{
    type: Schema.Types.ObjectId,
    ref: 'Hobby',
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  reels: [{
    type: Schema.Types.ObjectId,
    ref: 'Reels',
  }],
  pages: {
    _id: {
      type: String,
    },
    createPages: [{
      type: Schema.Types.ObjectId,
      ref: 'Page',
    }],
    followerPages: [{
      type: Schema.Types.ObjectId,
      ref: 'Page',
    }],
  },
  saveAddress: [{
    type: Schema.Types.ObjectId,
    ref: 'Address',
  }],
  savedLocation: [{
    type: Schema.Types.ObjectId,
    ref: 'Location',
  }],
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip',
  }],
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'Collection',
  }],
  groups: {
    _id: {
      type: String,
    },
    createGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'Group',
    }],
    saveGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'Group',
    }],
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }], // Thêm trường followers
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }], // Đổi từ follow thành following
  setting: {
    profileVisibility: {
      type: Boolean,
      default: true,
    },
    allowMessagesFromStrangers: {
      type: Boolean,
      default: true,
    },
  },
});

const User = mongoose.model('User', userSchema);
export default User;