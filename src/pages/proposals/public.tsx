import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2, XCircle, FileText, Download } from "lucide-react";

export default function PublicProposalView() {
  const { hash } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/${hash}`);
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
            Enviada para {proposal.deal?.contactName || 'Cliente'}
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
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity} {item.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.discount || 0}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">R$ {total.toFixed(2)}</td>
                        </tr>
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
               <Button variant="ghost" className="text-gray-500">
                 <Download className="w-4 h-4 mr-2" /> Baixar PDF
               </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
