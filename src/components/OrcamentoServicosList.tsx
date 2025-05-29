
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useServicos } from "@/hooks/useServicos"
import { useOrcamentoServicos, useCreateOrcamentoServico, useDeleteOrcamentoServico } from "@/hooks/useOrcamentoServicos"

interface OrcamentoServicosListProps {
  orcamentoId?: string
}

export const OrcamentoServicosList = ({ orcamentoId }: OrcamentoServicosListProps) => {
  const [selectedServicoId, setSelectedServicoId] = useState("")
  const [horas, setHoras] = useState("")
  const [valorHora, setValorHora] = useState("")

  const { data: servicos = [] } = useServicos()
  const { data: orcamentoServicos = [] } = useOrcamentoServicos(orcamentoId)
  const createOrcamentoServico = useCreateOrcamentoServico()
  const deleteOrcamentoServico = useDeleteOrcamentoServico()

  const handleAddServico = () => {
    if (!orcamentoId || !selectedServicoId || !horas || !valorHora) {
      return
    }

    createOrcamentoServico.mutate({
      orcamento_id: orcamentoId,
      servico_id: selectedServicoId,
      horas: parseFloat(horas),
      valor_hora: parseFloat(valorHora),
    })

    // Limpar campos
    setSelectedServicoId("")
    setHoras("")
    setValorHora("")
  }

  const handleRemoveServico = (id: string) => {
    if (!orcamentoId) return
    deleteOrcamentoServico.mutate({ id, orcamentoId })
  }

  const handleServicoChange = (servicoId: string) => {
    setSelectedServicoId(servicoId)
    const servico = servicos.find(s => s.id === servicoId)
    if (servico) {
      setValorHora(servico.valor_hora.toString())
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Serviços</h3>
      
      {/* Lista de serviços existentes */}
      <div className="space-y-2 mb-4">
        {orcamentoServicos.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
            <span className="text-sm">{item.servico?.nome}</span>
            <span className="text-sm text-center">{item.horas}</span>
            <span className="text-sm text-center">R$ {item.valor_hora.toString()}</span>
            <span className="text-sm text-center font-medium">
              R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveServico(item.id)}
              className="w-8 h-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar novo serviço */}
      <div className="grid grid-cols-5 gap-2 items-end">
        <div>
          <label className="text-sm font-medium">Serviço</label>
          <Select value={selectedServicoId} onValueChange={handleServicoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {servicos.map((servico) => (
                <SelectItem key={servico.id} value={servico.id}>
                  {servico.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Horas</label>
          <Input
            type="number"
            step="0.1"
            placeholder="Horas"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Valor/Hora</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valorHora}
            onChange={(e) => setValorHora(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Total</label>
          <Input
            value={horas && valorHora ? 
              `R$ ${(parseFloat(horas) * parseFloat(valorHora)).toFixed(2)}` : 
              "R$ 0,00"
            }
            readOnly
            className="bg-gray-50"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleAddServico}
          disabled={!selectedServicoId || !horas || !valorHora || createOrcamentoServico.isPending}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
