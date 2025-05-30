
import { Settings, CheckCircle, Clock, AlertTriangle, Package, Eye, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"
import { format } from "date-fns"

interface OrdemServicoCardProps {
  os: OrdemServicoWithDetails
  onView: (os: OrdemServicoWithDetails) => void
  onEdit: (os: OrdemServicoWithDetails) => void
}

export const OrdemServicoCard = ({ os, onView, onEdit }: OrdemServicoCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Andamento":
        return <Settings className="w-4 h-4" />
      case "Aguardando Peças":
        return <Package className="w-4 h-4" />
      case "Finalizado":
        return <CheckCircle className="w-4 h-4" />
      case "Entregue":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Andamento":
        return "bg-blue-100 text-blue-800"
      case "Aguardando Peças":
        return "bg-yellow-100 text-yellow-800"
      case "Finalizado":
        return "bg-green-100 text-green-800"
      case "Entregue":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVeiculoInfo = (os: OrdemServicoWithDetails) => {
    if (os.veiculo) {
      return `${os.veiculo.marca} ${os.veiculo.modelo} ${os.veiculo.ano} - ${os.veiculo.placa}`
    }
    
    if (os.cliente && os.cliente.marca && os.cliente.modelo) {
      return `${os.cliente.marca} ${os.cliente.modelo} ${os.cliente.ano} - ${os.cliente.placa}`
    }
    
    return 'N/A'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">OS {os.numero}</CardTitle>
              <Badge className={getStatusColor(os.status_servico)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(os.status_servico)}
                  {os.status_servico}
                </div>
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p><strong>Cliente:</strong> {os.cliente?.nome}</p>
                <p><strong>Veículo:</strong> {getVeiculoInfo(os)}</p>
                {os.km_atual && <p><strong>Km Atual:</strong> {os.km_atual}</p>}
              </div>
              <div>
                <p><strong>Início:</strong> {format(new Date(os.data_inicio), 'dd/MM/yyyy')}</p>
                <p><strong>Prazo:</strong> {format(new Date(os.prazo_conclusao), 'dd/MM/yyyy')}</p>
                <p><strong>Status Pagamento:</strong> 
                  <Badge variant={os.status_pagamento === 'Pendente' ? "destructive" : "default"} className="ml-2">
                    {os.status_pagamento}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-2xl font-bold text-primary">
              R$ {os.valor_total.toFixed(2).replace('.', ',')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(os)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(os)}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Peças e Serviços */}
          <div className="col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Peças</h4>
                <div className="space-y-1">
                  {os.orcamento?.orcamento_pecas?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantidade}x {item.peca?.nome}</span>
                      <span>R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">Nenhuma peça</span>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Serviços</h4>
                <div className="space-y-1">
                  {os.orcamento?.orcamento_servicos?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.horas}h {item.servico?.nome}</span>
                      <span>R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">Nenhum serviço</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações Financeiras */}
          <div className="space-y-3">
            <h4 className="font-medium">Financeiro</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor Total:</span>
                <span className="font-medium">R$ {os.valor_total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Valor Pago:</span>
                <span className="font-medium">R$ {os.valor_pago.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>A Pagar:</span>
                <span className="font-medium">R$ {(os.valor_a_pagar || 0).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Forma: {os.forma_pagamento || "Não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
