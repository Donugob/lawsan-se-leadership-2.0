import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, but we'll use defaults for simplicity first
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#F8F7F4', // cream
    fontFamily: 'Helvetica',
  },
  container: {
    border: '2pt solid #081d0f', // forest-900
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#081d0f',
    padding: 30,
    color: '#d4ba54', // gold-500
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#9bcbac', // forest-200
    letterSpacing: 1,
  },
  body: {
    padding: 40,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  label: {
    fontSize: 8,
    color: '#4fa56d', // forest-400
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  value: {
    fontSize: 14,
    color: '#081d0f',
    fontWeight: 'bold',
  },
  regIdSection: {
    backgroundColor: '#fbf8ed', // gold-50
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
    border: '1pt dashed #dcc673', // gold-400
  },
  regId: {
    fontSize: 32,
    color: '#081d0f',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  footer: {
    borderTop: '1pt solid #e7f0eb',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#75b88c',
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Leadership Conference 2.0</Text>
          <Text style={styles.subtitle}>OFFICIAL DELEGATE TICKET</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.regIdSection}>
            <Text style={styles.label}>Registration ID</Text>
            <Text style={styles.regId}>#{delegate.regId}</Text>
          </View>

          <View style={styles.infoSection}>
            <View>
              <Text style={styles.label}>Delegate Name</Text>
              <Text style={styles.value}>{delegate.firstName} {delegate.lastName}</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{delegate.isStudent ? 'Student' : 'Professional'}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View>
              <Text style={styles.label}>Affiliation</Text>
              <Text style={styles.value}>{delegate.university || delegate.profession || 'N/A'}</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>Enugu, Nigeria</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>LAWSAN South East Zone</Text>
          <Text style={styles.footerText}>© 2026 Leadership Conference</Text>
        </View>
      </View>
    </Page>
  </Document>
);
