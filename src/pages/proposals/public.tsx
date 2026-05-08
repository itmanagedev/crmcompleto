import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2, XCircle, FileText, Download } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const pdfStyles = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '20 40', backgroundColor: '#475569' },
  headerLogoText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  headerRight: { textAlign: 'right', fontSize: 8, color: '#e2e8f0', lineHeight: 1.4 },
  
  subHeader: { padding: '8 40', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#6366f1' },
  subHeaderText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  
  content: { padding: '30 40' },
  mainTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, textTransform: 'uppercase' },
  metaText: { fontSize: 9, color: '#64748b', marginBottom: 25 },
  
  twoCols: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  boxCol: { flex: 1, backgroundColor: '#f8fafc', padding: 15, borderLeft: '2px solid #cbd5e1' },
  boxColTitle: { fontSize: 8, color: '#64748b', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  boxColHighlight: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, textTransform: 'uppercase' },
  boxColText: { fontSize: 9, color: '#475569', marginBottom: 2 },
  
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#6366f1', marginBottom: 10, textTransform: 'uppercase' },
  
  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#475569', padding: '8 10', alignItems: 'center' },
  tableHeaderItem: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #f1f5f9', padding: '8 10', alignItems: 'center' },
  tableRowSub: { flexDirection: 'row', padding: '4 10', paddingLeft: 20, alignItems: 'center' },
  
  colDesc: { flex: 4, fontSize: 9, color: '#334155', fontWeight: 'bold' },
  colDescSub: { flex: 4, fontSize: 8, color: '#64748b' },
  colQtd: { flex: 1, fontSize: 9, textAlign: 'center', color: '#475569' },
  colPrice: { flex: 1.5, fontSize: 9, textAlign: 'right', color: '#475569' },
  colDisc: { flex: 1, fontSize: 9, textAlign: 'right', color: '#475569' },
  colTotal: { flex: 1.5, fontSize: 9, textAlign: 'right', color: '#334155' },
  
  totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  totalBox: { backgroundColor: '#475569', padding: '10 20', borderRadius: 2, flexDirection: 'row', gap: 30, alignItems: 'center' },
  totalBoxLabel: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  totalBoxValue: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  
  conditionsBox: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 2, fontSize: 9, color: '#475569', lineHeight: 1.5 },
  
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, paddingHorizontal: 30 },
  signatureBlock: { alignItems: 'center', width: 200 },
  signatureLine: { borderTop: '1px solid #94a3b8', width: '100%', paddingTop: 8, textAlign: 'center', fontSize: 9, color: '#0f172a', textTransform: 'uppercase' },
  signatureRole: { textAlign: 'center', fontSize: 8, color: '#64748b', marginTop: 2 },
  
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 10 },
  footerText: { color: '#94a3b8', fontSize: 7 }
})

