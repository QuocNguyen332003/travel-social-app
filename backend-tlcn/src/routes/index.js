import express from 'express'
import { accountRoute } from './accountRoute.js'
import { hobbyRoute } from './hobbyRoute.js'
import { addressRoute } from './addressRoute.js'
import { ticketRoute } from './ticketRoute.js'
import { identificationRoute } from './identificationRoute.js'
import { tripRoute } from './tripRoute.js'
import { myPhotoRoute } from './myphotoRoute.js'
import { userRoute } from './userRoute.js'
import { reportRoute } from './reportRoute.js'
import { notificationRoute } from './notificationRoute.js'
import { historySearchRoute } from './historySearchRoute.js'
import { articleRoute } from './articleRoute.js'
import { commentRoute } from './commentRoute.js'
import { groupRoute } from './groupRoute.js'
import { pageRoute } from './pageRoute.js'
import { addFriendRoute } from './addFriendRoute.js'
import { collectiondRoute } from './collectionRoute.js'
import { conversationdRoute } from './conversationRoute.js'
import { historyArticledRoute } from './historyArticleRoute.js'
import { provinceRoute } from './provinceRoute.js'
import { reelsRoute } from './reelsRoute.js'
import { messageRoute } from './messageRoute.js';
import { historyViewPagedRoute } from './historyViewPageRoute.js'
import { AIRoute } from './AIRoute.js'
import { touristDestinationRoute } from './touristDestinationRoute.js'
import { recommendationRoute } from './recommendationRoutes.js'
import { articleTagsRoute } from './articleTagsRoute.js'

const Router = express.Router()

Router.use('/accounts', accountRoute)
Router.use('/add-friends', addFriendRoute)
Router.use('/hobbies', hobbyRoute)
Router.use('/addresses', addressRoute)
Router.use('/tickets', ticketRoute)
Router.use('/identifications', identificationRoute)
Router.use('/trips', tripRoute)
Router.use('/myphotos', myPhotoRoute)
Router.use('/users', userRoute)
Router.use('/reports', reportRoute)
Router.use('/notifications', notificationRoute)
Router.use('/historysearches', historySearchRoute)
Router.use('/articles', articleRoute)
Router.use('/article-tags', articleTagsRoute)
Router.use('/comments', commentRoute)
Router.use('/groups', groupRoute)
Router.use('/pages', pageRoute)
Router.use('/collections', collectiondRoute)
Router.use('/conversations', conversationdRoute)
Router.use('/history-article', historyArticledRoute)
Router.use('/province', provinceRoute)
Router.use('/reels', reelsRoute)
Router.use('/messages', messageRoute)
Router.use('/history-page', historyViewPagedRoute)
Router.use('/ai', AIRoute)
Router.use('/tourist-destination', touristDestinationRoute)
Router.use('/recommendations', recommendationRoute)

// Router.use('/reports', reportRoute)

export const APIsRoute = Router