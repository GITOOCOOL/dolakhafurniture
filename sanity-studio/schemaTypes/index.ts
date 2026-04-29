import product from './product'
import order from './order'
import category from './category'
import bulletin from './bulletin'
import heroImage from './heroImage'
import promotion from './promotion'
import paymentAccount from './paymentAccount'
import discountVoucher from './discountVoucher'
import inquiry from './inquiry'
import campaign from './campaign'
import faq from './faq'
import lead from './lead'
import customProduct from './customProduct'
import material from './material'
import socialMedia from './socialMedia'
import socialChannel from './socialChannel'
import adminLog from './adminLog'
import blockContent from './blockContent'
import checkoutSettings from './checkoutSettings'
import { broadcastType } from './broadcast'
import { businessMetaData } from './businessMetaData'
import contentIdea from './contentIdea'

export const schemaTypes = [
  broadcastType,
  socialMedia, 
  socialChannel,
  adminLog,
  blockContent,
  product, 
  order, 
  category, 
  bulletin, 
  heroImage, 
  promotion, 
  paymentAccount, 
  discountVoucher, 
  inquiry, 
  lead, 
  customProduct, 
  material, 
  campaign, 
  faq,
  checkoutSettings,
  businessMetaData,
  contentIdea
]