const SimpleProposalPDF = ({ proposal }: { proposal: any }) => {
  const primaryColor = '#6366f1'; // Default color
  const services = proposal.services ? (typeof proposal.services === 'string' ? JSON.parse(proposal.services) : proposal.services) : [];
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.headerLogoText}>NEXOCORP</Text>
          <View style={pdfStyles.headerRight}>
            <Text>60.490.491/0001-28</Text>
            <Text>Av. Oliveira Paiva, 1206 - Térreo - Cidade dos Funcionários - Fortaleza - CE</Text>
            <Text>financeiro@nexocorp.com.br</Text>
            <Text>www.nexocorp.com.br</Text>
          </View>
        </View>

        <View style={{ ...pdfStyles.subHeader, backgroundColor: primaryColor }}>
          <Text style={pdfStyles.subHeaderText}>PROPOSTA COMERCIAL #{proposal.id.substring(0, 8).toUpperCase()}</Text>
          <Text style={pdfStyles.subHeaderText}>Válida até {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString('pt-BR') : '-'}</Text>
        </View>

        <View style={pdfStyles.content}>
          <Text style={pdfStyles.mainTitle}>{proposal.title || 'PROPOSTA COMERCIAL'}</Text>
          <Text style={pdfStyles.metaText}>Emitida em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')} • Vendedor: {proposal.contactName || 'Consultor'}</Text>

          <View style={pdfStyles.twoCols}>
            <View style={{ ...pdfStyles.boxCol, borderLeftColor: primaryColor }}>
              <Text style={pdfStyles.boxColTitle}>CLIENTE</Text>
              <Text style={pdfStyles.boxColHighlight}>{proposal.companyName || 'Cliente não informado'}</Text>
              <Text style={pdfStyles.boxColText}>A/C: {proposal.contactName || 'Não informado'}</Text>
            </View>
            <View style={{ ...pdfStyles.boxCol, borderLeftColor: primaryColor }}>
              <Text style={pdfStyles.boxColTitle}>PAGAMENTO</Text>
              <Text style={pdfStyles.boxColText}>Forma: PIX</Text>
              <Text style={pdfStyles.boxColText}>TBD Conforme Proposta</Text>
            </View>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor }}>ITENS DA PROPOSTA</Text>
          
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={{ ...pdfStyles.colDesc, color: '#ffffff' }}>Descrição</Text>
              <Text style={{ ...pdfStyles.colQtd, color: '#ffffff' }}>Qtd</Text>
              <Text style={{ ...pdfStyles.colPrice, color: '#ffffff' }}>Preço Unit.</Text>
              <Text style={{ ...pdfStyles.colDisc, color: '#ffffff' }}>Desc%</Text>
              <Text style={{ ...pdfStyles.colTotal, color: '#ffffff' }}>Subtotal</Text>
            </View>
            
            {services.map((item: any, index: number) => (
              <React.Fragment key={item.id || index}>
                <View style={{ ...pdfStyles.tableRow, backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <Text style={pdfStyles.colDesc}>{item.description || 'Serviço'}</Text>
                  <Text style={pdfStyles.colQtd}>{item.quantity}</Text>
                  <Text style={pdfStyles.colPrice}>R$ {parseFloat(item.unitPrice || 0).toFixed(2)}</Text>
                  <Text style={pdfStyles.colDisc}>{item.discount > 0 ? `${item.discount}%` : '-'}</Text>
                  <Text style={pdfStyles.colTotal}>R$ {((item.quantity * (item.unitPrice || 0)) * (1 - (item.discount || 0) / 100)).toFixed(2)}</Text>
                </View>
                {item.subItems && item.subItems.map((sub: any, subIndex: number) => (
                  <View style={pdfStyles.tableRowSub} key={sub.id || subIndex}>
                    <Text style={pdfStyles.colDescSub}>└ {sub.description || 'Equipamento'}</Text>
                    <Text style={pdfStyles.colQtd}>{sub.quantity}</Text>
                    <Text style={pdfStyles.colPrice}>R$ 0,00</Text>
                    <Text style={pdfStyles.colDisc}>-</Text>
                    <Text style={pdfStyles.colTotal}>R$ 0,00</Text>
                  </View>
                ))}
              </React.Fragment>
            ))}
          </View>

          <View style={pdfStyles.totalsContainer}>
            <View style={pdfStyles.totalBox}>
              <Text style={pdfStyles.totalBoxLabel}>TOTAL</Text>
              <Text style={pdfStyles.totalBoxValue}>R$ {parseFloat(proposal.totalValue || 0).toFixed(2)}</Text>
            </View>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor, marginTop: 30 }}>CONDIÇÕES COMERCIAIS</Text>
          <View style={pdfStyles.conditionsBox}>
            <Text>{proposal.observations || 'EM CASO DE ACEITE, PRECISO ENVIAR O CONTRATO PARA ASSINATURA E, APÓS, SEGUIR COM AS INSTALAÇÕES DO CIRCUITO.'}</Text>
          </View>

          <View style={pdfStyles.signatures}>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>NEXOCORP LTDA - ME</Text>
              <Text style={pdfStyles.signatureRole}>Fornecedor</Text>
            </View>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>{proposal.companyName || 'Cliente'}</Text>
              <Text style={pdfStyles.signatureRole}>Cliente</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>Proposta gerada automaticamente. Válida conforme data indicada.</Text>
          <Text style={pdfStyles.footerText}>#{proposal.id.substring(0, 8).toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function PublicProposalView() {
  const { hash } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/public/${hash}`);
        if (!res.ok) throw new Error('Proposta não encontrada');
        const data = await res.json();
        setProposal(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [hash]);

  const handleAction = async (action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/${action}`, { method: 'POST' });
      if (res.ok) {
        setProposal({ ...proposal, status: action === 'accept' ? 'accepted' : 'rejected' });
        alert(`Proposta ${action === 'accept' ? 'aceita' : 'recusada'} com sucesso!`);
      } else {
        alert('Erro ao processar ação');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar ação');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const blob = await pdf(<SimpleProposalPDF proposal={proposal} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Proposta-${proposal.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erro ao gerar PDF da proposta.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando proposta...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!proposal) return null;

  const services = proposal.services as any[] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Proposta Comercial</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enviada para {proposal.contactName || proposal.companyName || 'Cliente'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Detalhes da Proposta</CardTitle>
                <CardDescription>Referência: {proposal.id}</CardDescription>
              </div>
              {proposal.status === 'accepted' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Aceita
                </span>
              )}
              {proposal.status === 'rejected' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <XCircle className="w-4 h-4 mr-2" /> Recusada
                </span>
              )}
              {proposal.status === 'sent' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Aguardando Resposta
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8 bg-white">
            
            {/* Services Table */}
            <div>
              <h3 className="text-lg font-medium mb-4">Serviços e Produtos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Desconto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((item: any) => {
                      const subtotal = item.quantity * item.unitPrice;
                      const discountAmount = subtotal * ((item.discount || 0) / 100);
                      const total = subtotal - discountAmount;
                      return (
                        <React.Fragment key={item.id}>
                          <tr>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              <p>{item.name || item.description}</p>
                              {item.details && <p className="text-xs text-gray-500 font-normal mt-1">{item.details}</p>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity} {item.unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.discount || 0}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">R$ {total.toFixed(2)}</td>
                          </tr>
                          {item.subItems && item.subItems.length > 0 && item.subItems.map((subItem: any) => {
                            return (
                              <tr key={subItem.id} className="bg-gray-50/50">
                                <td className="px-6 py-2 text-sm text-gray-500 pl-10">
                                  <p>↳ {subItem.name || subItem.description}</p>
                                  {subItem.details && <p className="text-xs font-normal mt-0.5 ml-4">{subItem.details}</p>}
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{subItem.quantity} {subItem.unit}</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">R$ {parseFloat(subItem.unitPrice || 0).toFixed(2)}</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">R$ {((subItem.quantity * (subItem.unitPrice || 0))).toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="text-xl font-bold text-gray-900">
                  Total Final: R$ {proposal.totalValue.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Observations */}
            {proposal.observations && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Observações</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{proposal.observations}</p>
              </div>
            )}

            {/* Actions */}
            {proposal.status === 'sent' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleAction('reject')}
                >
                  <XCircle className="w-5 h-5 mr-2" /> Recusar Proposta
                </Button>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAction('accept')}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Aceitar Proposta
                </Button>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
               <Button variant="ghost" className="text-gray-500" onClick={handleGeneratePDF}>
                 <Download className="w-4 h-4 mr-2" /> Baixar PDF
               </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
