import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2, XCircle, FileText, Download } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const pdfStyles = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '30 40', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  headerRight: { textAlign: 'right', fontSize: 9, color: '#64748b', lineHeight: 1.4 },
  subHeader: { padding: '15 40', flexDirection: 'row', justifyContent: 'space-between', color: 'white', fontSize: 10, fontWeight: 'bold' },
  content: { padding: 40 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
  metaText: { fontSize: 9, color: '#64748b', marginBottom: 20 },
  clientBox: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 4, marginBottom: 30, borderLeft: '4px solid #2563eb' },
  clientLabel: { fontSize: 8, fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
  clientName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  clientDetails: { fontSize: 10, color: '#475569', marginTop: 2 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 15, borderBottom: '1px solid #e2e8f0', paddingBottom: 5 },
  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottom: '2px solid #e2e8f0', paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #f1f5f9', paddingVertical: 8, alignItems: 'center' },
  tableRowSub: { flexDirection: 'row', borderBottom: '1px solid #f8fafc', paddingVertical: 6, alignItems: 'center', backgroundColor: '#fafafa' },
  colDesc: { flex: 4, fontSize: 10, color: '#334155' },
  colQtd: { flex: 1, fontSize: 10, textAlign: 'center', color: '#475569' },
  colPrice: { flex: 1.5, fontSize: 10, textAlign: 'right', color: '#475569' },
  colDisc: { flex: 1, fontSize: 10, textAlign: 'right', color: '#475569' },
  colTotal: { flex: 1.5, fontSize: 10, textAlign: 'right', fontWeight: 'bold', color: '#0f172a' },
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', padding: '15 20', backgroundColor: '#f8fafc', borderRadius: 4, marginTop: 10, fontWeight: 'bold', fontSize: 14, color: '#0f172a' },
  conditionsBox: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 4, marginTop: 10, fontSize: 9, lineHeight: 1.6, color: '#475569' },
  signatures: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 60, paddingHorizontal: 20 },
  signatureBlock: { alignItems: 'center' },
  signatureLine: { borderTop: '1px solid #94a3b8', width: 200, paddingTop: 8, textAlign: 'center', fontSize: 9, color: '#0f172a', fontWeight: 'bold' },
  signatureRole: { textAlign: 'center', fontSize: 8, color: '#64748b', marginTop: 2 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', color: '#94a3b8', fontSize: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }
})

