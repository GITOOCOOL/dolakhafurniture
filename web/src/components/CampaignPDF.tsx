import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Campaign, Voucher } from '@/types';
import { urlFor } from '@/lib/sanity';

const styles = (themeColor: string = 'warmth') => StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: 'app', // Bone / Cream
    fontFamily: 'Helvetica',
  },
  // FIRST PAGE / COVER
  coverPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'app',
  },
  heroBanner: {
    width: '100%',
    height: '45%',
    objectFit: 'cover',
  },
  coverContent: {
    padding: 40,
    flex: 1,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Times-Roman',
    color: 'heading',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coverTagline: {
    fontSize: 16,
    fontFamily: 'Times-Italic',
    color: themeColor,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#666',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  dateInfo: {
    fontSize: 9,
    color: '#999',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  vouchersSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: themeColor,
    borderRadius: 4,
  },
  voucherHeading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: 'heading',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voucherItem: {
    fontSize: 10,
    marginBottom: 6,
    color: '#444',
  },
  voucherCode: {
    fontFamily: 'Helvetica-Bold',
    color: themeColor,
  },
  promoBox: {
    marginTop: 25,
  },
  promoText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: 'espresso',
  },
  promoCode: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000',
  },

  // PRODUCT PAGE (3x2 Grid)
  section: {
    padding: '20 40 40 40', // Minimal top padding to max out space
    backgroundColor: 'app',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeColor,
    paddingBottom: 5,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    color: 'heading',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  productCard: {
    width: '48%',
    height: 225, // Absolute points to guarantee 3 rows fit (A4 is 842pt)
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
  },
  productImageContainer: {
    width: '100%',
    height: 160, // Fixed height for image stability
    marginBottom: 5,
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productInfo: {
    paddingTop: 5,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  productName: {
    fontSize: 11, // Increased
    fontFamily: 'Helvetica-Bold',
    color: 'heading',
    marginBottom: 4,
    textTransform: 'uppercase',
    maxHeight: 28,
    overflow: 'hidden',
  },
  productPrice: {
    fontSize: 13, // Increased
    color: themeColor,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  productDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  productMeta: {
    fontSize: 8.5, // Increased
    color: '#666',
    fontFamily: 'Helvetica',
  },
  productMaterial: {
    fontSize: 8.5, // Increased
    color: '#888',
    fontFamily: 'Helvetica-Oblique',
  },

  // BACK COVER
  backCover: {
    height: '100%',
    backgroundColor: 'heading',
    color: 'app',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  contactHeading: {
    fontSize: 20, // Bolder
    fontFamily: 'Times-Roman',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 15,
    width: '100%',
    textAlign: 'center',
  },
  qrSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  qrCode: {
    width: 180, // Much larger
    height: 180,
  },
  qrText: {
    fontSize: 10,
    color: 'app',
    marginTop: 15,
    opacity: 0.8,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialItem: {
    fontSize: 12, // Increased
    marginBottom: 10,
    fontFamily: 'Helvetica',
    opacity: 0.9,
    letterSpacing: 1,
  },
  phoneItem: {
    fontSize: 22, // High impact
    fontFamily: 'Helvetica-Bold',
    marginTop: 30,
    color: themeColor,
    letterSpacing: 1,
  },
  whatsappText: {
    fontSize: 10,
    color: 'app',
    marginTop: 8,
    fontFamily: 'Helvetica-Oblique',
    opacity: 0.8,
  },
  brandName: {
    position: 'absolute',
    bottom: 60,
    fontSize: 10,
    letterSpacing: 6,
    opacity: 0.4,
    textTransform: 'uppercase',
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#AAA',
    fontFamily: 'Helvetica',
  }
});

interface Props {
  campaign: Campaign;
  welcomeVoucher?: Voucher | null;
}

// Helper to chunk products into pages of 6 (3x2 grid)
const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const CampaignPDF = ({ campaign, welcomeVoucher }: Props) => {
  const currentStyles = styles(campaign.themeColor);
  const productChunks = chunkArray(campaign.products || [], 6);
  const campaignUrl = `https://dolakhafurniture.com/campaign/${campaign.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(campaignUrl)}`;

  return (
    <Document title={`${campaign.title} - Dolakha Catalog`}>
      {/* Page 1: COVER & INSTRUCTIONS */}
      <Page size="A4" style={currentStyles.page}>
        <View style={currentStyles.coverPage}>
          {campaign.banner && (
            <Image 
              src={urlFor(campaign.banner).width(1200).url()} 
              style={currentStyles.heroBanner} 
            />
          )}
          <View style={currentStyles.coverContent}>
            <Text style={currentStyles.coverSubtitle}>Seasonal Collection</Text>
            <Text style={currentStyles.coverTitle}>{campaign.title}</Text>
            {campaign.tagline && <Text style={currentStyles.coverTagline}>{campaign.tagline}</Text>}
            
            <View style={currentStyles.dateInfo}>
              <Text>Catalog Validity: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Active'}</Text>
            </View>

            {campaign.vouchers && campaign.vouchers.length > 0 && (
              <View style={currentStyles.vouchersSection}>
                <Text style={currentStyles.voucherHeading}>Campaign Special Offers</Text>
                {campaign.vouchers.map(v => (
                  <Text key={v.code} style={currentStyles.voucherItem}>
                    • <Text style={currentStyles.voucherCode}>{v.code}</Text> {v.details ? ` - ${v.details}` : ''}
                  </Text>
                ))}
                <Text style={{ fontSize: 7, color: '#888', marginTop: 8 }}>* Mention these codes during your store visit or apply at checkout.</Text>
              </View>
            )}

            <View style={[currentStyles.vouchersSection, { marginTop: 15 }]}>
              <Text style={currentStyles.voucherHeading}>JOIN US</Text>
              <Text style={currentStyles.promoText}>
                Visit <Text style={currentStyles.promoCode}>dolakhafurniture.com</Text> and sign up for an account to receive an additional <Text style={currentStyles.promoCode}>{welcomeVoucher?.discountValue || 5}% DISCOUNT</Text> on your first purchase!
              </Text>
              <Text style={[currentStyles.promoText, { marginTop: 6 }]}>
                Use Voucher: <Text style={currentStyles.voucherCode}>{welcomeVoucher?.code || 'WELCOME5'}</Text>
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PRODUCT PAGES (6 per page - 3x2 Grid) */}
      {productChunks.map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={currentStyles.section}>
          <View style={currentStyles.header}>
            <Text style={currentStyles.title}>{campaign.title} • Catalogue</Text>
            <Text style={{ fontSize: 8, color: campaign.themeColor || 'warmth' }}>{pageIdx + 1}</Text>
          </View>
          
          <View style={currentStyles.grid}>
            {chunk.map((product) => (
              <View key={product._id} style={currentStyles.productCard} wrap={false}>
                <View style={currentStyles.productImageContainer}>
                  {product.mainImage && (
                    <Image 
                      src={urlFor(product.mainImage).width(600).url()} 
                      style={currentStyles.productImage} 
                    />
                  )}
                </View>
                <View style={currentStyles.productInfo}>
                  <Text style={currentStyles.productName}>{product.title}</Text>
                  <Text style={currentStyles.productPrice}>NPR {product.price.toLocaleString()}</Text>
                  
                  <View style={currentStyles.productDetailRow}>
                    <Text style={currentStyles.productMeta}>
                      {product.length && product.breadth && product.height 
                        ? `${product.length}" × ${product.breadth}" × ${product.height}"`
                        : "Custom Dimensions"}
                    </Text>
                    {product.material && (
                      <Text style={currentStyles.productMaterial}>{product.material}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={currentStyles.footer} fixed>
            <Text>Dolakha Furniture • High Fidelity Interior Systems</Text>
            <Text render={({ pageNumber, totalPages }) => `PAGE ${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      ))}

      {/* FINAL PAGE: CONTACT & SOCIALS */}
      <Page size="A4" style={currentStyles.page}>
        <View style={currentStyles.backCover}>
          <Text style={currentStyles.contactHeading}>CONTACT US</Text>
          
          <View style={currentStyles.qrSection}>
            <Image src={qrUrl} style={currentStyles.qrCode} />
          </View>
          <Text style={currentStyles.qrText}>Scan to browse full collection online</Text>
          
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={currentStyles.socialItem}>FB: @dolakhafurniture</Text>
            <Text style={currentStyles.socialItem}>IG: @dolakhafurnituredesign</Text>
            <Text style={currentStyles.socialItem}>TikTok: @dolakhafurniture</Text>
          </View>
          
          <Text style={currentStyles.phoneItem}>9861326486 | 9808005210</Text>
          <Text style={currentStyles.whatsappText}>Text us on WhatsApp for instant quote</Text>
          
          <Text style={[currentStyles.socialItem, { marginTop: 40, fontSize: 10, opacity: 0.6 }]}>dolakhafurniture.com</Text>
          
          <Text style={currentStyles.brandName}>Est. 2018 • Crafted with pride in Nepal</Text>
        </View>
      </Page>
    </Document>
  );
};
