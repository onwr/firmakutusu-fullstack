import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Font tanımlamaları
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "/fonts/OpenSans-Light.ttf",
      fontWeight: 300,
    },
    {
      src: "/fonts/OpenSans-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/OpenSans-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/fonts/OpenSans-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "/fonts/OpenSans-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// Modern ve kurumsal stiller
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FAFBFC",
    padding: 0,
    fontFamily: "Open Sans",
    position: "relative",
  },

  // Modern gradient header
  headerGradient: {
    width: "100%",
    height: 120,
    backgroundColor: "#1c5540",
    position: "relative",
    overflow: "hidden",
  },

  headerPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 200,
    height: 120,
    backgroundColor: "#2d6a4f",
    transform: "skewX(-15deg)",
    transformOrigin: "top right",
  },

  headerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 24,
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  brandInfo: {
    flexDirection: "column",
  },

  brandName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  brandTagline: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.3,
  },

  headerDate: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  dateText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.3,
  },

  // Main content area
  contentContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1c5540",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  pageSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: 400,
  },

  // Invoice information sections
  invoiceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  invoiceInfoBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 10,
    boxShadow: "0 2px 12px rgba(28, 85, 64, 0.06)",
    border: "1px solid #E2E8F0",
  },

  invoiceInfoTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1c5540",
    marginBottom: 16,
  },

  invoiceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  invoiceInfoLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: 500,
  },

  invoiceInfoValue: {
    fontSize: 12,
    color: "#1c5540",
    fontWeight: 600,
  },

  // Items table
  itemsTable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 40,
    boxShadow: "0 2px 12px rgba(28, 85, 64, 0.06)",
    border: "1px solid #E2E8F0",
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
    marginBottom: 12,
  },

  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1c5540",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  tableCell: {
    fontSize: 12,
    color: "#475569",
  },

  // Totals section
  totalsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 40,
    boxShadow: "0 2px 12px rgba(28, 85, 64, 0.06)",
    border: "1px solid #E2E8F0",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  totalLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: 500,
  },

  totalValue: {
    fontSize: 14,
    color: "#1c5540",
    fontWeight: 600,
  },

  grandTotal: {
    fontSize: 18,
    color: "#1c5540",
    fontWeight: 700,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
    marginTop: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 20,
    paddingTop: 50,
    paddingHorizontal: 40,
  },

  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: 400,
  },

  footerBrand: {
    fontSize: 11,
    color: "#1c5540",
    fontWeight: 600,
  },
});

const FaturaPdfTemplate = ({ faturaDetay }) => {
  const today = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerGradient}>
          <View style={styles.headerPattern} />
          <View style={styles.headerContent}>
            <View style={styles.brandContainer}>
              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>Firma Kutusu</Text>
                <Text style={styles.brandTagline}>HEDA BİLİŞİM A.Ş</Text>
              </View>
            </View>
            <View style={styles.headerDate}>
              <Text style={styles.dateText}>{today}</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.pageTitle}>FATURA</Text>
          <Text style={styles.pageSubtitle}>
            Fatura No: {faturaDetay?.fatura_no || "-"}
          </Text>

          {/* Fatura Bilgileri */}
          <View style={styles.invoiceInfoContainer}>
            {/* Satıcı Bilgileri */}
            <View style={styles.invoiceInfoBox}>
              <Text style={styles.invoiceInfoTitle}>Satıcı Bilgileri</Text>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>Firma Adı:</Text>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.satici_firma || "-"}
                </Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>Vergi No:</Text>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.satici_vergi_no || "-"}
                </Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>Adres:</Text>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.satici_adres || "-"}
                </Text>
              </View>
            </View>

            {/* Alıcı Bilgileri */}
            <View style={styles.invoiceInfoBox}>
              <Text style={styles.invoiceInfoTitle}>Alıcı Bilgileri</Text>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.alici_firma || "-"}
                </Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.alici_vergi_no || "-"}
                </Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoValue}>
                  {faturaDetay?.alici_adres || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Fatura Kalemleri */}
          <View style={styles.itemsTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                Ürün/Hizmet
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Miktar</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                Birim Fiyat
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>KDV</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Toplam</Text>
            </View>

            {faturaDetay?.kalemler?.map((kalem, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {kalem.urun_adi}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {kalem.miktar}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {kalem.birim_fiyat} TL
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {kalem.kdv}%
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {kalem.toplam} TL
                </Text>
              </View>
            ))}
          </View>

          {/* Toplamlar */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ara Toplam:</Text>
              <Text style={styles.totalValue}>
                {faturaDetay?.ara_toplam || "0.00"} TL
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>KDV Toplam:</Text>
              <Text style={styles.totalValue}>
                {faturaDetay?.kdv_toplam || "0.00"} TL
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Genel Toplam:</Text>
              <Text style={styles.totalValue}>
                {faturaDetay?.genel_toplam || "0.00"} TL
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Bu fatura {today} tarihinde oluşturulmuştur.
            </Text>
            <Text style={styles.footerBrand}>Firma Kutusu © 2025</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FaturaPdfTemplate;
