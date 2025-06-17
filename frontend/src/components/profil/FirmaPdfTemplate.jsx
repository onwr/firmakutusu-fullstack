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

  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ffffff",
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

  // Company profile card
  profileCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 40,
    marginVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(28, 85, 64, 0.08)",
    border: "1px solid #E2E8F0",
  },

  companyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginBottom: 40,
    border: "4px solid #F1F5F9",
    objectFit: "contain",
  },

  companyName: {
    fontSize: 48,
    fontWeight: 700,
    color: "#1c5540",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  companyTitle: {
    fontSize: 32,
    color: "#64748B",
    marginBottom: 32,
    textAlign: "center",
    fontWeight: 500,
  },

  companyDescription: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 600,
  },

  // Information sections
  sectionContainer: {
    marginBottom: 32,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  sectionIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#1c5540",
    borderRadius: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1c5540",
    letterSpacing: 0.2,
  },

  infoGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 12px rgba(28, 85, 64, 0.06)",
    border: "1px solid #E2E8F0",
  },

  infoRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "flex-start",
  },

  infoRowLast: {
    borderBottomWidth: 0,
  },

  infoLabel: {
    width: "35%",
    fontSize: 13,
    color: "#475569",
    fontWeight: 500,
    paddingRight: 16,
  },

  infoValue: {
    width: "65%",
    fontSize: 13,
    color: "#1c5540",
    fontWeight: 400,
    lineHeight: 1.4,
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

const FirmaPdfTemplate = ({ firmaDetay }) => {
  const today = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      {/* İlk Sayfa - Profil Kartı */}
      <Page size="A4" style={styles.page}>
        {/* Modern gradient header */}
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

        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          {firmaDetay?.profil_resmi_url && (
            <Image
              src={firmaDetay.profil_resmi_url}
              style={styles.companyLogo}
            />
          )}
          <Text style={styles.companyName}>{firmaDetay?.marka_adi || "-"}</Text>
          <Text style={styles.companyTitle}>
            {firmaDetay?.firma_unvani || "-"}
          </Text>
        </View>
      </Page>

      {/* İkinci Sayfa - Kurumsal Bilgiler */}
      <Page size="A4" style={styles.page}>
        {/* Main content */}
        <View style={styles.contentContainer}>
          <Text style={styles.pageTitle}>Kurumsal Bilgiler</Text>
          <Text style={styles.pageSubtitle}>
            Detaylı firma bilgileri ve iletişim
          </Text>

          {/* Company information */}
          <View style={styles.sectionContainer}>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Marka Adı</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.marka_adi || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Firma Ünvanı</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.firma_unvani || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vergi Kimlik No</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.vergi_kimlik_no || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sektör</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.sektor || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hizmet Alanı</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.hizmet_alani || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kuruluş Tarihi</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.kurulus_tarihi || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kuruluş Şehri</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.kurulus_sehri || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Merkez Adresi</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.merkez_adresi || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>KEP Adresi</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.kep_adresi || "-"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-Posta</Text>
                <Text style={styles.infoValue}>{firmaDetay?.email || "-"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Web Sitesi</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.web_sitesi || "-"}
                </Text>
              </View>

              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>İletişim Telefonu</Text>
                <Text style={styles.infoValue}>
                  {firmaDetay?.iletisim_telefonu || "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Bu belge {today} tarihinde oluşturulmuştur.
            </Text>
            <Text style={styles.footerBrand}>Firma Kutusu © 2025</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FirmaPdfTemplate;
