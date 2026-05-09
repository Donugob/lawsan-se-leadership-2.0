import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Note: Standard PDF fonts are limited. For "incredible" design, we rely on layout and color.
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#06160b', // forest-950
  },
  outerBorder: {
    border: '1.5pt solid #d4ba54', // gold-500
    height: '100%',
    padding: 2,
    borderRadius: 25,
  },
  innerContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    backgroundColor: '#06160b',
    padding: 40,
    alignItems: 'center',
    borderBottom: '4pt solid #d4ba54',
  },
  headerTop: {
    fontSize: 10,
    color: '#d4ba54',
    letterSpacing: 4,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'extrabold',
    marginBottom: 4,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 9,
    color: '#9bcbac', // forest-200
    letterSpacing: 1,
  },
  body: {
    padding: 45,
    flex: 1,
  },
  regIdCard: {
    backgroundColor: '#fbf8ed', // gold-50
    border: '1pt solid #d4ba54',
    borderRadius: 15,
    padding: 25,
    marginBottom: 40,
    alignItems: 'center',
  },
  regLabel: {
    fontSize: 8,
    color: '#d4ba54',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  regId: {
    fontSize: 42,
    color: '#06160b',
    fontWeight: 'black',
    letterSpacing: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
  },
  infoBox: {
    width: '45%',
    marginBottom: 25,
  },
  label: {
    fontSize: 7,
    color: '#75b88c', // forest-400
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 13,
    color: '#06160b',
    fontWeight: 'bold',
  },
  eventDetails: {
    marginTop: 'auto',
    backgroundColor: '#06160b',
    margin: 30,
    padding: 25,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeft: '4pt solid #d4ba54',
  },
  eventItem: {
    flex: 1,
  },
  eventLabel: {
    fontSize: 7,
    color: '#9bcbac',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eventValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    textAlign: 'center',
    borderTop: '1pt solid #f0f0f0',
  },
  footerText: {
    fontSize: 8,
    color: '#cccccc',
    letterSpacing: 1,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: 60,
    color: '#f9f9f9',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    zIndex: -1,
    opacity: 0.5,
  }
});

interface TicketProps {
  delegate: {
    firstName: string;
    lastName: string;
    email: string;
    regId: string;
    university?: string;
    profession?: string;
    isStudent: boolean;
  };
}

export const DelegateTicket = ({ delegate }: TicketProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.outerBorder}>
        <View style={styles.innerContainer}>
          <Text style={styles.watermark}>LAWSAN SE</Text>

          <View style={styles.header}>
            <Text style={styles.headerTop}>OFFICIAL PASS</Text>
            <Text style={styles.title}>Leadership Conference 2.0</Text>
            <Text style={styles.tagline}>Emerging Lawyers, Emerging Realities</Text>
          </View>

          <View style={styles.body}>
            <View style={styles.regIdCard}>
              <Text style={styles.regLabel}>Registration ID</Text>
              <Text style={styles.regId}>#{delegate.regId}</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{delegate.firstName} {delegate.lastName}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Delegate Category</Text>
                <Text style={styles.value}>{delegate.isStudent ? 'Standard (Student)' : 'Professional'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{delegate.email}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Institutional Affiliation</Text>
                <Text style={styles.value}>{delegate.university || delegate.profession || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.eventDetails}>
              <View style={styles.eventItem}>
                <Text style={styles.eventLabel}>Date & Time</Text>
                <Text style={styles.eventValue}>4th June 2026 | 10:00 AM</Text>
              </View>
              <View style={styles.eventItem}>
                <Text style={styles.eventLabel}>Venue</Text>
                <Text style={styles.eventValue}>G.O.U, Enugu</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>THIS TICKET IS NON-TRANSFERABLE • VALID FOR ONE PERSON ONLY</Text>
            <Text style={{ ...styles.footerText, marginTop: 4, color: '#06160b', fontWeight: 'bold' }}>LAWSAN SOUTH EAST ZONE</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