const SimpleProposalPDF = ({ proposal }: { proposal: any }) => {
  const primaryColor = '#3b82f6'; // Default color
  const services = proposal.services || [];
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: primaryColor }}>NEXOCORP</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Soluções em Tecnologia</Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text>CNPJ: 60.490.491/0001-28</Text>
            <Text>Av. Oliveira Paiva, 1206 - Térreo</Text>
            <Text>Fortaleza - CE, 60822-130</Text>
            <Text>contato@nexocorp.com.br</Text>
            <Text>www.nexocorp.com.br</Text>
          </View>
        </View>

        <View style={{ ...pdfStyles.subHeader, backgroundColor: primaryColor }}>
          <Text>PROPOSTA COMERCIAL #{proposal.id.substring(0, 8).toUpperCase()}</Text>
          <Text>Válida até {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString('pt-BR') : '-'}</Text>
        </View>

        <View style={pdfStyles.content}>
          <Text style={pdfStyles.mainTitle}>{proposal.title}</Text>
          <Text style={pdfStyles.metaText}>Data de Emissão: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</Text>

          <View style={{ ...pdfStyles.clientBox, borderLeftColor: primaryColor }}>
            <Text style={{ ...pdfStyles.clientLabel, color: primaryColor }}>DADOS DO CLIENTE</Text>
            <Text style={pdfStyles.clientName}>{proposal.companyName || 'Cliente não informado'}</Text>
            <Text style={pdfStyles.clientDetails}>A/C: {proposal.contactName || 'Contato não informado'}</Text>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor, borderBottomColor: primaryColor }}>ESCOPO DA PROPOSTA</Text>
          
          <Text style={{ fontSize: 10, color: '#334155', marginBottom: 15, lineHeight: 1.5 }}>
            Apresentamos abaixo nossa proposta comercial para os serviços solicitados, elaborada com base nas necessidades identificadas.
          </Text>

          <View style={pdfStyles.table}>
            <View style={{...pdfStyles.tableHeader, borderBottomColor: primaryColor}}>
              <Text style={{...pdfStyles.colDesc, fontWeight: 'bold', color: primaryColor}}>Descrição do Item</Text>
              <Text style={{...pdfStyles.colQtd, fontWeight: 'bold', color: primaryColor}}>Qtd</Text>
              <Text style={{...pdfStyles.colPrice, fontWeight: 'bold', color: primaryColor}}>V. Unitário</Text>
              <Text style={{...pdfStyles.colDisc, fontWeight: 'bold', color: primaryColor}}>Desc.</Text>
              <Text style={{...pdfStyles.colTotal, fontWeight: 'bold', color: primaryColor}}>V. Total</Text>
            </View>
            
            {services.map((item: any, index: number) => (
              <React.Fragment key={item.id}>
                <View style={{...pdfStyles.tableRow, backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                  <Text style={{...pdfStyles.colDesc, fontWeight: 'bold'}}>{item.description || 'Serviço'}</Text>
                  <Text style={pdfStyles.colQtd}>{item.quantity} {item.unit || 'un'}</Text>
                  <Text style={pdfStyles.colPrice}>R$ {(item.unitPrice || 0).toFixed(2)}</Text>
                  <Text style={pdfStyles.colDisc}>{item.discount > 0 ? `${item.discount}%` : '-'}</Text>
                  <Text style={pdfStyles.colTotal}>R$ {((item.quantity * (item.unitPrice || 0)) * (1 - (item.discount || 0) / 100)).toFixed(2)}</Text>
                </View>
                {item.subItems && item.subItems.map((sub: any) => (
                  <View style={pdfStyles.tableRowSub} key={sub.id}>
                    <Text style={{...pdfStyles.colDesc, paddingLeft: 10, color: '#64748b'}}>• {sub.description || 'Equipamento'}</Text>
                    <Text style={{...pdfStyles.colQtd, color: '#64748b'}}>{sub.quantity} {sub.unit || 'un'}</Text>
                    <Text style={pdfStyles.colPrice}>-</Text>
                    <Text style={pdfStyles.colDisc}>-</Text>
                    <Text style={pdfStyles.colTotal}>-</Text>
                  </View>
                ))}
              </React.Fragment>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
            <View style={{ width: 250 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 5 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: primaryColor }}>VALOR TOTAL:</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: primaryColor }}>R$ {(proposal.totalValue || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor, borderBottomColor: primaryColor, marginTop: 30 }}>TERMOS E CONDIÇÕES</Text>
          <View style={pdfStyles.conditionsBox}>
            {proposal.observations && (
              <>
                <Text style={{ fontWeight: 'bold', marginBottom: 4, color: '#0f172a' }}>Observações Adicionais:</Text>
                <Text>{proposal.observations}</Text>
              </>
            )}
          </View>

          <View style={pdfStyles.signatures}>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>NEXOCORP LTDA - ME</Text>
              <Text style={pdfStyles.signatureRole}>Fornecedor</Text>
            </View>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>{proposal.companyName || 'Cliente'}</Text>
              <Text style={pdfStyles.signatureRole}>De Acordo (Cliente)</Text>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.footer} render={({ pageNumber, totalPages }) => (
          `Documento gerado eletronicamente - Página ${pageNumber} de ${totalPages}`
        )} fixed />
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
        setProposal({ ...proposal, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' });
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
              {proposal.status === 'ACCEPTED' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Aceita
                </span>
              )}
              {proposal.status === 'REJECTED' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <XCircle className="w-4 h-4 mr-2" /> Recusada
                </span>
              )}
              {proposal.status === 'SENT' && (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity} {item.unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.discount || 0}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">R$ {total.toFixed(2)}</td>
                          </tr>
                          {item.subItems && item.subItems.length > 0 && item.subItems.map((subItem: any) => {
                            return (
                              <tr key={subItem.id} className="bg-gray-50/50">
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 pl-10">↳ {subItem.description}</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{subItem.quantity} {subItem.unit}</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
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
            {proposal.status === 'SENT' && (
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
