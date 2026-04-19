import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { Campaign } from '@/types';
import { urlFor } from '@/lib/sanity';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#FAF9F6', // Bone / Cream
    fontFamily: 'Helvetica',
  },
  // FIRST PAGE / COVER
  coverPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FAF9F6',
  },
  heroBanner: {
    width: '100%',
    height: '40%',
    objectFit: 'cover',
  },
  coverContent: {
    padding: 40,
    flex: 1,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Times-Roman',
    color: '#2C1E1A',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  coverSubtitle: {
    fontSize: 14,
    fontFamily: 'Times-Italic',
    color: '#D2691E',
    marginBottom: 20,
  },
  dateInfo: {
    fontSize: 10,
    color: '#666',
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
    borderColor: '#D2691E',
  },
  voucherHeading: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2C1E1A',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  voucherItem: {
    fontSize: 10,
    marginBottom: 5,
  },
  voucherCode: {
    fontFamily: 'Helvetica-Bold',
    color: '#D2691E',
  },
  promoBox: {
    marginTop: 20,
  },
  promoText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#3d2b1f',
  },
  promoCode: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },

  // PRODUCT PAGE
  section: {
    padding: 40,
    backgroundColor: '#FAF9F6',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D2691E',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Times-Roman',
    color: '#2C1E1A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    height: '28%', // Fits 3 rows comfortably
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  productImage: {
    width: '100%',
    height: '65%',
    objectFit: 'cover',
    marginBottom: 8,
  },
  productName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#2C1E1A',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 11,
    color: '#D2691E',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  productDims: {
    fontSize: 7,
    color: '#666',
    fontFamily: 'Helvetica',
  },

  // BACK COVER
  backCover: {
    height: '100%',
    backgroundColor: '#2C1E1A',
    color: '#FAF9F6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  contactHeading: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
  socialItem: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },
  phoneItem: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    color: '#D2691E',
  },
  brandName: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    letterSpacing: 4,
    opacity: 0.5,
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
    color: '#999',
    fontFamily: 'Helvetica',
  }
});

interface Props {
  campaign: Campaign;
}

// Helper to chunk products into pages of 6
const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const CampaignPDF = ({ campaign }: Props) => {
  const productChunks = chunkArray(campaign.products || [], 6);

  return (
    <Document title={`${campaign.title} - Dolakha Catalog`}>
      {/* Page 1: COVER & INSTRUCTIONS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          {campaign.banner && (
            <Image 
              src={urlFor(campaign.banner).width(1200).url()} 
              style={styles.heroBanner} 
            />
          )}
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>{campaign.title}</Text>
            <Text style={styles.coverSubtitle}>Active Campaign Collection</Text>
            
            <View style={styles.dateInfo}>
              <Text>Campaign Duration: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Active'}</Text>
            </View>

            {campaign.vouchers && campaign.vouchers.length > 0 && (
              <View style={styles.vouchersSection}>
                <Text style={styles.voucherHeading}>Campaign Vouchers</Text>
                {campaign.vouchers.map(v => (
                  <Text key={v.code} style={styles.voucherItem}>
                    • Code: <Text style={styles.voucherCode}>{v.code}</Text> {v.details ? ` - ${v.details}` : ''}
                  </Text>
                ))}
                <Text style={{ fontSize: 8, color: '#666', marginTop: 8 }}>* Apply voucher code at checkout to claim your offer.</Text>
              </View>
            )}

            <View style={styles.promoBox}>
              <Text style={styles.voucherHeading}>Extra Rewards</Text>
              <Text style={styles.promoText}>
                Visit our website <Text style={styles.promoCode}>dolakhafurniture.com</Text> and sign up for an account to receive an additional <Text style={styles.promoCode}>5% DISCOUNT</Text> on your first purchase!
              </Text>
              <Text style={[styles.promoText, { marginTop: 10 }]}>
                Use Voucher: <Text style={styles.voucherCode}>WELCOME5</Text>
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PRODUCT PAGES (6 per page) */}
      {productChunks.map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.title}>{campaign.title} - Collection</Text>
            <Text style={{ fontSize: 8, color: '#D2691E' }}>Page {pageIdx + 1}</Text>
          </View>
          
          <View style={styles.grid}>
            {chunk.map((product) => (
              <View key={product._id} style={styles.productCard} wrap={false}>
                {product.mainImage && (
                  <Image 
                    src={urlFor(product.mainImage).width(400).url()} 
                    style={styles.productImage} 
                  />
                )}
                <View>
                  <Text style={styles.productName}>{product.title}</Text>
                  <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
                  <Text style={styles.productDims}>
                    {product.length && product.breadth && product.height 
                      ? `${product.length}" × ${product.breadth}" × ${product.height}"`
                      : "Custom Dimensions"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text>Dolakha Furniture • Crafted in Nepal</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </Page>
      ))}

      {/* FINAL PAGE: CONTACT & SOCIALS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.backCover}>
          <Text style={styles.contactHeading}>Connect With Us</Text>
          
          <Text style={styles.socialItem}>Facebook: @dolakhafurniture</Text>
          <Text style={styles.socialItem}>Instagram: @dolakhafurnituredesign</Text>
          <Text style={styles.socialItem}>TikTok: @dolakhafurniture</Text>
          
          <Text style={styles.phoneItem}>9861326486 | 9808005210</Text>
          
          <Text style={[styles.socialItem, { marginTop: 40, fontSize: 10 }]}>Visit us at: dolakhafurniture.com</Text>
          
          <Text style={styles.brandName}>Dolakha Furniture Archive</Text>
        </View>
      </Page>
    </Document>
  );
};
