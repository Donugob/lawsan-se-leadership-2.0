import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 10, color: '#666' },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' },
  tableCell: { margin: 5, fontSize: 9 },
  // Audit list styles
  auditCol1: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  auditCol2: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  auditCol3: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  auditCol4: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  auditCol5: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
});

interface PdfProps {
  delegates: any[];
  isAudit: boolean;
  filtersInfo: string;
}

export default function DelegatePdfDocument({ delegates, isAudit, filtersInfo }: PdfProps) {
  return (
    <Document>
      <Page size="A4" orientation={isAudit ? "landscape" : "portrait"} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Conference Delegates Report</Text>
          <Text style={styles.subtitle}>{filtersInfo}</Text>
          <Text style={styles.subtitle}>Total Records: {delegates.length}</Text>
        </View>

        <View style={styles.table}>
          {isAudit ? (
            // Audit List Header
            <View style={styles.tableRow}>
              <View style={styles.auditCol1}><Text style={styles.tableCellHeader}>Name</Text></View>
              <View style={styles.auditCol2}><Text style={styles.tableCellHeader}>Email</Text></View>
              <View style={styles.auditCol3}><Text style={styles.tableCellHeader}>Phone</Text></View>
              <View style={styles.auditCol4}><Text style={styles.tableCellHeader}>Reg ID</Text></View>
              <View style={styles.auditCol5}><Text style={styles.tableCellHeader}>Affiliation (School/Prof)</Text></View>
            </View>
          ) : (
            // Simple List Header
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: '35%' }}><Text style={styles.tableCellHeader}>Name</Text></View>
              <View style={{ ...styles.tableCol, width: '45%' }}><Text style={styles.tableCellHeader}>School / Profession</Text></View>
              <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCellHeader}>Reg ID</Text></View>
            </View>
          )}

          {delegates.map((delegate, i) => (
            isAudit ? (
              <View style={styles.tableRow} key={i}>
                <View style={styles.auditCol1}><Text style={styles.tableCell}>{delegate.firstName} {delegate.lastName}</Text></View>
                <View style={styles.auditCol2}><Text style={styles.tableCell}>{delegate.email}</Text></View>
                <View style={styles.auditCol3}><Text style={styles.tableCell}>{delegate.phone}</Text></View>
                <View style={styles.auditCol4}><Text style={styles.tableCell}>{delegate.regId}</Text></View>
                <View style={styles.auditCol5}>
                  <Text style={styles.tableCell}>
                    {delegate.isStudent ? delegate._canonicalSchool : delegate.profession}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.tableRow} key={i}>
                <View style={{ ...styles.tableCol, width: '35%' }}><Text style={styles.tableCell}>{delegate.firstName} {delegate.lastName}</Text></View>
                <View style={{ ...styles.tableCol, width: '45%' }}>
                  <Text style={styles.tableCell}>
                    {delegate.isStudent ? delegate._canonicalSchool : delegate.profession}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCell}>{delegate.regId}</Text></View>
              </View>
            )
          ))}
        </View>
      </Page>
    </Document>
  );
}
