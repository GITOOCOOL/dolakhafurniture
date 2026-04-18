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
  coverPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C1E1A', // Espresso
    color: '#FAF9F6',
  },
  coverTitle: {
    fontSize: 48,
    fontFamily: 'Times-Roman',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  coverSubtitle: {
    fontSize: 18,
    fontFamily: 'Times-Italic',
    opacity: 0.8,
  },
  section: {
    padding: 40,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#D2691E', // Terracotta
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Times-Roman',
    color: '#2C1E1A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: '47%',
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    marginBottom: 10,
  },
  productName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2C1E1A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    color: '#D2691E', // Terracotta
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  productDims: {
    fontSize: 8,
    color: '#666',
    fontFamily: 'Helvetica',
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
    fontSize: 10,
    color: '#999',
    fontFamily: 'Helvetica',
  }
});

interface Props {
  campaign: Campaign;
}

export const CampaignPDF = ({ campaign }: Props) => (
  <Document title={`${campaign.title} - Dolakha Catalog`}>
    {/* Page 1: COVER */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverTitle}>{campaign.title}</Text>
        <Text style={styles.coverSubtitle}>Active Campaign Catalog</Text>
      </View>
    </Page>

    {/* Page 2+: CATALOG GRID */}
    <Page size="A4" style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>The Collection</Text>
        <Text style={{ fontSize: 10, color: '#D2691E' }}>Dolakha Furniture Archive</Text>
      </View>
      
      <View style={styles.grid}>
        {campaign.products?.map((product) => (
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
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  </Document>
);
